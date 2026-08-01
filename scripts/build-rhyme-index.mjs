/**
 * Build a compact perfect-rhyme index from CMU Pronouncing Dictionary.
 *
 * Source: https://github.com/cmusphinx/cmudict (BSD-style / unrestricted use).
 * Perfect rhyme key = ARPAbet phones from the last primary (1) stress vowel
 * through the coda; falls back to last secondary (2) stress. Primary
 * pronunciations only (no WORD(N) variants).
 *
 * Key algorithm mirrored in src/lib/rhyme/rhymeKey.ts (keep in sync).
 *
 * Usage: node scripts/build-rhyme-index.mjs
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeLemma } from "./lib/lemma.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputPath = join(__dirname, "cmudict.dict");
const outDir = join(root, "src/lib/rhyme/data");
const outPath = join(outDir, "rhyme-index.json");

const MAX_PER_BUCKET = 40;

/**
 * @param {string[]} phones
 * @returns {string | null}
 */
function rhymeKeyFromPhones(phones) {
  let start = -1;
  for (let i = phones.length - 1; i >= 0; i -= 1) {
    if (/\d$/.test(phones[i]) && phones[i].endsWith("1")) {
      start = i;
      break;
    }
  }
  if (start === -1) {
    for (let i = phones.length - 1; i >= 0; i -= 1) {
      if (/\d$/.test(phones[i]) && phones[i].endsWith("2")) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) return null;
  return phones.slice(start).join(" ");
}

/**
 * @param {string[]} words
 * @returns {string[]}
 */
function selectBucket(words) {
  const seen = new Set();
  /** @type {string[]} */
  const clean = [];
  for (const raw of words) {
    const word = normalizeLemma(raw);
    if (!word || seen.has(word)) continue;
    seen.add(word);
    clean.push(word);
  }
  clean.sort((a, b) => a.length - b.length || a.localeCompare(b));
  return clean.slice(0, MAX_PER_BUCKET);
}

const text = readFileSync(inputPath, "latin1");
/** @type {Record<string, string>} */
const byWord = Object.create(null);
/** @type {Record<string, string[]>} */
const buckets = Object.create(null);
let entries = 0;
let skippedVariants = 0;
let skippedNoStress = 0;
let skippedLemma = 0;

for (const line of text.split(/\r?\n/)) {
  if (!line || line.startsWith(";;;") || line.startsWith("##")) continue;

  const hash = line.indexOf("#");
  const body = (hash === -1 ? line : line.slice(0, hash)).trim();
  if (!body) continue;

  const parts = body.split(/\s+/);
  if (parts.length < 2) continue;

  const entry = parts[0];
  const variantMatch = entry.match(/^(.+)\((\d+)\)$/);
  if (variantMatch) {
    skippedVariants += 1;
    continue;
  }

  const word = normalizeLemma(entry);
  if (!word) {
    skippedLemma += 1;
    continue;
  }

  // First primary wins (CMU lists primary before variants).
  if (word in byWord) continue;

  const phones = parts.slice(1);
  const key = rhymeKeyFromPhones(phones);
  if (!key) {
    skippedNoStress += 1;
    continue;
  }

  byWord[word] = key;
  if (!(key in buckets)) buckets[key] = [];
  buckets[key].push(word);
  entries += 1;
}

/** @type {Record<string, string[]>} */
const byKey = Object.create(null);
let bucketSeats = 0;
for (const [key, words] of Object.entries(buckets)) {
  // Cap display candidates; byWord still maps every lemma so OOV-in-bucket
  // words can still look up the shared key.
  const selected = selectBucket(words);
  byKey[key] = selected;
  bucketSeats += selected.length;
}

mkdirSync(outDir, { recursive: true });
const payload = `${JSON.stringify({ byWord, byKey })}\n`;
writeFileSync(outPath, payload, "utf8");

const bytes = Buffer.byteLength(payload);
console.log(
  `Wrote ${entries} words / ${Object.keys(byKey).length} rhyme keys (${bucketSeats} bucket seats; ${skippedVariants} variants, ${skippedNoStress} no-stress, ${skippedLemma} lemma skipped) → ${outPath} (${(bytes / 1024 / 1024).toFixed(2)} MiB)`,
);
