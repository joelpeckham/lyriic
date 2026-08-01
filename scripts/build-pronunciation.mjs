/**
 * Fuse US pronunciation sources and rebuild syllable + perfect-rhyme artifacts.
 *
 * Preference order per word:
 *   Misaki us_gold → CMUdict (primary + alts) → Misaki us_silver → WikiPron
 *
 * Outputs:
 *   src/lib/syllables/data/cmu-syllables.json
 *   src/lib/rhyme/data/rhyme-index.json
 *
 * Usage: node scripts/build-pronunciation.mjs
 * Requires: pip install wordfreq (for Zipf ranking of rhyme buckets)
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ensureDownloaded } from "./lib/download.mjs";
import { selectByFrequency, zipfFrequencies } from "./lib/frequency.mjs";
import {
  arpabetToIpa,
  misakiToIpa,
  rhymeKeyFromIpa,
  syllableCountFromIpa,
  wikipronToIpa,
} from "./lib/ipa.mjs";
import { normalizeLemma } from "./lib/lemma.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sourcesDir = join(__dirname, "sources");

const MISAKI_GOLD_URL =
  "https://raw.githubusercontent.com/hexgrad/misaki/main/misaki/data/us_gold.json";
const MISAKI_SILVER_URL =
  "https://raw.githubusercontent.com/hexgrad/misaki/main/misaki/data/us_silver.json";
const WIKIPRON_URL =
  "https://raw.githubusercontent.com/CUNY-CL/wikipron/master/data/scrape/tsv/eng_latn_us_broad.tsv";

const cmuPath = join(__dirname, "cmudict.dict");
const misakiGoldPath = join(sourcesDir, "us_gold.json");
const misakiSilverPath = join(sourcesDir, "us_silver.json");
const wikipronPath = join(sourcesDir, "eng_latn_us_broad.tsv");

const sylOutPath = join(root, "src/lib/syllables/data/cmu-syllables.json");
const rhymeOutPath = join(root, "src/lib/rhyme/data/rhyme-index.json");

/** Cap rhyme candidates per key; runtime UI may show fewer. */
const MAX_PER_BUCKET = 80;

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function misakiIpaValue(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const def = /** @type {Record<string, unknown>} */ (value).DEFAULT;
    return typeof def === "string" ? def : null;
  }
  return null;
}

/**
 * @param {string} path
 * @returns {Map<string, string>}
 */
function loadMisaki(path) {
  /** @type {Record<string, unknown>} */
  const raw = JSON.parse(readFileSync(path, "utf8"));
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const [word, value] of Object.entries(raw)) {
    const lemma = normalizeLemma(word);
    if (!lemma) continue;
    const rawIpa = misakiIpaValue(value);
    if (!rawIpa) continue;
    const ipa = misakiToIpa(rawIpa);
    // Drop silver bugs that leave capital diphthong letters.
    if (/[A-Z]/.test(ipa)) continue;
    if (!out.has(lemma)) out.set(lemma, ipa);
  }
  return out;
}

/**
 * @returns {Map<string, string[]>}
 */
function loadCmudict() {
  const text = readFileSync(cmuPath, "latin1");
  /** @type {Map<string, string[]>} */
  const out = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith(";;;") || line.startsWith("##")) continue;
    const hash = line.indexOf("#");
    const body = (hash === -1 ? line : line.slice(0, hash)).trim();
    if (!body) continue;
    const parts = body.split(/\s+/);
    if (parts.length < 2) continue;
    const entry = parts[0].replace(/\(\d+\)$/, "");
    const lemma = normalizeLemma(entry);
    if (!lemma) continue;
    const ipa = arpabetToIpa(parts.slice(1));
    if (!ipa) continue;
    const list = out.get(lemma);
    if (list) list.push(ipa);
    else out.set(lemma, [ipa]);
  }
  return out;
}

/**
 * @param {string} path
 * @returns {Map<string, string[]>}
 */
function loadWikipron(path) {
  const text = readFileSync(path, "utf8");
  /** @type {Map<string, string[]>} */
  const out = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line) continue;
    const tab = line.indexOf("\t");
    if (tab === -1) continue;
    const lemma = normalizeLemma(line.slice(0, tab));
    if (!lemma) continue;
    const ipa = wikipronToIpa(line.slice(tab + 1));
    if (!ipa) continue;
    const list = out.get(lemma);
    if (list) {
      if (!list.includes(ipa)) list.push(ipa);
    } else out.set(lemma, [ipa]);
  }
  return out;
}

/**
 * @typedef {{ primary: string, alts: string[] }} PronEntry
 */

/**
 * @param {Map<string, string>} gold
 * @param {Map<string, string[]>} cmu
 * @param {Map<string, string>} silver
 * @param {Map<string, string[]>} wikipron
 * @returns {Map<string, PronEntry>}
 */
function mergeSources(gold, cmu, silver, wikipron) {
  const words = new Set([
    ...gold.keys(),
    ...cmu.keys(),
    ...silver.keys(),
    ...wikipron.keys(),
  ]);

  /** @type {Map<string, PronEntry>} */
  const merged = new Map();

  for (const word of words) {
    /** @type {string[]} */
    const ipas = [];
    const seen = new Set();

    /**
     * @param {string | undefined} ipa
     */
    function add(ipa) {
      if (!ipa || seen.has(ipa)) return;
      // Drop fragment-like single-phoneme noise except short function words.
      const bare = ipa.replace(/[ˈˌ]/g, "");
      if (bare.length <= 1 && word.length > 2) return;
      seen.add(ipa);
      ipas.push(ipa);
    }

    if (gold.has(word)) add(gold.get(word));
    for (const ipa of cmu.get(word) ?? []) add(ipa);
    if (!gold.has(word) && !cmu.has(word) && silver.has(word)) {
      add(silver.get(word));
    }
    for (const ipa of (wikipron.get(word) ?? []).slice(0, 3)) add(ipa);

    if (ipas.length === 0) continue;
    merged.set(word, { primary: ipas[0], alts: ipas.slice(1) });
  }

  return merged;
}

async function main() {
  await ensureDownloaded(MISAKI_GOLD_URL, misakiGoldPath);
  await ensureDownloaded(MISAKI_SILVER_URL, misakiSilverPath);
  await ensureDownloaded(WIKIPRON_URL, wikipronPath);

  console.log("Loading sources…");
  const gold = loadMisaki(misakiGoldPath);
  const silver = loadMisaki(misakiSilverPath);
  const cmu = loadCmudict();
  const wikipron = loadWikipron(wikipronPath);
  console.log(
    `  gold=${gold.size} silver=${silver.size} cmu=${cmu.size} wikipron=${wikipron.size}`,
  );

  const merged = mergeSources(gold, cmu, silver, wikipron);
  console.log(`Merged ${merged.size} lemmas`);

  /** @type {Record<string, number>} */
  const syllables = Object.create(null);
  /** @type {Record<string, string | string[]>} */
  const byWord = Object.create(null);
  /** @type {Record<string, string[]>} */
  const buckets = Object.create(null);

  let sylEntries = 0;
  let rhymeEntries = 0;
  let skippedNoRhyme = 0;

  for (const [word, entry] of merged) {
    const syl = syllableCountFromIpa(entry.primary);
    if (syl >= 1) {
      syllables[word] = syl;
      sylEntries += 1;
    }

    /** @type {string[]} */
    const keys = [];
    const keySeen = new Set();
    for (const ipa of [entry.primary, ...entry.alts]) {
      const key = rhymeKeyFromIpa(ipa);
      if (!key || keySeen.has(key)) continue;
      keySeen.add(key);
      keys.push(key);
      if (!(key in buckets)) buckets[key] = [];
      buckets[key].push(word);
    }
    if (keys.length === 0) {
      skippedNoRhyme += 1;
      continue;
    }
    byWord[word] = keys.length === 1 ? keys[0] : keys;
    rhymeEntries += 1;
  }

  console.log("Ranking rhyme buckets by wordfreq…");
  const allBucketWords = Object.values(buckets).flat();
  const freq = zipfFrequencies(allBucketWords);

  /** @type {Record<string, string[]>} */
  const byKey = Object.create(null);
  let bucketSeats = 0;
  for (const [key, words] of Object.entries(buckets)) {
    const selected = selectByFrequency(words, freq, MAX_PER_BUCKET);
    byKey[key] = selected;
    bucketSeats += selected.length;
  }

  mkdirSync(dirname(sylOutPath), { recursive: true });
  mkdirSync(dirname(rhymeOutPath), { recursive: true });

  const sylPayload = `${JSON.stringify(syllables)}\n`;
  writeFileSync(sylOutPath, sylPayload, "utf8");

  const rhymePayload = `${JSON.stringify({ byWord, byKey })}\n`;
  writeFileSync(rhymeOutPath, rhymePayload, "utf8");

  console.log(
    `Syllables: ${sylEntries} → ${sylOutPath} (${(Buffer.byteLength(sylPayload) / 1024 / 1024).toFixed(2)} MiB)`,
  );
  console.log(
    `Rhymes: ${rhymeEntries} words / ${Object.keys(byKey).length} keys (${bucketSeats} seats; ${skippedNoRhyme} no-key) → ${rhymeOutPath} (${(Buffer.byteLength(rhymePayload) / 1024 / 1024).toFixed(2)} MiB)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
