/**
 * Primary syllable counts from the shared lexicon pack
 * (Misaki + CMUdict + WikiPron). Built by scripts/build-pronunciation.mjs.
 * Lazy-loaded so the main chunk stays light (heuristic until ready).
 */
import {
  getLexicon,
  isLexiconReady,
  loadLexicon,
  __setLexiconForTests,
  type Lexicon,
} from "@/lib/data/lexicon";
import { clearMemo } from "./countWord";

type SyllableMap = Record<string, number>;

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

/**
 * Lazy-load the embedded lexicon (separate binary asset).
 * Resolves to an empty map for API compatibility — use {@link lookupDict}.
 */
export function loadDict(): Promise<SyllableMap> {
  return loadLexicon().then(() => {
    if (!readyAnnounced) announceReady();
    return Object.create(null) as SyllableMap;
  });
}

/** True once the lexicon has finished loading. */
export function isDictReady(): boolean {
  return isLexiconReady();
}

/** Look up the CMU-primary syllable count for a normalized word. */
export function lookupDict(normalized: string): number | undefined {
  const lex = getLexicon();
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

export function dictSize(): number {
  return getLexicon()?.words.length ?? 0;
}

/** Test helper — inject a decoded lexicon without hitting the binary pack. */
export function __setLexiconDictForTests(lex: Lexicon | null): void {
  __setLexiconForTests(lex);
  if (lex === null) readyAnnounced = false;
  announceReady();
}

/** Test helper — inject a map without hitting the binary pack. */
export function __setDictForTests(next: SyllableMap | null): void {
  if (next === null) {
    __setLexiconDictForTests(null);
    return;
  }
  const words = Object.keys(next).sort();
  const syllables = new Uint8Array(words.length);
  const wordToId = new Map<string, number>();
  for (let i = 0; i < words.length; i++) {
    wordToId.set(words[i]!, i);
    syllables[i] = next[words[i]!] ?? 0;
  }
  __setLexiconDictForTests({ words, wordToId, syllables });
}
