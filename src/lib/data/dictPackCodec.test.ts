import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  decodeLexicon,
  decodeRhymePack,
  decodeStress,
  decodeThesaurus,
  packStressPattern,
  resolveDictId,
  STRESS_PACK_MAX_SYLLABLES,
  unpackStressPattern,
} from "./dictPackCodec";

const packsDir = join(dirname(fileURLToPath(import.meta.url)), "packs");

describe("dictPackCodec", () => {
  it("decodes lexicon with expected size and known counts", () => {
    const buf = new Uint8Array(readFileSync(join(packsDir, "lexicon.bin")));
    const lex = decodeLexicon(buf);
    expect(lex.words.length).toBeGreaterThan(200_000);
    expect(lex.syllables.length).toBe(lex.words.length);
    const fire = lex.wordToId.get("fire");
    expect(fire).toBeDefined();
    expect(lex.syllables[fire!]).toBe(2);
  });

  it("decodes perfect rhyme pack and resolves a bucket", () => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const pack = decodeRhymePack(
      new Uint8Array(readFileSync(join(packsDir, "rhyme-perfect.bin"))),
      "perfect",
    );
    expect(pack.byWord.length).toBe(lex.words.length);
    const light = lex.wordToId.get("light");
    expect(light).toBeDefined();
    const keys = pack.byWord[light!]!;
    expect(keys.length).toBeGreaterThan(0);
    const bucket = pack.buckets[keys[0]!]!;
    expect(bucket.length).toBeGreaterThan(1);
    expect(bucket.map((id) => lex.words[id])).toEqual(
      expect.arrayContaining(["night"]),
    );
  });

  it("decodes thesaurus and resolves a head", () => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const pack = decodeThesaurus(
      new Uint8Array(readFileSync(join(packsDir, "thesaurus.bin"))),
    );
    expect(pack.entries.length).toBeGreaterThan(10_000);
    const dying = pack.entries.find((e) => {
      const head = resolveDictId(e.headId, lex.words, pack.overflowWords);
      return head === "dying";
    });
    expect(dying).toBeDefined();
    const syns = dying!.usages.flatMap((u) =>
      u.synIds.map((id) => resolveDictId(id, lex.words, pack.overflowWords)),
    );
    expect(syns).toEqual(expect.arrayContaining(["death"]));
  });

  it("decodes stress pack aligned with lexicon", () => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const stress = decodeStress(
      new Uint8Array(readFileSync(join(packsDir, "stress.bin"))),
    );
    expect(stress.packed.length).toBe(lex.words.length);
    const poem = lex.wordToId.get("poem");
    expect(poem).toBeDefined();
    const pattern = unpackStressPattern(
      stress.packed[poem!]!,
      lex.syllables[poem!]!,
    );
    expect(pattern).toEqual([1, 0]);
  });

  it("preserves stress for words longer than 8 syllables", () => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const stress = decodeStress(
      new Uint8Array(readFileSync(join(packsDir, "stress.bin"))),
    );
    const long = lex.words.find((w, i) => (lex.syllables[i] ?? 0) > 8);
    expect(long).toBeDefined();
    const id = lex.wordToId.get(long!)!;
    const syl = lex.syllables[id]!;
    expect(syl).toBeLessThanOrEqual(STRESS_PACK_MAX_SYLLABLES);
    const pattern = unpackStressPattern(stress.packed[id]!, syl);
    expect(pattern.length).toBe(syl);
    expect(pattern.some((s) => s === 1)).toBe(true);
  });

  it("round-trips packed stress patterns including 9+ syllables", () => {
    const pattern = [0, 1, 2, 0, 1, 0, 2, 0, 1] as const;
    const packed = packStressPattern(pattern);
    expect(unpackStressPattern(packed, 9)).toEqual([...pattern]);
  });

  it("clamps illegal stress code 3 to 0 on unpack", () => {
    // Manually set syllable 0 bits to 0b11 (= 3).
    expect(unpackStressPattern(0b11, 1)).toEqual([0]);
  });

  it("rejects patterns beyond max syllables", () => {
    const tooLong = new Array(STRESS_PACK_MAX_SYLLABLES + 1).fill(0);
    tooLong[0] = 1;
    expect(() => packStressPattern(tooLong)).toThrow(/max syllables/);
  });
});

