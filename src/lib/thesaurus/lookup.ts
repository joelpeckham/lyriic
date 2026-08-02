import {
  buildThesaurusByHead,
  createLazyBinData,
  resolveDictId,
  usageCodeToChar,
  type ThesaurusEntry,
  type ThesaurusPack,
} from "@/lib/data/dictPack";
import { getLexicon, loadLexicon } from "@/lib/data/lexicon";
import { runWhenIdle } from "@/lib/data/runWhenIdle";
import { normalizeLookupKey } from "@/lib/syllables/normalize";
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
export async function loadThesaurus(): Promise<void> {
  const lex = await loadLexicon();
  const runtime = await store.load();
  if (runtime.pack.byHead.size === 0) {
    buildThesaurusByHead(runtime.pack, lex.words);
  }
}

/** Idle-prefetch thesaurus after lexicon is available. */
export function prefetchThesaurus(): void {
  if (typeof window === "undefined") return;
  runWhenIdle(() => {
    void loadThesaurus();
  }, 4000);
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

/** True when any dictionary form has both noun and verb synonym groups. */
function isNounVerbAmbiguous(forms: readonly string[]): boolean {
  let hasN = false;
  let hasV = false;
  for (const form of forms) {
    const groups = groupsFor(form);
    if (!groups) continue;
    if (groups.n?.length) hasN = true;
    if (groups.v?.length) hasV = true;
    if (hasN && hasV) return true;
  }
  return false;
}

/**
 * Flat synonym list with usage tags for browse/filter UIs.
 * Preserves Zipf order within each usage; usages follow n → v → a → r.
 */
export function lookupSynonymsForBrowse(
  word: string,
): Array<{ word: string; usage: WordUsage }> {
  if (!testMap && (!store.get() || !getLexicon())) return [];
  const key = normalizeLookupKey(word);
  if (!key) return [];

  const forms = dictionaryForms(key);
  const surfaceGroups = groupsFor(key);
  const seen = new Set<string>();
  const out: Array<{ word: string; usage: WordUsage }> = [];

  for (const form of forms) {
    const groups = groupsFor(form);
    if (!groups) continue;
    const usages: WordUsage[] =
      form === key || !surfaceGroups ? USAGE_ORDER : ["v"];
    for (const pos of usages) {
      for (const syn of groups[pos] ?? []) {
        if (!syn || syn === key) continue;
        const dedupeKey = `${syn}\0${pos}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        out.push({ word: syn, usage: pos });
      }
    }
  }
  return out;
}

/**
 * Sync lookup after {@link loadThesaurus} has resolved.
 * Returns [] for unknown words or if data is not yet loaded.
 * Also checks inflectional bases (remains → remain) so verb senses surface.
 * When `usage` is set, synonyms for that usage are marked and listed first.
 * For noun/verb-ambiguous heads, a detected `n`/`v` hard-filters other POS out.
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
  const restrictNv =
    isNounVerbAmbiguous(forms) && (usage === "n" || usage === "v")
      ? usage
      : null;

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
    let usages: WordUsage[] =
      form === key || !surfaceGroups ? USAGE_ORDER : ["v"];
    if (restrictNv) {
      usages = usages.filter((pos) => pos === restrictNv);
      if (usages.length === 0) continue;
    }

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
