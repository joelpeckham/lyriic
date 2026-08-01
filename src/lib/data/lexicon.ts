/**
 * Shared lemma lexicon + syllable counts (lexicon.bin).
 */

import { createLazyBinData, type Lexicon } from "@/lib/data/dictPack";

export type { Lexicon };
const store = createLazyBinData<Lexicon>(
  () => import("./packs/lexicon.bin?url").then((m) => m.default as string),
  "lexicon",
  (decoded) => {
    if (decoded.kind !== "lexicon") {
      throw new Error("expected lexicon pack");
    }
    // Rebuild Map after worker structured-clone just in case.
    const { words, syllables } = decoded.data;
    const wordToId = new Map<string, number>();
    for (let i = 0; i < words.length; i++) {
      wordToId.set(words[i]!, i);
    }
    return { words, wordToId, syllables };
  },
);

/** Lazy-load the shared lexicon (words + syllable counts). */
export function loadLexicon(): Promise<Lexicon> {
  return store.load();
}

export function isLexiconReady(): boolean {
  return store.isReady();
}

export function getLexicon(): Lexicon | null {
  return store.get();
}

export function idForWord(word: string): number | undefined {
  return store.get()?.wordToId.get(word);
}

export function wordForId(id: number): string | undefined {
  return store.get()?.words[id];
}

export function syllablesForId(id: number): number | undefined {
  const lex = store.get();
  if (!lex || id < 0 || id >= lex.syllables.length) return undefined;
  return lex.syllables[id];
}

export function __setLexiconForTests(lex: Lexicon | null): void {
  store.__setForTests(lex);
}
