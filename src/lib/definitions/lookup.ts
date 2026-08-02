/**
 * On-demand letter-pair definition packs (LYXD).
 */

import {
  fetchAndDecodePack,
  type DefinitionSense,
  type DefinitionsPack,
  usageCodeToChar,
} from "@/lib/data/dictPack";
import { getLexicon, loadLexicon, type Lexicon } from "@/lib/data/lexicon";
import { normalizeLookupKey, normalizeWord } from "@/lib/syllables/normalize";
import { lookupForms } from "@/lib/wordLookup/lookupForms";

import { definitionPairKey } from "./pairKey";

export type { DefinitionSense };
export { definitionPairKey };

export type DefinitionSource = "oewn" | "wiktionary";

export type ResolvedDefinitionSense = {
  usage: "n" | "v" | "a" | "r";
  source: DefinitionSource;
  gloss: string;
};

export type DefinitionLookupResult = {
  /** Lemma that yielded senses (may differ from the query after stemming). */
  lemma: string;
  senses: ResolvedDefinitionSense[];
};

const LRU_CAPACITY = 12;

/** Vite-hashed URLs for every defs-*.bin pack. */
const packUrlLoaders = import.meta.glob<string>(
  "../data/packs/defs/*.bin",
  { query: "?url", import: "default" },
);

const urlByPair = new Map<string, () => Promise<string>>();
for (const [path, loader] of Object.entries(packUrlLoaders)) {
  const match = /defs-([^/]+)\.bin$/.exec(path);
  if (match?.[1]) urlByPair.set(match[1], loader);
}

type CacheEntry = {
  pair: string;
  pack: DefinitionsPack;
};

const lru: CacheEntry[] = [];
const inflight = new Map<string, Promise<DefinitionsPack | null>>();

/** Test override: word → senses (bypasses packs). */
let testByWord: Map<string, ResolvedDefinitionSense[]> | null = null;

function touch(entry: CacheEntry): void {
  const idx = lru.indexOf(entry);
  if (idx >= 0) lru.splice(idx, 1);
  lru.push(entry);
  while (lru.length > LRU_CAPACITY) lru.shift();
}

function getCached(pair: string): DefinitionsPack | null {
  const hit = lru.find((e) => e.pair === pair);
  if (!hit) return null;
  touch(hit);
  return hit.pack;
}

async function loadPairPack(pair: string): Promise<DefinitionsPack | null> {
  const cached = getCached(pair);
  if (cached) return cached;

  const pending = inflight.get(pair);
  if (pending) return pending;

  const urlLoader = urlByPair.get(pair);
  if (!urlLoader) return null;

  const promise = (async () => {
    try {
      const url = await urlLoader();
      const decoded = await fetchAndDecodePack(url, "definitions");
      if (decoded.kind !== "definitions") {
        throw new Error("expected definitions pack");
      }
      // Rebuild Map after worker structured-clone.
      const byWordId = new Map<number, DefinitionSense[]>();
      for (const [id, senses] of decoded.data.byWordId) {
        byWordId.set(Number(id), senses);
      }
      const pack: DefinitionsPack = { byWordId };
      touch({ pair, pack });
      return pack;
    } catch (err) {
      inflight.delete(pair);
      throw err;
    } finally {
      inflight.delete(pair);
    }
  })();

  inflight.set(pair, promise);
  return promise;
}

function resolveSenses(
  senses: readonly DefinitionSense[],
): ResolvedDefinitionSense[] {
  const out: ResolvedDefinitionSense[] = [];
  for (const sense of senses) {
    const usage = usageCodeToChar(sense.usage);
    if (!usage) continue;
    if (sense.source !== 0 && sense.source !== 1) continue;
    out.push({
      usage,
      source: sense.source === 1 ? "wiktionary" : "oewn",
      gloss: sense.gloss,
    });
  }
  return out;
}

/**
 * Inflectional candidates present in the lexicon, with the same false-stem
 * guards as thesaurus lookup.
 */
function definitionForms(
  key: string,
  hasLemma: (form: string) => boolean,
): string[] {
  const raw = lookupForms(key);
  const present = raw.filter((form) => form === key || hasLemma(form));

  return present.filter((form) => {
    if (form === key) return true;
    if (
      (key.endsWith("ed") || key.endsWith("ing")) &&
      present.includes(`${form}e`)
    ) {
      return false;
    }
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

function normalizeDefinitionQuery(word: string): string {
  return normalizeLookupKey(normalizeWord(word.trim()));
}

/** True when a digraph pack asset exists for this lemma. */
export function hasDefinitionPack(lemma: string): boolean {
  const key = normalizeDefinitionQuery(lemma);
  if (!key) return false;
  return urlByPair.has(definitionPairKey(key));
}

/**
 * Load definitions for a word (fetches its digraph pack on demand).
 * Tries inflectional bases when the surface form has no senses.
 */
export async function loadDefinitions(
  word: string,
): Promise<DefinitionLookupResult> {
  const key = normalizeDefinitionQuery(word);
  if (!key) return { lemma: "", senses: [] };

  if (testByWord) {
    for (const form of definitionForms(key, (f) => testByWord!.has(f))) {
      const senses = testByWord.get(form);
      if (senses?.length) return { lemma: form, senses };
    }
    return { lemma: key, senses: testByWord.get(key) ?? [] };
  }

  const lex = await loadLexicon();
  const forms = definitionForms(key, (f) => lex.wordToId.has(f));

  for (const form of forms) {
    const wordId = lex.wordToId.get(form);
    if (wordId === undefined) continue;
    const pack = await loadPairPack(definitionPairKey(form));
    if (!pack) continue;
    const raw = pack.byWordId.get(wordId);
    if (!raw?.length) continue;
    const senses = resolveSenses(raw);
    if (senses.length > 0) return { lemma: form, senses };
  }

  return { lemma: key, senses: [] };
}

/** Sync read after the pair pack is already in the LRU (or tests). */
export function lookupDefinitions(word: string): DefinitionLookupResult {
  const key = normalizeDefinitionQuery(word);
  if (!key) return { lemma: "", senses: [] };

  if (testByWord) {
    for (const form of definitionForms(key, (f) => testByWord!.has(f))) {
      const senses = testByWord.get(form);
      if (senses?.length) return { lemma: form, senses };
    }
    return { lemma: key, senses: testByWord.get(key) ?? [] };
  }

  const lex = getLexicon();
  if (!lex) return { lemma: key, senses: [] };

  return lookupDefinitionsWithLex(key, lex);
}

function lookupDefinitionsWithLex(
  key: string,
  lex: Lexicon,
): DefinitionLookupResult {
  const forms = definitionForms(key, (f) => lex.wordToId.has(f));
  for (const form of forms) {
    const wordId = lex.wordToId.get(form);
    if (wordId === undefined) continue;
    const pack = getCached(definitionPairKey(form));
    if (!pack) continue;
    const raw = pack.byWordId.get(wordId);
    if (!raw?.length) continue;
    const senses = resolveSenses(raw);
    if (senses.length > 0) return { lemma: form, senses };
  }
  return { lemma: key, senses: [] };
}

/** Prefetch the digraph pack for a word without resolving senses. */
export async function prefetchDefinitionPair(word: string): Promise<void> {
  if (testByWord) return;
  const key = normalizeDefinitionQuery(word);
  if (!key) return;
  const lex = await loadLexicon();
  const forms = definitionForms(key, (f) => lex.wordToId.has(f));
  for (const form of forms) {
    await loadPairPack(definitionPairKey(form));
  }
}

/** Test helper. */
export function __setDefinitionsForTests(
  map: Record<string, ResolvedDefinitionSense[]> | null,
): void {
  if (map === null) {
    testByWord = null;
    lru.length = 0;
    inflight.clear();
    return;
  }
  testByWord = new Map(
    Object.entries(map).map(([k, v]) => [normalizeDefinitionQuery(k), v]),
  );
}
