import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  decodeDefinitions,
  decodeIpa,
  decodeLexicon,
  decodeRhymePack,
  decodeStress,
  decodeThesaurus,
  decodeVariants,
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

  it("decodes slant rhyme pack and resolves a family bucket", () => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const pack = decodeRhymePack(
      new Uint8Array(readFileSync(join(packsDir, "rhyme-slant.bin"))),
      "slant",
    );
    expect(pack.byWord.length).toBe(lex.words.length);
    const night = lex.wordToId.get("night");
    expect(night).toBeDefined();
    const keys = pack.byWord[night!]!;
    expect(keys.length).toBeGreaterThan(0);
    // Family key first; side shares AI+T with night.
    const familyBucket = pack.buckets[keys[0]!]!;
    expect(familyBucket.map((id) => lex.words[id])).toEqual(
      expect.arrayContaining(["side"]),
    );
  });

  it("decodes a definitions digraph pack and resolves a head", async () => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const lightId = lex.wordToId.get("light");
    const nightId = lex.wordToId.get("night");
    expect(lightId).toBeDefined();
    expect(nightId).toBeDefined();
    expect(lightId!).toBeLessThan(nightId!);

    const { encodeDefinitions, decodeDefinitions: decodeDefsNode } =
      await import("../../../scripts/lib/dictPack.mjs");
    const sample = encodeDefinitions([
      {
        wordId: lightId!,
        senses: [
          { usage: 0, source: 0, gloss: "electromagnetic radiation" },
          { usage: 2, source: 1, gloss: "of little weight" },
        ],
      },
      {
        wordId: nightId!,
        senses: [{ usage: 0, source: 0, gloss: "the time of darkness" }],
      },
    ]);
    const roundTrip = decodeDefsNode(sample);
    expect(roundTrip.entries).toHaveLength(2);
    expect(roundTrip.entries[0].wordId).toBe(lightId);
    expect(roundTrip.entries[1].wordId).toBe(nightId);
    expect(roundTrip.entries[0].senses[0].gloss).toBe(
      "electromagnetic radiation",
    );

    const client = decodeDefinitions(new Uint8Array(sample));
    expect(client.byWordId.get(lightId!)?.length).toBe(2);
    expect(client.byWordId.get(nightId!)?.[0]?.gloss).toBe(
      "the time of darkness",
    );

    await expect(
      Promise.resolve().then(() =>
        encodeDefinitions([
          {
            wordId: lightId!,
            senses: [{ usage: 0, source: 0, gloss: "a" }],
          },
          {
            wordId: lightId!,
            senses: [{ usage: 0, source: 0, gloss: "b" }],
          },
        ]),
      ),
    ).rejects.toThrow(/duplicate wordId/);

    await expect(
      Promise.resolve().then(() =>
        encodeDefinitions([
          {
            wordId: lightId!,
            senses: [{ usage: 9, source: 0, gloss: "bad usage" }],
          },
        ]),
      ),
    ).rejects.toThrow(/invalid usage/);

    const packBuf = new Uint8Array(
      readFileSync(join(packsDir, "defs/defs-li.bin")),
    );
    const pack = decodeDefinitions(packBuf);
    const senses = pack.byWordId.get(lightId!);
    expect(senses?.length).toBeGreaterThan(0);
    expect(senses![0]!.gloss.length).toBeGreaterThan(3);

    // Wiktionary-only heads should retain multiple POS after fill fix.
    let wiktMulti = 0;
    for (const entrySenses of pack.byWordId.values()) {
      if (entrySenses.every((s) => s.source === 1)) {
        const usages = new Set(entrySenses.map((s) => s.usage));
        if (usages.size > 1) wiktMulti += 1;
      }
    }
    expect(wiktMulti).toBeGreaterThan(0);
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

  it("includes OEWN co-hyponym neighbors for bathe", () => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const pack = decodeThesaurus(
      new Uint8Array(readFileSync(join(packsDir, "thesaurus.bin"))),
    );
    const bathe = pack.entries.find((e) => {
      const head = resolveDictId(e.headId, lex.words, pack.overflowWords);
      return head === "bathe";
    });
    expect(bathe).toBeDefined();
    const verb = bathe!.usages.find((u) => u.usage === 1 /* v */);
    expect(verb).toBeDefined();
    const syns = verb!.synIds.map((id) =>
      resolveDictId(id, lex.words, pack.overflowWords),
    );
    expect(syns).toEqual(expect.arrayContaining(["wash", "scrub"]));
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

  it("decodes ipa pack aligned with lexicon", () => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const ipa = decodeIpa(
      new Uint8Array(readFileSync(join(packsDir, "ipa.bin"))),
    );
    expect(ipa.ipas.length).toBe(lex.words.length);
    const poem = lex.wordToId.get("poem");
    expect(poem).toBeDefined();
    expect(ipa.ipas[poem!]).toBe("pˈoʊəm");
    const filled = ipa.ipas.reduce((n, s) => n + (s ? 1 : 0), 0);
    expect(filled).toBeGreaterThan(200_000);
  });

  it("decodes variants pack with fire and curated juliet alts", () => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const variants = decodeVariants(
      new Uint8Array(readFileSync(join(packsDir, "variants.bin"))),
    );
    expect(variants.byWordId.size).toBeGreaterThan(3_000);

    const fireId = lex.wordToId.get("fire");
    expect(fireId).toBeDefined();
    expect(lex.syllables[fireId!]).toBe(2);
    const fireAlts = variants.byWordId.get(fireId!);
    expect(fireAlts).toBeDefined();
    expect(fireAlts!.some((a) => a.syllables === 1)).toBe(true);

    const julietId = lex.wordToId.get("juliet");
    expect(julietId).toBeDefined();
    expect(lex.syllables[julietId!]).toBe(3);
    const julietAlts = variants.byWordId.get(julietId!);
    expect(julietAlts).toBeDefined();
    expect(julietAlts!.some((a) => a.syllables === 2)).toBe(true);
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

