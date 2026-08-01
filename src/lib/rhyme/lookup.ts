import { createLazyBinData, type RhymeModeData } from "@/lib/data/dictPack";
import { normalizeLookupKey } from "@/lib/data/lazyJson";
import {
  getLexicon,
  loadLexicon,
  wordForId,
  type Lexicon,
} from "@/lib/data/lexicon";

export type RhymeMode = "perfect" | "end";

/** @deprecated Kept for type exports; runtime uses binary packs. */
export type RhymeIndex = {
  perfect: RhymeModeData;
  end: RhymeModeData;
};

const perfectStore = createLazyBinData<RhymeModeData>(
  () =>
    import("@/lib/data/packs/rhyme-perfect.bin?url").then(
      (m) => m.default as string,
    ),
  "rhyme-perfect",
  (decoded) => {
    if (decoded.kind !== "rhyme-perfect") {
      throw new Error("expected rhyme-perfect pack");
    }
    return decoded.data;
  },
);

const endStore = createLazyBinData<RhymeModeData>(
  () =>
    import("@/lib/data/packs/rhyme-end.bin?url").then(
      (m) => m.default as string,
    ),
  "rhyme-end",
  (decoded) => {
    if (decoded.kind !== "rhyme-end") {
      throw new Error("expected rhyme-end pack");
    }
    return decoded.data;
  },
);

/** Unit-test fixture: mini lexicon + packs (does not touch the shared lexicon). */
let testFixture: {
  words: string[];
  wordToId: Map<string, number>;
  perfect: RhymeModeData;
  end: RhymeModeData;
} | null = null;

function storeFor(mode: RhymeMode) {
  return mode === "end" ? endStore : perfectStore;
}

/**
 * Lazy-load a rhyme mode pack (and lexicon). Perfect and end are separate assets.
 * Prefetches end after perfect resolves when loading perfect.
 */
export async function loadRhymeIndex(
  mode: RhymeMode = "perfect",
): Promise<RhymeModeData> {
  await loadLexicon();
  const data = await storeFor(mode).load();
  if (mode === "perfect" && typeof window !== "undefined") {
    scheduleIdle(() => {
      void endStore.load();
    });
  }
  return data;
}

/** True once the given mode (default: either) has finished loading. */
export function isRhymeIndexReady(mode?: RhymeMode): boolean {
  if (testFixture) return true;
  if (mode) return storeFor(mode).isReady() && getLexicon() !== null;
  return (
    (perfectStore.isReady() || endStore.isReady()) && getLexicon() !== null
  );
}

function scheduleIdle(start: () => void): void {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(start, { timeout: 2000 });
    return;
  }
  window.setTimeout(start, 1);
}

function activeLex(): {
  words: string[];
  wordToId: Map<string, number>;
} | null {
  if (testFixture) {
    return { words: testFixture.words, wordToId: testFixture.wordToId };
  }
  return getLexicon();
}

function activePack(mode: RhymeMode): RhymeModeData | null {
  if (testFixture) {
    return mode === "end" ? testFixture.end : testFixture.perfect;
  }
  return storeFor(mode).get();
}

/** True when the word has an entry for the given rhyme mode. */
export function hasRhymeEntry(
  word: string,
  mode: RhymeMode = "perfect",
): boolean {
  const lex = activeLex();
  const pack = activePack(mode);
  if (!lex || !pack) return false;
  const key = normalizeLookupKey(word);
  if (!key) return false;
  const id = lex.wordToId.get(key);
  if (id === undefined) return false;
  return (pack.byWord[id]?.length ?? 0) > 0;
}

/**
 * Sync lookup after {@link loadRhymeIndex} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 * Excludes the query word from the rhyme bucket.
 * Unions buckets across alternate pronunciations (primary first).
 */
export function lookupRhymes(
  word: string,
  mode: RhymeMode = "perfect",
): string[] {
  const ids = lookupRhymeIds(word, mode);
  const lex = activeLex();
  if (!lex) return [];
  return ids.map((id) => lex.words[id]!).filter(Boolean);
}

/**
 * Like {@link lookupRhymes} but returns lexicon word ids (Zipf order).
 * Prefer this when ranking/windowing to avoid materializing huge string lists.
 */
export function lookupRhymeIds(
  word: string,
  mode: RhymeMode = "perfect",
): number[] {
  const lex = activeLex();
  const pack = activePack(mode);
  if (!lex || !pack) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];
  const wordId = lex.wordToId.get(key);
  if (wordId === undefined) return [];
  const rhymeKeys = pack.byWord[wordId];
  if (!rhymeKeys || rhymeKeys.length === 0) return [];

  const out: number[] = [];
  const seen = new Set<number>([wordId]);
  for (const keyId of rhymeKeys) {
    const bucket = pack.buckets[keyId];
    if (!bucket) continue;
    for (const id of bucket) {
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

/** Materialize a slice of word ids to strings. */
export function materializeWords(
  ids: readonly number[],
  lex: Lexicon | null = getLexicon(),
): string[] {
  const words = lex?.words ?? testFixture?.words;
  if (!words) return [];
  const out: string[] = [];
  for (const id of ids) {
    const w = words[id];
    if (w) out.push(w);
  }
  return out;
}

export { wordForId };

/** Test helper — inject mode packs without hitting binary assets. */
export function __setRhymeDataForTests(
  index: {
    byWord: Record<string, string | string[]>;
    byKey: Record<string, string[]>;
    byWordEnd: Record<string, string | string[]>;
    byKeyEnd: Record<string, string[]>;
  } | null,
): void {
  if (index === null) {
    testFixture = null;
    return;
  }

  const words = [
    ...new Set([
      ...Object.keys(index.byWord),
      ...Object.keys(index.byWordEnd),
      ...Object.values(index.byKey).flat(),
      ...Object.values(index.byKeyEnd).flat(),
    ]),
  ].sort();

  const wordToId = new Map(words.map((w, i) => [w, i]));
  testFixture = {
    words,
    wordToId,
    perfect: buildModeData(words, wordToId, index.byWord, index.byKey),
    end: buildModeData(words, wordToId, index.byWordEnd, index.byKeyEnd),
  };
}

function buildModeData(
  words: string[],
  wordToId: Map<string, number>,
  byWord: Record<string, string | string[]>,
  byKey: Record<string, string[]>,
): RhymeModeData {
  const keys = Object.keys(byKey);
  const keyIndex = new Map(keys.map((k, i) => [k, i]));
  const byWordIds = words.map((w) => {
    const raw = byWord[w];
    if (!raw) return [];
    const list = Array.isArray(raw) ? raw : [raw];
    return list
      .map((k) => keyIndex.get(k))
      .filter((id): id is number => id !== undefined);
  });
  const buckets = keys.map((k) =>
    (byKey[k] ?? [])
      .map((w) => wordToId.get(w))
      .filter((id): id is number => id !== undefined),
  );
  return { keys, byWord: byWordIds, buckets };
}
