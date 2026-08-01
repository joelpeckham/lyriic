import { createLazyBinData, type RhymeModeData } from "@/lib/data/dictPack";
import {
  getLexicon,
  loadLexicon,
  type Lexicon,
} from "@/lib/data/lexicon";
import { runWhenIdle } from "@/lib/data/runWhenIdle";
import { normalizeLookupKey } from "@/lib/syllables/normalize";

export type RhymeMode = "perfect" | "end";

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

let revision = 0;
const listeners = new Set<() => void>();
const readyAnnounced: Record<RhymeMode, boolean> = {
  perfect: false,
  end: false,
};

/** Monotonic revision bumped when a rhyme pack becomes ready or tests inject data. */
export function getRhymeRevision(): number {
  return revision;
}

/** Subscribe to rhyme-ready / test-inject notifications. Returns unsubscribe. */
export function subscribeRhymeReady(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyReady(): void {
  for (const listener of listeners) listener();
}

function announceReady(mode: RhymeMode): void {
  if (readyAnnounced[mode]) return;
  readyAnnounced[mode] = true;
  revision += 1;
  notifyReady();
}

function bumpRevision(): void {
  revision += 1;
  notifyReady();
}

function storeFor(mode: RhymeMode) {
  return mode === "end" ? endStore : perfectStore;
}

/**
 * Lazy-load a rhyme mode pack (and lexicon). Perfect and end are separate assets.
 * Prefetches end after perfect resolves when loading perfect.
 */
function assertRhymeAligned(pack: RhymeModeData): void {
  const lex = getLexicon();
  if (!lex) return;
  if (pack.byWord.length !== lex.words.length) {
    throw new Error(
      `rhyme pack length ${pack.byWord.length} !== lexicon ${lex.words.length}`,
    );
  }
}

export async function loadRhymeIndex(
  mode: RhymeMode = "perfect",
): Promise<RhymeModeData> {
  await loadLexicon();
  const data = await storeFor(mode).load();
  assertRhymeAligned(data);
  announceReady(mode);
  if (mode === "perfect" && typeof window !== "undefined") {
    runWhenIdle(() => {
      void endStore
        .load()
        .then((end) => {
          assertRhymeAligned(end);
          announceReady("end");
        })
        .catch(() => {
          // Prefetch is best-effort; query path will surface failures.
        });
    }, 2000);
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

/** Idle-prefetch rhyme packs after lexicon is available (end follows via loadRhymeIndex). */
export function prefetchRhymes(): void {
  if (typeof window === "undefined") return;
  if (isRhymeIndexReady("perfect")) return;
  runWhenIdle(() => {
    void loadRhymeIndex("perfect").catch(() => {
      // Prefetch is best-effort; query path will surface failures.
    });
  }, 2000);
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
  return rhymeKeyIds(word, mode).length > 0;
}

/**
 * Rhyme key ids for a word in the given mode (empty when unknown / unloaded).
 * Alternate pronunciations are all returned.
 */
export function rhymeKeyIds(
  word: string,
  mode: RhymeMode = "perfect",
): number[] {
  const lex = activeLex();
  const pack = activePack(mode);
  if (!lex || !pack) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];
  const id = lex.wordToId.get(key);
  if (id === undefined) return [];
  return pack.byWord[id] ?? [];
}

/** True when two words share at least one rhyme key in the given mode. */
export function wordsRhyme(
  a: string,
  b: string,
  mode: RhymeMode = "perfect",
): boolean {
  const keysA = rhymeKeyIds(a, mode);
  if (keysA.length === 0) return false;
  const keysB = rhymeKeyIds(b, mode);
  if (keysB.length === 0) return false;
  const setB = new Set(keysB);
  return keysA.some((k) => setB.has(k));
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

/**
 * Perfect rhymes, optionally unioned with end rhymes (perfect-first, deduped).
 * Call after {@link loadRhymeQuery} has resolved.
 */
export function queryRhymeIds(
  word: string,
  includeEnd: boolean,
): number[] {
  const perfect = lookupRhymeIds(word, "perfect");
  if (!includeEnd) return perfect;
  const end = lookupRhymeIds(word, "end");
  if (end.length === 0) return perfect;
  const seen = new Set(perfect);
  const out = perfect.slice();
  for (const id of end) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/** True when the word has a perfect entry, or an end entry when includeEnd. */
export function hasRhymeQueryEntry(
  word: string,
  includeEnd: boolean,
): boolean {
  return (
    hasRhymeEntry(word, "perfect") ||
    (includeEnd && hasRhymeEntry(word, "end"))
  );
}

/** Load perfect (and end when requested) for a rhyme query. */
export async function loadRhymeQuery(includeEnd: boolean): Promise<void> {
  await loadRhymeIndex("perfect");
  if (includeEnd) await loadRhymeIndex("end");
}

/** True when packs needed for {@link queryRhymeIds} are ready. */
export function isRhymeQueryReady(includeEnd: boolean): boolean {
  return (
    isRhymeIndexReady("perfect") &&
    (!includeEnd || isRhymeIndexReady("end"))
  );
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
    readyAnnounced.perfect = false;
    readyAnnounced.end = false;
    bumpRevision();
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
  readyAnnounced.perfect = true;
  readyAnnounced.end = true;
  bumpRevision();
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
