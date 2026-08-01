/**
 * Lazy-loaded sparse syllable/stress variants (variants.bin).
 */

import {
  createLazyBinData,
  unpackStressPattern,
  type StressCode,
  type SyllableVariantAlt,
  type VariantsPack,
} from "@/lib/data/dictPack";
import { getLexicon, loadLexicon, syllablesForId } from "@/lib/data/lexicon";
import { lookupStress } from "@/lib/data/stress";
import { normalizeWord } from "@/lib/syllables/normalize";

export type { SyllableVariantAlt, VariantsPack };

export type ResolvedSyllableVariant = {
  syllables: number;
  stress: StressCode[];
};

const store = createLazyBinData<VariantsPack>(
  () => import("./packs/variants.bin?url").then((m) => m.default as string),
  "variants",
  (decoded) => {
    if (decoded.kind !== "variants") {
      throw new Error("expected variants pack");
    }
    // Rebuild Map after worker structured-clone.
    return {
      byWordId: new Map(decoded.data.byWordId),
    };
  },
);

let revision = 0;
let readyAnnounced = false;
const listeners = new Set<() => void>();

/** Monotonic revision bumped when the variants pack becomes ready or is replaced. */
export function getVariantsRevision(): number {
  return revision;
}

/** Subscribe to variants-ready / test-inject notifications. */
export function subscribeVariantsReady(listener: () => void): () => void {
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

/** Lazy-load the variants pack (requires lexicon for word-id alignment). */
export function loadVariants(): Promise<VariantsPack> {
  return loadLexicon().then(() =>
    store.load().then((pack) => {
      if (!readyAnnounced) announceReady();
      return pack;
    }),
  );
}

export function isVariantsReady(): boolean {
  return store.isReady();
}

export function getVariantsPack(): VariantsPack | null {
  return store.get();
}

function resolveWordId(normalized: string): number | undefined {
  const lex = getLexicon();
  if (!lex) return undefined;
  const direct = lex.wordToId.get(normalized);
  if (direct !== undefined) return direct;
  if (normalized.endsWith("'s") && normalized.length > 2) {
    const id = lex.wordToId.get(normalized.slice(0, -2));
    if (id !== undefined) return id;
  }
  if (normalized.endsWith("'") && normalized.length > 1) {
    const id = lex.wordToId.get(normalized.slice(0, -1));
    if (id !== undefined) return id;
  }
  return undefined;
}

/** Non-primary alts for a word (empty when none / pack not ready). */
export function lookupSyllableVariants(
  word: string,
): ResolvedSyllableVariant[] {
  const pack = store.get();
  if (!pack) return [];
  const normalized = normalizeWord(word);
  if (!normalized) return [];
  const id = resolveWordId(normalized);
  if (id === undefined) return [];
  const alts = pack.byWordId.get(id);
  if (!alts || alts.length === 0) return [];
  return alts.map((alt) => ({
    syllables: alt.syllables,
    stress: unpackStressPattern(alt.packedStress, alt.syllables),
  }));
}

/**
 * Stress pattern for a specific syllable count: alt match, else primary when
 * the citation count matches `n`.
 */
export function stressForSyllableCount(
  word: string,
  syllableCount: number,
): StressCode[] | undefined {
  const n = Math.max(0, Math.floor(syllableCount));
  if (n <= 0) return undefined;

  for (const alt of lookupSyllableVariants(word)) {
    if (alt.syllables === n) return alt.stress;
  }

  const normalized = normalizeWord(word);
  if (!normalized) return undefined;
  const id = resolveWordId(normalized);
  if (id === undefined) return undefined;
  const primarySyl = syllablesForId(id);
  if (primarySyl === n) {
    return lookupStress(normalized);
  }
  return undefined;
}

/** Distinct syllable counts available (primary + alts). */
export function syllableCountsForWord(word: string): number[] {
  const normalized = normalizeWord(word);
  if (!normalized) return [];
  const id = resolveWordId(normalized);
  if (id === undefined) return [];
  const primary = syllablesForId(id);
  const counts = new Set<number>();
  if (primary !== undefined && primary >= 1) counts.add(primary);
  for (const alt of lookupSyllableVariants(normalized)) {
    if (alt.syllables >= 1) counts.add(alt.syllables);
  }
  return [...counts].sort((a, b) => a - b);
}

/** Test helper — inject a decoded variants pack without hitting the binary. */
export function __setVariantsForTests(pack: VariantsPack | null): void {
  store.__setForTests(pack);
  if (pack === null) {
    readyAnnounced = false;
    bumpRevision();
    return;
  }
  announceReady();
}
