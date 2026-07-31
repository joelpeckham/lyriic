/**
 * Build primary syllable counts from CMU Pronouncing Dictionary.
 *
 * Source: https://github.com/cmusphinx/cmudict (BSD-style / unrestricted use).
 * Syllable count = number of ARPAbet phones ending in stress digits 0|1|2.
 * Only the primary pronunciation (no WORD(N) variant) is kept.
 *
 * Usage: node scripts/build-cmu-syllables.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputPath = join(__dirname, "cmudict.dict");
const outDir = join(root, "src/lib/syllables/data");
const outPath = join(outDir, "cmu-syllables.json");

const STRESS_PHONE = /\d$/;

function syllableCount(phones) {
  let count = 0;
  for (const phone of phones) {
    if (STRESS_PHONE.test(phone)) count += 1;
  }
  return count;
}

const text = readFileSync(inputPath, "latin1");
/** @type {Record<string, number>} */
const primary = Object.create(null);
let entries = 0;
let skippedVariants = 0;

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

  const word = entry.toLowerCase();
  const phones = parts.slice(1);
  const count = syllableCount(phones);
  if (count < 1) continue;

  // First primary wins (CMU lists primary before variants).
  if (word in primary) continue;
  primary[word] = count;
  entries += 1;
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, `${JSON.stringify(primary)}\n`, "utf8");

const bytes = Buffer.byteLength(JSON.stringify(primary));
console.log(
  `Wrote ${entries} primary counts (${skippedVariants} variants skipped) → ${outPath} (${(bytes / 1024).toFixed(1)} KiB)`,
);
