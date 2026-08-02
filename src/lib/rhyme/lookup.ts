import { createLazyBinData, type RhymeModeData } from "@/lib/data/dictPack";
import {
  getLexicon,
  loadLexicon,
  type Lexicon,
} from "@/lib/data/lexicon";
import { runWhenIdle } from "@/lib/data/runWhenIdle";
import { normalizeLookupKey } from "@/lib/syllables/normalize";

export type RhymeMode = "perfect" | "end" | "slant";

export type RhymeQueryOptions = {
  includeEnd?: boolean;
  includeSlant?: boolean;
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

const slantStore = createLazyBinData<RhymeModeData>(
  () =>
    import("@/lib/data/packs/rhyme-slant.bin?url").then(
      (m) => m.default as string,
    ),
  "rhyme-slant",
  (decoded) => {
    if (decoded.kind !== "rhyme-slant") {
      throw new Error("expected rhyme-slant pack");
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
  slant: RhymeModeData;
  ready: Record<RhymeMode, boolean>;
} | null = null;

let revision = 0;
const listeners = new Set<() => void>();
const readyAnnounced: Record<RhymeMode, boolean> = {
  perfect: false,
  end: false,
  slant: false,
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
  if (mode === "end") return endStore;
  if (mode === "slant") return slantStore;
  return perfectStore;
}

function normalizeQueryOptions(
  opts: boolean | RhymeQueryOptions = {},
): Required<RhymeQueryOptions> {
  if (typeof opts === "boolean") {
    return { includeEnd: opts, includeSlant: false };
  }
  return {
    includeEnd: opts.includeEnd ?? false,
    includeSlant: opts.includeSlant ?? false,
  };
}

/**
 * Lazy-load a rhyme mode pack (and lexicon). Perfect, end, and slant are
 * separate assets. Prefetch chain: perfect → idle end → idle slant.
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

/** Idle-prefetch the next pack in the perfect → end → slant chain. */
function prefetchNextAfter(mode: RhymeMode): void {
  if (typeof window === "undefined") return;
  if (mode === "perfect") {
    runWhenIdle(() => {
      void endStore
        .load()
        .then((end) => {
          assertRhymeAligned(end);
          announceReady("end");
          prefetchNextAfter("end");
        })
        .catch(() => {
          // Still idle-prefetch slant if end fails; query path surfaces errors.
          prefetchNextAfter("end");
        });
    }, 2000);
    return;
  }
  if (mode === "end") {
    runWhenIdle(() => {
      void slantStore
        .load()
        .then((slant) => {
          assertRhymeAligned(slant);
          announceReady("slant");
        })
        .catch(() => {
          // Prefetch is best-effort; query path will surface failures.
        });
    }, 2000);
  }
}

export async function loadRhymeIndex(
  mode: RhymeMode = "perfect",
): Promise<RhymeModeData> {
  await loadLexicon();
  const data = await storeFor(mode).load();
  assertRhymeAligned(data);
  announceReady(mode);
  prefetchNextAfter(mode);
  return data;
}

/** True once the given mode (default: any) has finished loading. */
export function isRhymeIndexReady(mode?: RhymeMode): boolean {
  if (testFixture) {
    if (!mode) {
      return (
        testFixture.ready.perfect ||
        testFixture.ready.end ||
        testFixture.ready.slant
      );
    }
    return testFixture.ready[mode];
  }
  if (mode) return storeFor(mode).isReady() && getLexicon() !== null;
  return (
    (perfectStore.isReady() || endStore.isReady() || slantStore.isReady()) &&
    getLexicon() !== null
  );
}

/** Idle-prefetch rhyme packs after lexicon is available (end/slant follow). */
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
    if (!testFixture.ready[mode]) return null;
    if (mode === "end") return testFixture.end;
    if (mode === "slant") return testFixture.slant;
    return testFixture.perfect;
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

function appendUnique(out: number[], seen: Set<number>, ids: number[]): void {
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
}

/**
 * Perfect rhymes, optionally unioned with end then slant (perfect-first, deduped).
 * Call after {@link loadRhymeQuery} has resolved.
 * Accepts a boolean for backward-compatible `includeEnd` only.
 */
export function queryRhymeIds(
  word: string,
  opts: boolean | RhymeQueryOptions = {},
): number[] {
  const { includeEnd, includeSlant } = normalizeQueryOptions(opts);
  const perfect = lookupRhymeIds(word, "perfect");
  if (!includeEnd && !includeSlant) return perfect;
  const seen = new Set(perfect);
  const out = perfect.slice();
  if (includeEnd) {
    appendUnique(out, seen, lookupRhymeIds(word, "end"));
  }
  if (includeSlant) {
    appendUnique(out, seen, lookupRhymeIds(word, "slant"));
  }
  return out;
}

/** True when the word has a perfect entry, or end/slant when requested. */
export function hasRhymeQueryEntry(
  word: string,
  opts: boolean | RhymeQueryOptions = {},
): boolean {
  const { includeEnd, includeSlant } = normalizeQueryOptions(opts);
  return (
    hasRhymeEntry(word, "perfect") ||
    (includeEnd && hasRhymeEntry(word, "end")) ||
    (includeSlant && hasRhymeEntry(word, "slant"))
  );
}

/** Load perfect (and end/slant when requested) for a rhyme query. */
export async function loadRhymeQuery(
  opts: boolean | RhymeQueryOptions = {},
): Promise<void> {
  const { includeEnd, includeSlant } = normalizeQueryOptions(opts);
  await loadRhymeIndex("perfect");
  if (includeEnd) await loadRhymeIndex("end");
  if (includeSlant) await loadRhymeIndex("slant");
}

/** True when packs needed for {@link queryRhymeIds} are ready. */
export function isRhymeQueryReady(
  opts: boolean | RhymeQueryOptions = {},
): boolean {
  const { includeEnd, includeSlant } = normalizeQueryOptions(opts);
  return (
    isRhymeIndexReady("perfect") &&
    (!includeEnd || isRhymeIndexReady("end")) &&
    (!includeSlant || isRhymeIndexReady("slant"))
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
    byWordSlant?: Record<string, string | string[]>;
    byKeySlant?: Record<string, string[]>;
    /** Per-mode readiness (default all true). Use `slant: false` to simulate unload. */
    ready?: Partial<Record<RhymeMode, boolean>>;
  } | null,
): void {
  if (index === null) {
    testFixture = null;
    readyAnnounced.perfect = false;
    readyAnnounced.end = false;
    readyAnnounced.slant = false;
    bumpRevision();
    return;
  }

  const byWordSlant = index.byWordSlant ?? {};
  const byKeySlant = index.byKeySlant ?? {};

  const words = [
    ...new Set([
      ...Object.keys(index.byWord),
      ...Object.keys(index.byWordEnd),
      ...Object.keys(byWordSlant),
      ...Object.values(index.byKey).flat(),
      ...Object.values(index.byKeyEnd).flat(),
      ...Object.values(byKeySlant).flat(),
    ]),
  ].sort();

  const wordToId = new Map(words.map((w, i) => [w, i]));
  const ready = {
    perfect: index.ready?.perfect ?? true,
    end: index.ready?.end ?? true,
    slant: index.ready?.slant ?? true,
  };
  testFixture = {
    words,
    wordToId,
    perfect: buildModeData(words, wordToId, index.byWord, index.byKey),
    end: buildModeData(words, wordToId, index.byWordEnd, index.byKeyEnd),
    slant: buildModeData(words, wordToId, byWordSlant, byKeySlant),
    ready,
  };
  readyAnnounced.perfect = ready.perfect;
  readyAnnounced.end = ready.end;
  readyAnnounced.slant = ready.slant;
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
