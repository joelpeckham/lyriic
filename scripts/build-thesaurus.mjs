/**
 * Build a compact synonym map from Moby Thesaurus II.
 *
 * Source: Project Gutenberg ebook 3202 / Moby Thesaurus II (public domain).
 * Format: headword,syn1,syn2,... (one record per line).
 *
 * Keeps single-word headwords/synonyms only (poetry editor replaces one token).
 * Caps synonyms per headword; prefers shorter lemmas when truncating.
 * Headwords must exist in the CMU syllable map for a compact poetry-focused index.
 *
 * Usage: node scripts/build-thesaurus.mjs
 * Downloads scripts/mthesaur.txt from Gutenberg if missing.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeLemma } from "./lib/lemma.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputPath = join(__dirname, "mthesaur.txt");
const MOBY_URL = "https://www.gutenberg.org/files/3202/files/mthesaur.txt";
const cmuPath = join(root, "src/lib/syllables/data/cmu-syllables.json");
const outDir = join(root, "src/lib/thesaurus/data");
const outPath = join(outDir, "synonyms.json");

const MAX_SYNS = 40;

async function ensureMobySource() {
  if (existsSync(inputPath)) return;
  console.log(`Fetching Moby Thesaurus II → ${inputPath}`);
  const res = await fetch(MOBY_URL);
  if (!res.ok) {
    throw new Error(
      `Failed to download Moby thesaurus: ${res.status} ${res.statusText}`,
    );
  }
  writeFileSync(inputPath, await res.text(), "utf8");
}

/**
 * @param {string[]} syns
 * @param {string} head
 * @returns {string[]}
 */
function selectSynonyms(syns, head) {
  const seen = new Set();
  /** @type {string[]} */
  const clean = [];
  for (const raw of syns) {
    const word = normalizeLemma(raw);
    if (!word || word === head || seen.has(word)) continue;
    seen.add(word);
    clean.push(word);
  }
  // Prefer shorter, then alpha — better “common word” heuristic for v1.
  clean.sort((a, b) => a.length - b.length || a.localeCompare(b));
  return clean.slice(0, MAX_SYNS);
}

async function main() {
  await ensureMobySource();

  /** @type {Record<string, number>} */
  const cmu = JSON.parse(readFileSync(cmuPath, "utf8"));
  const text = readFileSync(inputPath, "utf8");
  /** @type {Record<string, string[]>} */
  const map = Object.create(null);
  let heads = 0;
  let skippedHeads = 0;
  let synonymTotal = 0;

  for (const line of text.split(/\r?\n/)) {
    if (!line) continue;
    const parts = line.split(",");
    if (parts.length < 2) continue;

    const head = normalizeLemma(parts[0] ?? "");
    // Keep headwords that overlap CMU so the poetry editor stays compact.
    if (!head || !(head in cmu)) {
      skippedHeads += 1;
      continue;
    }

    const syns = selectSynonyms(parts.slice(1), head);
    if (syns.length === 0) {
      skippedHeads += 1;
      continue;
    }

    // First headword wins if duplicates appear.
    if (head in map) continue;
    map[head] = syns;
    heads += 1;
    synonymTotal += syns.length;
  }

  mkdirSync(outDir, { recursive: true });
  const payload = `${JSON.stringify(map)}\n`;
  writeFileSync(outPath, payload, "utf8");

  const bytes = Buffer.byteLength(payload);
  console.log(
    `Wrote ${heads} headwords (${synonymTotal} synonyms; ${skippedHeads} heads skipped) → ${outPath} (${(bytes / 1024 / 1024).toFixed(2)} MiB)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
