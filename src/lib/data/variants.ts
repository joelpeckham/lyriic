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
import { ELISION_BRIDGES } from "@/lib/data/elisionBridges.generated";
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
    const pack = {
      byWordId: new Map(decoded.data.byWordId),
    };
    const lex = getLexicon();
    if (lex) {
      for (const wordId of pack.byWordId.keys()) {
        if (wordId < 0 || wordId >= lex.words.length) {
          throw new Error(
            `variants wordId ${wordId} out of range for lexicon ${lex.words.length}`,
          );
        }
      }
    }
    return pack;
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

function assertVariantsAligned(pack: VariantsPack): void {
  const lex = getLexicon();
  if (!lex) return;
  for (const wordId of pack.byWordId.keys()) {
    if (wordId < 0 || wordId >= lex.words.length) {
      throw new Error(
        `variants wordId ${wordId} out of range for lexicon ${lex.words.length}`,
      );
    }
  }
}

/** Lazy-load the variants pack (requires lexicon for word-id alignment). */
export function loadVariants(): Promise<VariantsPack> {
  return loadLexicon().then(() =>
    store.load().then((pack) => {
      assertVariantsAligned(pack);
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

function altsForWordId(
  pack: VariantsPack,
  id: number,
): ResolvedSyllableVariant[] {
  const alts = pack.byWordId.get(id);
  if (!alts || alts.length === 0) return [];
  return alts.map((alt) => ({
    syllables: alt.syllables,
    stress: unpackStressPattern(alt.packedStress, alt.syllables),
  }));
}

function pushUniqueAlt(
  out: ResolvedSyllableVariant[],
  seen: Set<string>,
  alt: ResolvedSyllableVariant,
): void {
  const key = `${alt.syllables}:${alt.stress.join(",")}`;
  if (seen.has(key)) return;
  seen.add(key);
  out.push(alt);
}

/** Non-primary alts for a word (empty when none / pack not ready). */
export function lookupSyllableVariants(
  word: string,
): ResolvedSyllableVariant[] {
  const pack = store.get();
  if (!pack) return [];
  const normalized = normalizeWord(word);
  if (!normalized) return [];

  const out: ResolvedSyllableVariant[] = [];
  const seen = new Set<string>();

  const id = resolveWordId(normalized);
  if (id !== undefined) {
    for (const alt of altsForWordId(pack, id)) {
      pushUniqueAlt(out, seen, alt);
    }
  }

  // Apostrophe/elided spellings → citation lemma alts (and citation primary).
  const bridged = ELISION_BRIDGES[normalized];
  if (bridged) {
    const bridgeId = resolveWordId(bridged);
    if (bridgeId !== undefined) {
      for (const alt of altsForWordId(pack, bridgeId)) {
        pushUniqueAlt(out, seen, alt);
      }
      const primarySyl = syllablesForId(bridgeId);
      const primaryStress = lookupStress(bridged);
      if (
        primarySyl !== undefined &&
        primarySyl >= 1 &&
        primaryStress &&
        primaryStress.length === primarySyl
      ) {
        pushUniqueAlt(out, seen, {
          syllables: primarySyl,
          stress: primaryStress.slice(),
        });
      }
    }
  }

  return out;
}

/**
 * Resolve primary syllable count + stress for a normalized lemma, falling
 * back to an elision-bridge citation lemma when the surface form is absent.
 */
function resolvePrimaryReading(normalized: string): {
  syllables: number;
  stress: StressCode[];
} | null {
  const id = resolveWordId(normalized);
  if (id !== undefined) {
    const syl = syllablesForId(id);
    const stress = lookupStress(normalized);
    if (syl !== undefined && syl >= 1 && stress && stress.length === syl) {
      return { syllables: syl, stress };
    }
  }

  const bridged = ELISION_BRIDGES[normalized];
  if (!bridged) return null;
  const bridgeId = resolveWordId(bridged);
  if (bridgeId === undefined) return null;
  const syl = syllablesForId(bridgeId);
  const stress = lookupStress(bridged);
  if (syl === undefined || syl < 1 || !stress || stress.length !== syl) {
    return null;
  }
  return { syllables: syl, stress };
}

/**
 * Stress pattern for a specific syllable count: citation primary when it
 * matches `n`, else the first same-count alt from variants.bin (including
 * elision-bridge alts when the surface form is not in the lexicon).
 */
export function stressForSyllableCount(
  word: string,
  syllableCount: number,
): StressCode[] | undefined {
  const n = Math.max(0, Math.floor(syllableCount));
  if (n <= 0) return undefined;

  const normalized = normalizeWord(word);
  if (!normalized) return undefined;

  const primary = resolvePrimaryReading(normalized);
  if (!primary) return undefined;
  if (primary.syllables === n) {
    return primary.stress.slice();
  }

  for (const alt of lookupSyllableVariants(normalized)) {
    if (alt.syllables === n) return alt.stress;
  }
  return undefined;
}

/** Distinct syllable counts available (primary + alts). */
export function syllableCountsForWord(word: string): number[] {
  const normalized = normalizeWord(word);
  if (!normalized) return [];

  const primary = resolvePrimaryReading(normalized);
  if (!primary) return [];

  const counts = new Set<number>();
  counts.add(primary.syllables);
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
