import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  __setLexiconForTests,
  getLexicon,
  type Lexicon,
} from "@/lib/data/lexicon";

import { suggestWords } from "./suggestWords";

function makeLexicon(entries: Array<[string, number]>): Lexicon {
  const sorted = [...entries].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const words = sorted.map(([w]) => w);
  const syllables = new Uint8Array(sorted.map(([, s]) => s));
  const wordToId = new Map(words.map((w, i) => [w, i]));
  return { words, wordToId, syllables };
}

describe("suggestWords", () => {
  let realLex: Lexicon | null = null;

  beforeAll(() => {
    realLex = getLexicon();
  });

  afterEach(() => {
    __setLexiconForTests(realLex);
  });

  it("returns [] when lexicon is not ready", () => {
    __setLexiconForTests(null);
    expect(suggestWords("li")).toEqual([]);
  });

  it("returns [] for empty or too-short prefixes", () => {
    __setLexiconForTests(
      makeLexicon([
        ["light", 1],
        ["like", 1],
      ]),
    );
    expect(suggestWords("")).toEqual([]);
    expect(suggestWords("   ")).toEqual([]);
    expect(suggestWords("l")).toEqual([]);
    expect(suggestWords("L!")).toEqual([]);
  });

  it("binary-searches prefix matches in sorted order up to the default limit", () => {
    __setLexiconForTests(
      makeLexicon([
        ["cat", 1],
        ["liar", 2],
        ["lid", 1],
        ["lie", 1],
        ["life", 1],
        ["lift", 1],
        ["light", 1],
        ["like", 1],
        ["limb", 1],
        ["lime", 1],
        ["limit", 2],
        ["lion", 2],
        ["zip", 1],
      ]),
    );
    expect(suggestWords("li")).toEqual([
      "liar",
      "lid",
      "lie",
      "life",
      "lift",
      "light",
      "like",
      "limb",
    ]);
  });

  it("respects an explicit limit and normalizes casing/punctuation", () => {
    __setLexiconForTests(
      makeLexicon([
        ["light", 1],
        ["like", 1],
        ["limb", 1],
      ]),
    );
    expect(suggestWords("Li!", 2)).toEqual(["light", "like"]);
  });

  it("skips words with unusable syllable counts", () => {
    __setLexiconForTests(
      makeLexicon([
        ["light", 1],
        ["like", 0],
        ["limb", 1],
      ]),
    );
    expect(suggestWords("li")).toEqual(["light", "limb"]);
  });

  it("returns [] when no words match the prefix", () => {
    __setLexiconForTests(
      makeLexicon([
        ["cat", 1],
        ["dog", 1],
      ]),
    );
    expect(suggestWords("zz")).toEqual([]);
  });
});
