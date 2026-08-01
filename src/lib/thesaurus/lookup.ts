import {
  buildThesaurusByHead,
  createLazyBinData,
  resolveDictId,
  usageCodeToChar,
  type ThesaurusEntry,
  type ThesaurusPack,
} from "@/lib/data/dictPack";
import { normalizeLookupKey } from "@/lib/data/lazyJson";
import { getLexicon, loadLexicon } from "@/lib/data/lexicon";
import { lookupForms } from "@/lib/wordLookup/lookupForms";

import type { WordUsage } from "./usage";

export type { WordUsage };

/** Synonyms grouped by WordNet-style usage (n/v/a/r). */
export type SynonymGroups = Partial<Record<WordUsage, string[]>>;

type SynonymMap = Record<string, SynonymGroups>;

export type ThesaurusCandidate = {
  word: string;
  /** True when the synonym shares the detected usage of the query word. */
  matchesUsage: boolean;
};

const USAGE_ORDER: WordUsage[] = ["n", "v", "a", "r"];

type ThesaurusRuntime = {
  pack: ThesaurusPack;
  /** Materialized groups for heads (lazy per head). */
  groupsCache: Map<string, SynonymGroups>;
};

const store = createLazyBinData<ThesaurusRuntime>(
  () =>
    import("@/lib/data/packs/thesaurus.bin?url").then(
      (m) => m.default as string,
    ),
  "thesaurus",
  (decoded) => {
    if (decoded.kind !== "thesaurus") {
      throw new Error("expected thesaurus pack");
    }
    return { pack: decoded.data, groupsCache: new Map() };
  },
);

/** Injected plain map for unit tests (avoids touching the shared lexicon). */
let testMap: SynonymMap | null = null;

/** Lazy-load the thesaurus pack (requires lexicon for id resolution). */
export async function loadThesaurus(): Promise<SynonymMap> {
  const lex = await loadLexicon();
  const runtime = await store.load();
  if (runtime.pack.byHead.size === 0) {
    buildThesaurusByHead(runtime.pack, lex.words);
  }
  return Object.create(null) as SynonymMap;
}

/** Idle-prefetch thesaurus after lexicon is available. */
export function prefetchThesaurus(): void {
  if (typeof window === "undefined") return;
  const start = () => {
    void loadThesaurus();
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(start, { timeout: 4000 });
  } else {
    window.setTimeout(start, 50);
  }
}

/** True once the synonym map has finished loading. */
export function isThesaurusReady(): boolean {
  return testMap !== null || (store.isReady() && getLexicon() !== null);
}

function groupsFor(form: string): SynonymGroups | null {
  if (testMap) {
    const groups = testMap[form];
    return groups && Object.keys(groups).length > 0 ? groups : null;
  }

  const runtime = store.get();
  const lex = getLexicon();
  if (!runtime || !lex) return null;

  const cached = runtime.groupsCache.get(form);
  if (cached) return Object.keys(cached).length > 0 ? cached : null;

  const entry = runtime.pack.byHead.get(form);
  if (!entry) {
    runtime.groupsCache.set(form, {});
    return null;
  }
  const groups = materializeGroups(entry, lex.words, runtime.pack.overflowWords);
  runtime.groupsCache.set(form, groups);
  return Object.keys(groups).length > 0 ? groups : null;
}

function materializeGroups(
  entry: ThesaurusEntry,
  lexWords: readonly string[],
  overflow: readonly string[],
): SynonymGroups {
  const groups: SynonymGroups = {};
  for (const { usage, synIds } of entry.usages) {
    const ch = usageCodeToChar(usage);
    if (!ch) continue;
    const list: string[] = [];
    for (const id of synIds) {
      const w = resolveDictId(id, lexWords, overflow);
      if (w) list.push(w);
    }
    if (list.length > 0) groups[ch] = list;
  }
  return groups;
}

/**
 * Inflectional candidates present in the map, with aggressive false stems
 * dropped when a better silent-e / -fe lemma also exists.
 */
function dictionaryForms(key: string): string[] {
  const raw = lookupForms(key);
  const present = raw.filter((form) => form === key || groupsFor(form));

  return present.filter((form) => {
    if (form === key) return true;
    // hoped/scared: drop hop/scar when hope/scare is in the map.
    if (
      (key.endsWith("ed") || key.endsWith("ing")) &&
      present.includes(`${form}e`)
    ) {
      return false;
    }
    // leaves: drop leaf when leave is in the map.
    if (
      key.endsWith("ves") &&
      form.endsWith("f") &&
      !form.endsWith("ff") &&
      present.includes(`${form}e`)
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Sync lookup after {@link loadThesaurus} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 * Also checks inflectional bases (remains → remain) so verb senses surface.
 * When `usage` is set, synonyms for that usage are marked and listed first.
 */
export function lookupSynonyms(
  word: string,
  usage: WordUsage | null = null,
): ThesaurusCandidate[] {
  if (!testMap && (!store.get() || !getLexicon())) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];

  const forms = dictionaryForms(key);
  const surfaceGroups = groupsFor(key);

  /** Best tier per synonym: true = matches requested usage. */
  const best = new Map<string, boolean>();
  const order: string[] = [];

  function absorb(syn: string, matched: boolean): void {
    if (!syn || syn === key) return;
    const prev = best.get(syn);
    if (prev === undefined) {
      best.set(syn, matched);
      order.push(syn);
      return;
    }
    if (matched && !prev) best.set(syn, true);
  }

  for (const form of forms) {
    const groups = groupsFor(form);
    if (!groups) continue;

    // Surface form (or missing surface): take all POS. Inflectional bases when
    // the surface already exists: verbs only (remains → remain, not news → new).
    const usages: WordUsage[] =
      form === key || !surfaceGroups ? USAGE_ORDER : ["v"];

    if (usage && usages.includes(usage)) {
      for (const syn of groups[usage] ?? []) absorb(syn, true);
    }

    for (const pos of usages) {
      if (usage && pos === usage) continue;
      for (const syn of groups[pos] ?? []) absorb(syn, false);
    }
  }

  const matched: string[] = [];
  const other: string[] = [];
  for (const syn of order) {
    if (best.get(syn)) matched.push(syn);
    else other.push(syn);
  }

  return [
    ...matched.map((w) => ({ word: w, matchesUsage: true })),
    ...other.map((w) => ({ word: w, matchesUsage: false })),
  ];
}

/** Test helper — inject a map without hitting the binary pack. */
export function __setThesaurusDataForTests(map: SynonymMap | null): void {
  testMap = map;
  if (map === null) {
    store.__setForTests(null);
  } else {
    // Mark store ready without a real pack; groupsFor uses testMap.
    store.__setForTests({
      pack: {
        lexWordCount: 0,
        overflowWords: [],
        entries: [],
        byHead: new Map(),
      },
      groupsCache: new Map(),
    });
  }
}
