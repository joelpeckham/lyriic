import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { decodeStress } from "@/lib/data/dictPackCodec";
import { __setStressForTests } from "@/lib/data/stress";
import { countWord } from "@/lib/syllables/countWord";

import { heuristicStress } from "./heuristic";
import {
  primaryStressIndex,
  resolveWordStress,
  toBinaryStress,
} from "./resolveWordStress";

const packsDir = join(dirname(fileURLToPath(import.meta.url)), "../data/packs");

function restoreStressPack(): void {
  __setStressForTests(
    decodeStress(new Uint8Array(readFileSync(join(packsDir, "stress.bin")))),
  );
}

afterEach(() => {
  restoreStressPack();
});

describe("resolveWordStress", () => {
  it("returns exact dict stress for poem", () => {
    const result = resolveWordStress("poem");
    expect(result.source).toBe("dict");
    expect(result.pattern).toEqual([1, 0]);
  });

  it("treats single-letter function words as unstressed", () => {
    expect(resolveWordStress("a")).toEqual({
      word: "a",
      pattern: [0],
      source: "heuristic",
    });
    expect(resolveWordStress("I").pattern).toEqual([0]);
    expect(resolveWordStress("o").pattern).toEqual([0]);
  });

  it("strips possessives like syllable lookup", () => {
    const base = resolveWordStress("teacher");
    const possessive = resolveWordStress("teacher's");
    expect(possessive.pattern).toEqual(base.pattern);
    expect(possessive.source).toBe(base.source);
  });

  it("applies primary-index override", () => {
    const result = resolveWordStress("poem", { poem: 1 });
    expect(result.source).toBe("override");
    expect(result.pattern).toEqual([0, 1]);
  });

  it("ignores out-of-range stress overrides", () => {
    const result = resolveWordStress("poem", { poem: 9 });
    expect(result.source).toBe("dict");
    expect(result.pattern).toEqual([1, 0]);
  });

  it("uses heuristic for OOV multi-syllable words", () => {
    const result = resolveWordStress("xyzzyxyzzyqqzz");
    expect(result.source).toBe("heuristic");
    expect(result.pattern.length).toBeGreaterThanOrEqual(2);
    expect(result.pattern[0]).toBe(1);
    expect(result.pattern.slice(1).every((s) => s === 0)).toBe(true);
  });

  it("concatenates hyphenated compounds with a single primary", () => {
    const result = resolveWordStress("wine-bottle");
    expect(result.pattern.length).toBeGreaterThanOrEqual(3);
    expect(result.pattern.filter((s) => s === 1).length).toBe(1);
  });

  it("aligns compound stress to whole-word syllable override length", () => {
    const sylOvr = { "wine-bottle": 5 };
    expect(countWord("wine-bottle", sylOvr).count).toBe(5);
    const result = resolveWordStress("wine-bottle", {}, sylOvr);
    expect(result.pattern.length).toBe(5);
    expect(result.pattern.filter((s) => s === 1).length).toBe(1);
  });

  it("reports heuristic when stress pack is unloaded", () => {
    __setStressForTests(null);
    const result = resolveWordStress("poem");
    expect(result.source).toBe("heuristic");
    expect(result.pattern).toEqual([1, 0]);
  });
});

describe("heuristicStress", () => {
  it("leaves monosyllables unstressed", () => {
    expect(heuristicStress(1)).toEqual([0]);
  });

  it("puts primary on the first syllable for multi-syllable OOV", () => {
    expect(heuristicStress(3)).toEqual([1, 0, 0]);
  });
});

describe("primaryStressIndex", () => {
  it("prefers primary then secondary", () => {
    expect(primaryStressIndex([0, 1, 2])).toBe(1);
    expect(primaryStressIndex([2, 0])).toBe(0);
    expect(primaryStressIndex([0, 0])).toBeNull();
  });
});

describe("toBinaryStress", () => {
  it("collapses primary and secondary to stressed", () => {
    expect(toBinaryStress([0, 1, 2, 0])).toEqual([0, 1, 1, 0]);
  });
});
