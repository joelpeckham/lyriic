import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

import { decodeIpa, decodeLexicon } from "./dictPackCodec";
import {
  __setIpaForTests,
  ipaForId,
  loadIpa,
  lookupIpa,
} from "./ipa";
import { __setLexiconForTests } from "./lexicon";

const packsDir = join(dirname(fileURLToPath(import.meta.url)), "packs");

describe("ipa lookup", () => {
  beforeAll(() => {
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const ipa = decodeIpa(
      new Uint8Array(readFileSync(join(packsDir, "ipa.bin"))),
    );
    __setLexiconForTests(lex);
    __setIpaForTests(ipa);
  });

  it("resolves primary IPA for known lemmas", () => {
    expect(lookupIpa("poem")).toBe("pˈoʊəm");
    expect(lookupIpa("fire")).toBeTruthy();
    expect(lookupIpa("fire")!.length).toBeGreaterThan(1);
  });

  it("returns undefined for unknown words", () => {
    expect(lookupIpa("zzzznotawordzzzz")).toBeUndefined();
  });

  it("ipaForId matches pack slots", async () => {
    const pack = await loadIpa();
    const lex = decodeLexicon(
      new Uint8Array(readFileSync(join(packsDir, "lexicon.bin"))),
    );
    const id = lex.wordToId.get("light");
    expect(id).toBeDefined();
    expect(ipaForId(id!)).toBe(pack.ipas[id!]);
  });
});
