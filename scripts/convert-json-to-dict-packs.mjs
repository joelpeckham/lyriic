/**
 * One-shot migration: convert committed JSON dictionaries to binary packs.
 * Usage: node scripts/convert-json-to-dict-packs.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { writePronunciationPacks } from "./lib/writePronunciationPacks.mjs";
import { writeThesaurusPack } from "./lib/writeThesaurusPack.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const packsDir = join(root, "src/lib/data/packs");

const sylPath = join(root, "src/lib/syllables/data/cmu-syllables.json");
const rhymePath = join(root, "src/lib/rhyme/data/rhyme-index.json");
const synPath = join(root, "src/lib/thesaurus/data/synonyms.json");

function main() {
  if (!existsSync(sylPath) || !existsSync(rhymePath)) {
    throw new Error("Missing syllable/rhyme JSON sources for conversion");
  }

  console.log("Reading JSON dictionaries…");
  const syllables = JSON.parse(readFileSync(sylPath, "utf8"));
  const rhyme = JSON.parse(readFileSync(rhymePath, "utf8"));

  const { wordCount } = writePronunciationPacks({
    syllables,
    byWord: rhyme.byWord,
    byKey: rhyme.byKey,
    byWordEnd: rhyme.byWordEnd,
    byKeyEnd: rhyme.byKeyEnd,
    lexiconPath: join(packsDir, "lexicon.bin"),
    perfectPath: join(packsDir, "rhyme-perfect.bin"),
    endPath: join(packsDir, "rhyme-end.bin"),
  });
  console.log(`Lexicon words: ${wordCount}`);

  if (existsSync(synPath)) {
    const synonymMap = JSON.parse(readFileSync(synPath, "utf8"));
    const lexWords = Object.keys(rhyme.byWord).sort();
    writeThesaurusPack({
      lexWords,
      synonymMap,
      outPath: join(packsDir, "thesaurus.bin"),
    });
  } else {
    console.warn("No synonyms.json — skipped thesaurus pack");
  }
}

main();
