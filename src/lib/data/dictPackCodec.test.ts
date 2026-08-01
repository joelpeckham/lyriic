import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  decodeLexicon,
  decodeRhymePack,
  decodeThesaurus,
  resolveDictId,
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
});
