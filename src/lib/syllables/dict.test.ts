import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { dictSize, lookupDict } from "./dict";

const STRESS_PHONE = /\d$/;

function syllableCountFromPhones(phones: string[]): number {
  return phones.filter((p) => STRESS_PHONE.test(p)).length;
}

describe("lookupDict", () => {
  it("loads a substantial primary map", () => {
    expect(dictSize()).toBeGreaterThan(100_000);
  });

  it("looks up core words", () => {
    expect(lookupDict("the")).toBe(1);
    expect(lookupDict("fire")).toBe(2);
    expect(lookupDict("poem")).toBe(2);
  });

  it("strips possessive 's when base is in dict", () => {
    // teacher's is also a CMU headword; use a form that may only resolve via strip
    expect(lookupDict("banana's")).toBe(lookupDict("banana"));
  });
});

describe("built JSON matches CMU primary phones", () => {
  it("spot-checks primaries from the vendored dict file", () => {
    const dictPath = join(
      dirname(fileURLToPath(import.meta.url)),
      "../../../scripts/cmudict.dict",
    );
    const text = readFileSync(dictPath, "latin1");
    const samples = [
      "the",
      "fire",
      "poem",
      "rhythm",
      "every",
      "interesting",
      "family",
      "different",
      "comfortable",
      "hour",
      "people",
      "business",
    ];

    for (const word of samples) {
      const line = text
        .split(/\r?\n/)
        .find((row) => row.startsWith(`${word} `) || row.startsWith(`${word}\t`));
      expect(line, `missing primary for ${word}`).toBeTruthy();
      const phones = line!.split(/\s+/).slice(1).filter((p) => !p.startsWith("#"));
      // Drop trailing comments already handled; phones after word
      const clean = line!.replace(/#.*$/, "").trim().split(/\s+/).slice(1);
      const expected = syllableCountFromPhones(clean.length ? clean : phones);
      expect(lookupDict(word)).toBe(expected);
    }
  });
});
