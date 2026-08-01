/**
 * Shared lemma lexicon + syllable counts (lexicon.bin).
 * Owns revision pubsub and possessive-aware syllable lookup.
 */

import { createLazyBinData, type Lexicon } from "@/lib/data/dictPack";
import { clearMemo } from "@/lib/syllables/countWord";

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

let revision = 0;
let readyAnnounced = false;
const listeners = new Set<() => void>();

/** Monotonic revision bumped when the dict becomes ready or is replaced in tests. */
export function getDictRevision(): number {
  return revision;
}

/** Subscribe to dict-ready / test-inject notifications. Returns unsubscribe. */
export function subscribeDictReady(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyReady(): void {
  for (const listener of listeners) listener();
}

function announceReady(): void {
  clearMemo();
  revision += 1;
  readyAnnounced = true;
  notifyReady();
}

/** Lazy-load the shared lexicon (words + syllable counts). */
export function loadLexicon(): Promise<Lexicon> {
  return store.load().then((lex) => {
    if (!readyAnnounced) announceReady();
    return lex;
  });
}

export function isLexiconReady(): boolean {
  return store.isReady();
}

export function getLexicon(): Lexicon | null {
  return store.get();
}

export function syllablesForId(id: number): number | undefined {
  const lex = store.get();
  if (!lex || id < 0 || id >= lex.syllables.length) return undefined;
  return lex.syllables[id];
}

/** Look up the CMU-primary syllable count for a normalized word. */
export function lookupDict(normalized: string): number | undefined {
  const lex = store.get();
  if (!lex) return undefined;

  const direct = lookupInLex(lex, normalized);
  if (direct !== undefined) return direct;

  // Possessive: teacher's → teacher
  if (normalized.endsWith("'s") && normalized.length > 2) {
    const count = lookupInLex(lex, normalized.slice(0, -2));
    if (count !== undefined) return count;
  }

  // Trailing apostrophe plural possessive: teachers'
  if (normalized.endsWith("'") && normalized.length > 1) {
    const count = lookupInLex(lex, normalized.slice(0, -1));
    if (count !== undefined) return count;
  }

  return undefined;
}

function lookupInLex(lex: Lexicon, word: string): number | undefined {
  const id = lex.wordToId.get(word);
  if (id === undefined) return undefined;
  return lex.syllables[id];
}

/** Test helper — inject a decoded lexicon without hitting the binary pack. */
export function __setLexiconForTests(lex: Lexicon | null): void {
  store.__setForTests(lex);
  if (lex === null) readyAnnounced = false;
  announceReady();
}
