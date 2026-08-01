/**
 * Lazy-loaded per-syllable stress pack (stress.bin), aligned with lexicon ids.
 */

import {
  createLazyBinData,
  unpackStressPattern,
  type StressCode,
  type StressPack,
} from "@/lib/data/dictPack";
import { getLexicon, loadLexicon, syllablesForId } from "@/lib/data/lexicon";

export type { StressCode, StressPack };

const store = createLazyBinData<StressPack>(
  () => import("./packs/stress.bin?url").then((m) => m.default as string),
  "stress",
  (decoded) => {
    if (decoded.kind !== "stress") {
      throw new Error("expected stress pack");
    }
    const lex = getLexicon();
    if (lex && decoded.data.packed.length !== lex.words.length) {
      throw new Error(
        `stress pack length ${decoded.data.packed.length} !== lexicon ${lex.words.length}`,
      );
    }
    return decoded.data;
  },
);

let revision = 0;
let readyAnnounced = false;
const listeners = new Set<() => void>();

/** Monotonic revision bumped when the stress pack becomes ready or is replaced in tests. */
export function getStressRevision(): number {
  return revision;
}

/** Subscribe to stress-ready / test-inject notifications. Returns unsubscribe. */
export function subscribeStressReady(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyReady(): void {
  for (const listener of listeners) listener();
}

function announceReady(): void {
  revision += 1;
  readyAnnounced = true;
  notifyReady();
}

function bumpRevision(): void {
  revision += 1;
  notifyReady();
}

/** Lazy-load the stress pack (requires lexicon for word-id alignment). */
export function loadStress(): Promise<StressPack> {
  return loadLexicon().then(() =>
    store.load().then((pack) => {
      const lex = getLexicon();
      if (lex && pack.packed.length !== lex.words.length) {
        throw new Error(
          `stress pack length ${pack.packed.length} !== lexicon ${lex.words.length}`,
        );
      }
      if (!readyAnnounced) announceReady();
      return pack;
    }),
  );
}

export function isStressReady(): boolean {
  return store.isReady();
}

export function getStressPack(): StressPack | null {
  return store.get();
}

/** Unpack stress for a lexicon word id (needs syllable count from lexicon). */
export function stressForId(id: number): StressCode[] | undefined {
  const pack = store.get();
  if (!pack || id < 0 || id >= pack.packed.length) return undefined;
  const syl = syllablesForId(id);
  if (syl === undefined || syl < 1) return undefined;
  return unpackStressPattern(pack.packed[id]!, syl);
}

/** Look up stress pattern for a normalized word (possessive-aware). */
export function lookupStress(normalized: string): StressCode[] | undefined {
  const lex = getLexicon();
  const pack = store.get();
  if (!lex || !pack) return undefined;

  const direct = lookupInPack(lex.wordToId, pack, normalized);
  if (direct !== undefined) return direct;

  if (normalized.endsWith("'s") && normalized.length > 2) {
    const pattern = lookupInPack(lex.wordToId, pack, normalized.slice(0, -2));
    if (pattern !== undefined) return pattern;
  }

  if (normalized.endsWith("'") && normalized.length > 1) {
    const pattern = lookupInPack(lex.wordToId, pack, normalized.slice(0, -1));
    if (pattern !== undefined) return pattern;
  }

  return undefined;
}

function lookupInPack(
  wordToId: Map<string, number>,
  pack: StressPack,
  word: string,
): StressCode[] | undefined {
  const id = wordToId.get(word);
  if (id === undefined || id >= pack.packed.length) return undefined;
  const syl = syllablesForId(id);
  if (syl === undefined || syl < 1) return undefined;
  return unpackStressPattern(pack.packed[id]!, syl);
}

/** Test helper — inject a decoded stress pack without hitting the binary. */
export function __setStressForTests(pack: StressPack | null): void {
  store.__setForTests(pack);
  if (pack === null) {
    readyAnnounced = false;
    bumpRevision();
    return;
  }
  announceReady();
}
