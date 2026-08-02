/**
 * Fuse US pronunciation sources and rebuild syllable + rhyme artifacts.
 *
 * Preference order per word:
 *   Misaki us_gold → CMUdict (primary + alts) → Misaki us_silver → WikiPron
 *
 * Outputs:
 *   src/lib/data/packs/lexicon.bin
 *   src/lib/data/packs/stress.bin
 *   src/lib/data/packs/variants.bin
 *   src/lib/data/packs/rhyme-perfect.bin
 *   src/lib/data/packs/rhyme-end.bin
 *   src/lib/data/packs/rhyme-slant.bin
 *
 * Usage: node scripts/build-pronunciation.mjs
 * Requires: pip install wordfreq (for Zipf ranking of rhyme buckets)
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ensureDownloaded } from "./lib/download.mjs";
import { selectByFrequency, zipfFrequencies } from "./lib/frequency.mjs";
import {
  arpabetToIpa,
  endRhymeKeyFromIpa,
  isReducedRhymeKey,
  isWeakIpa,
  misakiToIpa,
  packStressPattern,
  rhymeKeyFromIpa,
  slantRhymeKeysFromIpa,
  STRESS_PACK_MAX_SYLLABLES,
  stressPatternFromIpa,
  syllableCountFromIpa,
  wikipronToIpa,
} from "./lib/ipa.mjs";
import { normalizeLemma } from "./lib/lemma.mjs";
import { writePronunciationPacks } from "./lib/writePronunciationPacks.mjs";

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
const poeticCompressionsPath = join(
  __dirname,
  "data/poetic-compressions.json",
);

const packsDir = join(root, "src/lib/data/packs");
const lexiconOutPath = join(packsDir, "lexicon.bin");
const stressOutPath = join(packsDir, "stress.bin");
const variantsOutPath = join(packsDir, "variants.bin");
const perfectOutPath = join(packsDir, "rhyme-perfect.bin");
const endOutPath = join(packsDir, "rhyme-end.bin");
const slantOutPath = join(packsDir, "rhyme-slant.bin");

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
      if (ipas.length > 0) {
        // Letter-name / acronym readings (A B S) — not true word variants.
        const primaries = (ipa.match(/ˈ/g) ?? []).length;
        if (primaries >= 2) return;
        // Weak forms (bən for been) when a fuller reading already exists.
        if (isWeakIpa(ipa) && !ipas.every((p) => isWeakIpa(p))) return;
      }
      seen.add(ipa);
      ipas.push(ipa);
    }

    if (gold.has(word)) add(gold.get(word));
    for (const ipa of cmu.get(word) ?? []) add(ipa);
    if (!gold.has(word) && !cmu.has(word) && silver.has(word)) {
      add(silver.get(word));
    }
    // WikiPron only when no higher-quality source contributed. Stressless
    // broad IPA must not pollute Misaki/CMU rhyme keys as alternate buckets.
    if (ipas.length === 0) {
      for (const ipa of (wikipron.get(word) ?? []).slice(0, 3)) add(ipa);
    }

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
  /** @type {Record<string, number>} */
  const stressPacked = Object.create(null);
  /** @type {Record<string, Array<{ syllables: number, packedStress: number }>>} */
  const variantsByWord = Object.create(null);
  /** @type {Record<string, string | string[]>} */
  const byWord = Object.create(null);
  /** @type {Record<string, string[]>} */
  const buckets = Object.create(null);
  /** @type {Record<string, string | string[]>} */
  const byWordEnd = Object.create(null);
  /** @type {Record<string, string[]>} */
  const bucketsEnd = Object.create(null);
  /** @type {Record<string, string | string[]>} */
  const byWordSlant = Object.create(null);
  /** @type {Record<string, string[]>} */
  const bucketsSlant = Object.create(null);

  let sylEntries = 0;
  let stressEntries = 0;
  let rhymeEntries = 0;
  let endEntries = 0;
  let slantEntries = 0;
  let skippedNoRhyme = 0;

  for (const [word, entry] of merged) {
    const syl = syllableCountFromIpa(entry.primary);
    if (syl >= 1) {
      syllables[word] = syl;
      sylEntries += 1;
      const stressPattern = stressPatternFromIpa(entry.primary);
      if (stressPattern.length > STRESS_PACK_MAX_SYLLABLES) {
        throw new Error(
          `stress pattern for "${word}" has ${stressPattern.length} syllables (max ${STRESS_PACK_MAX_SYLLABLES})`,
        );
      }
      const primaryPacked = packStressPattern(stressPattern);
      stressPacked[word] = primaryPacked;
      stressEntries += 1;

      /** @type {Map<string, { syllables: number, packedStress: number }>} */
      const altMap = new Map();
      for (const ipa of [entry.primary, ...entry.alts]) {
        const altSyl = syllableCountFromIpa(ipa);
        if (altSyl < 1) continue;
        const altStress = stressPatternFromIpa(ipa);
        if (altStress.length > STRESS_PACK_MAX_SYLLABLES) continue;
        if (altStress.length !== altSyl) continue;
        const packed = packStressPattern(altStress);
        if (altSyl === syl && packed === primaryPacked) continue;
        const key = `${altSyl}:${packed}`;
        if (!altMap.has(key)) {
          altMap.set(key, { syllables: altSyl, packedStress: packed });
        }
      }
      if (altMap.size > 0) {
        variantsByWord[word] = [...altMap.values()];
      }
    }

    /** @type {string[]} */
    const keys = [];
    const keySeen = new Set();
    /** @type {string[]} */
    const endKeys = [];
    const endSeen = new Set();
    /** @type {string[]} */
    const slantKeys = [];
    const slantSeen = new Set();
    const primaryKey = rhymeKeyFromIpa(entry.primary);
    const primaryEndKey = endRhymeKeyFromIpa(entry.primary);
    for (const ipa of [entry.primary, ...entry.alts]) {
      const isPrimary = ipa === entry.primary;
      const key = rhymeKeyFromIpa(ipa);
      if (
        key &&
        !keySeen.has(key) &&
        (isPrimary ||
          !primaryKey ||
          !isReducedRhymeKey(key) ||
          isReducedRhymeKey(primaryKey))
      ) {
        keySeen.add(key);
        keys.push(key);
        if (!(key in buckets)) buckets[key] = [];
        buckets[key].push(word);
      }
      const endKey = endRhymeKeyFromIpa(ipa);
      if (
        endKey &&
        !endSeen.has(endKey) &&
        (isPrimary ||
          !primaryEndKey ||
          !isReducedRhymeKey(endKey) ||
          isReducedRhymeKey(primaryEndKey))
      ) {
        endSeen.add(endKey);
        endKeys.push(endKey);
        if (!(endKey in bucketsEnd)) bucketsEnd[endKey] = [];
        bucketsEnd[endKey].push(word);
      }
      // Gate slant on the raw perfect slice so collapsed schwa alts do not
      // pollute vowel-family buckets.
      const allowSlant =
        isPrimary ||
        !primaryKey ||
        !key ||
        !isReducedRhymeKey(key) ||
        isReducedRhymeKey(primaryKey);
      if (allowSlant) {
        for (const slantKey of slantRhymeKeysFromIpa(ipa)) {
          if (slantSeen.has(slantKey)) continue;
          slantSeen.add(slantKey);
          slantKeys.push(slantKey);
          if (!(slantKey in bucketsSlant)) bucketsSlant[slantKey] = [];
          bucketsSlant[slantKey].push(word);
        }
      }
    }
    if (keys.length === 0) {
      skippedNoRhyme += 1;
    } else {
      byWord[word] = keys.length === 1 ? keys[0] : keys;
      rhymeEntries += 1;
    }
    if (endKeys.length > 0) {
      byWordEnd[word] = endKeys.length === 1 ? endKeys[0] : endKeys;
      endEntries += 1;
    }
    if (slantKeys.length > 0) {
      byWordSlant[word] = slantKeys.length === 1 ? slantKeys[0] : slantKeys;
      slantEntries += 1;
    }
  }

  // Curated poetic compressions (not in citation dictionaries).
  /** @type {Record<string, Array<{ syllables: number, stress: number[] }>>} */
  const poetic = JSON.parse(readFileSync(poeticCompressionsPath, "utf8"));
  let poeticMerged = 0;
  for (const [rawWord, alts] of Object.entries(poetic)) {
    const word = normalizeLemma(rawWord);
    if (!word || !(word in stressPacked)) continue;
    const primarySyl = syllables[word];
    const primaryPacked = stressPacked[word];
    const existing = variantsByWord[word] ?? [];
    const seen = new Set(
      existing.map((a) => `${a.syllables}:${a.packedStress}`),
    );
    for (const alt of alts) {
      if (
        !alt ||
        typeof alt.syllables !== "number" ||
        !Array.isArray(alt.stress) ||
        alt.stress.length !== alt.syllables ||
        alt.syllables < 1 ||
        alt.syllables > STRESS_PACK_MAX_SYLLABLES
      ) {
        throw new Error(`invalid poetic compression for "${word}"`);
      }
      const packed = packStressPattern(
        /** @type {(0 | 1 | 2)[]} */ (alt.stress),
      );
      if (alt.syllables === primarySyl && packed === primaryPacked) continue;
      const key = `${alt.syllables}:${packed}`;
      if (seen.has(key)) continue;
      seen.add(key);
      existing.push({ syllables: alt.syllables, packedStress: packed });
      poeticMerged += 1;
    }
    if (existing.length > 0) variantsByWord[word] = existing;
  }

  console.log("Ranking rhyme buckets by wordfreq…");
  const allBucketWords = [
    ...Object.values(buckets).flat(),
    ...Object.values(bucketsEnd).flat(),
    ...Object.values(bucketsSlant).flat(),
  ];
  const freq = zipfFrequencies(allBucketWords);

  /**
   * @param {Record<string, string[]>} raw
   * @returns {{ byKey: Record<string, string[]>, seats: number }}
   */
  function rankBuckets(raw) {
    /** @type {Record<string, string[]>} */
    const byKey = Object.create(null);
    let seats = 0;
    for (const [key, words] of Object.entries(raw)) {
      const selected = selectByFrequency(words, freq);
      byKey[key] = selected;
      seats += selected.length;
    }
    return { byKey, seats };
  }

  const perfect = rankBuckets(buckets);
  const end = rankBuckets(bucketsEnd);
  const slant = rankBuckets(bucketsSlant);

  const { wordCount, variantEntryCount } = writePronunciationPacks({
    syllables,
    stressPacked,
    variantsByWord,
    byWord,
    byKey: perfect.byKey,
    byWordEnd,
    byKeyEnd: end.byKey,
    byWordSlant,
    byKeySlant: slant.byKey,
    lexiconPath: lexiconOutPath,
    stressPath: stressOutPath,
    variantsPath: variantsOutPath,
    perfectPath: perfectOutPath,
    endPath: endOutPath,
    slantPath: slantOutPath,
  });

  console.log(
    `Syllables: ${sylEntries} / ${wordCount} lexicon words`,
  );
  console.log(`Stress patterns: ${stressEntries} words`);
  console.log(
    `Syllable variants: ${variantEntryCount} words (${poeticMerged} curated alts merged)`,
  );
  console.log(
    `Perfect rhymes: ${rhymeEntries} words / ${Object.keys(perfect.byKey).length} keys (${perfect.seats} seats; ${skippedNoRhyme} no-key)`,
  );
  console.log(
    `End rhymes: ${endEntries} words / ${Object.keys(end.byKey).length} keys (${end.seats} seats)`,
  );
  console.log(
    `Slant rhymes: ${slantEntries} words / ${Object.keys(slant.byKey).length} keys (${slant.seats} seats)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
