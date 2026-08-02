/**
 * Build letter-pair definition packs from Open English WordNet + Wiktionary.
 *
 * Primary: OEWN synset glosses (CC-BY 4.0).
 * Fill: English Wiktionary glosses via kaikki.org (CC-BY-SA) for lexicon
 * heads with no OEWN senses.
 *
 * Requires: lexicon.bin from build:pronunciation.
 * Output: src/lib/data/packs/defs/defs-{pair}.bin
 *
 * Usage: node scripts/build-definitions.mjs
 */

import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { createGunzip } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { execFileSync } from "node:child_process";

import { decodeLexicon } from "./lib/dictPack.mjs";
import { ensureDownloaded } from "./lib/download.mjs";
import { normalizeLemma } from "./lib/lemma.mjs";
import { writeDefinitionsPacks } from "./lib/writeDefinitionsPacks.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sourcesDir = join(__dirname, "sources");

const OEWN_URL = "https://en-word.net/downloads/english-wordnet-2025-json.zip";
const WIKT_URL =
  "https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl.gz";

const oewnZipPath = join(sourcesDir, "english-wordnet-2025-json.zip");
const oewnDir = join(sourcesDir, "oewn-2025");
const wiktPath = join(sourcesDir, "kaikki-english.jsonl.gz");
const lexiconPath = join(root, "src/lib/data/packs/lexicon.bin");
const outDir = join(root, "src/lib/data/packs/defs");

/** @typedef {"n" | "v" | "a" | "r"} Usage */

const SOURCE_OEWN = 0;
const SOURCE_WIKT = 1;
const MAX_SENSES_PER_USAGE = 6;
const MAX_GLOSS_LEN = 280;

const SKIP_TAGS = new Set([
  "obsolete",
  "archaic",
  "rare",
  "dated",
  "historical",
  "humorous",
  "slang",
  "eye dialect",
  "misspelling",
]);

/**
 * @param {string} zipPath
 * @param {string} destDir
 */
function unzipOewn(zipPath, destDir) {
  if (existsSync(join(destDir, "entries-a.json"))) return;
  mkdirSync(destDir, { recursive: true });
  console.log(`Unpacking OEWN → ${destDir}`);
  execFileSync("unzip", ["-qo", zipPath, "-d", destDir]);
}

/**
 * @param {string} fileName
 * @returns {Usage | null}
 */
function usageFromOewnFile(fileName) {
  if (fileName.startsWith("noun.")) return "n";
  if (fileName.startsWith("verb.")) return "v";
  if (fileName.startsWith("adj.")) return "a";
  if (fileName.startsWith("adv.")) return "r";
  return null;
}

/**
 * @param {unknown} pos
 * @returns {Usage | null}
 */
function usageFromWiktionaryPos(pos) {
  if (pos === "noun") return "n";
  if (pos === "verb") return "v";
  if (pos === "adj") return "a";
  if (pos === "adv") return "r";
  return null;
}

/**
 * @param {unknown} raw
 * @returns {string[]}
 */
function glossList(raw) {
  if (typeof raw === "string" && raw.trim()) return [raw.trim()];
  if (!Array.isArray(raw)) return [];
  /** @type {string[]} */
  const out = [];
  for (const item of raw) {
    if (typeof item === "string" && item.trim()) out.push(item.trim());
  }
  return out;
}

/**
 * @param {string} gloss
 * @returns {string}
 */
function clipGloss(gloss) {
  if (gloss.length <= MAX_GLOSS_LEN) return gloss;
  const cut = gloss.slice(0, MAX_GLOSS_LEN - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > 40 ? cut.slice(0, sp) : cut).trimEnd()}…`;
}

/**
 * @param {Map<string, Array<{ usage: Usage, source: number, gloss: string }>>} map
 * @param {string} head
 * @param {Usage} usage
 * @param {number} source
 * @param {string} gloss
 * @param {Set<string>} lexSet
 */
function addSense(map, head, usage, source, gloss, lexSet) {
  if (!lexSet.has(head)) return;
  const cleaned = clipGloss(gloss.replace(/\s+/g, " ").trim());
  if (!cleaned) return;

  let list = map.get(head);
  if (!list) {
    list = [];
    map.set(head, list);
  }

  let usageCount = 0;
  for (const s of list) {
    if (s.usage === usage) usageCount += 1;
    if (s.usage === usage && s.gloss === cleaned) return;
  }
  if (usageCount >= MAX_SENSES_PER_USAGE) return;
  list.push({ usage, source, gloss: cleaned });
}

/**
 * @param {string} dir
 * @param {Set<string>} lexSet
 * @returns {Map<string, Array<{ usage: Usage, source: number, gloss: string }>>}
 */
function loadOewnDefinitions(dir, lexSet) {
  /** @type {Map<string, Array<{ usage: Usage, source: number, gloss: string }>>} */
  const map = new Map();
  const files = readdirSync(dir).filter(
    (name) =>
      /^(noun|verb|adj|adv)\./.test(name) && name.endsWith(".json"),
  );

  for (const file of files) {
    const usage = usageFromOewnFile(file);
    if (!usage) continue;
    /** @type {Record<string, { members?: string[], definition?: unknown }>} */
    const data = JSON.parse(readFileSync(join(dir, file), "utf8"));
    for (const synset of Object.values(data)) {
      const glosses = glossList(synset.definition);
      if (glosses.length === 0) continue;
      for (const m of synset.members ?? []) {
        const lemma = normalizeLemma(m);
        if (!lemma) continue;
        for (const gloss of glosses) {
          addSense(map, lemma, usage, SOURCE_OEWN, gloss, lexSet);
        }
      }
    }
  }

  console.log(`OEWN definitions: ${map.size} lexicon heads`);
  return map;
}

/**
 * True when every usage bucket is at {@link MAX_SENSES_PER_USAGE}.
 * @param {Map<string, Array<{ usage: Usage, source: number, gloss: string }>>} map
 * @param {string} head
 */
function headSensesSaturated(map, head) {
  const list = map.get(head);
  if (!list) return false;
  /** @type {Record<Usage, number>} */
  const counts = { n: 0, v: 0, a: 0, r: 0 };
  for (const s of list) counts[s.usage] += 1;
  return (
    counts.n >= MAX_SENSES_PER_USAGE &&
    counts.v >= MAX_SENSES_PER_USAGE &&
    counts.a >= MAX_SENSES_PER_USAGE &&
    counts.r >= MAX_SENSES_PER_USAGE
  );
}

/**
 * @param {string} gzPath
 * @param {Set<string>} missingHeads heads still accepting Wiktionary fill
 * @param {Map<string, Array<{ usage: Usage, source: number, gloss: string }>>} map
 * @param {Set<string>} lexSet
 */
async function fillWiktionaryDefinitions(gzPath, missingHeads, map, lexSet) {
  if (missingHeads.size === 0) {
    console.log("Wiktionary fill: nothing missing");
    return;
  }

  const input = createReadStream(gzPath).pipe(createGunzip());
  const rl = createInterface({ input, crlfDelay: Infinity });
  let lines = 0;
  let filled = 0;

  /**
   * @param {unknown} tags
   * @returns {boolean}
   */
  function hasSkipTag(tags) {
    return (
      Array.isArray(tags) &&
      tags.some((t) => typeof t === "string" && SKIP_TAGS.has(t))
    );
  }

  for await (const line of rl) {
    if (!line) continue;
    lines += 1;
    if (lines % 200000 === 0) {
      console.log(`  Wiktionary… ${lines} lines (${filled} heads filled)`);
    }

    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      continue;
    }

    if (obj.lang_code && obj.lang_code !== "en") continue;
    if (obj.lang && obj.lang !== "English") continue;

    const usage = usageFromWiktionaryPos(obj.pos);
    if (!usage) continue;

    const head = normalizeLemma(obj.word ?? "");
    if (!head || !missingHeads.has(head)) continue;
    if (hasSkipTag(obj.tags)) continue;

    if (!Array.isArray(obj.senses)) continue;
    const beforeLen = map.get(head)?.length ?? 0;
    for (const sense of obj.senses) {
      if (!sense || typeof sense !== "object") continue;
      if (hasSkipTag(sense.tags)) continue;
      for (const gloss of glossList(sense.glosses)) {
        addSense(map, head, usage, SOURCE_WIKT, gloss, lexSet);
      }
    }
    const afterLen = map.get(head)?.length ?? 0;
    if (afterLen > beforeLen && beforeLen === 0) filled += 1;
    // Keep scanning later POS lines until every usage bucket is full.
    if (headSensesSaturated(map, head)) {
      missingHeads.delete(head);
      if (missingHeads.size === 0) break;
    }
  }

  let stillMissing = 0;
  for (const head of missingHeads) {
    if (!map.has(head)) stillMissing += 1;
  }
  console.log(
    `Wiktionary fill: ${filled} heads (${lines} lines scanned, ${stillMissing} still missing)`,
  );
}

async function main() {
  if (!existsSync(lexiconPath)) {
    console.error("Missing lexicon.bin — run pnpm build:pronunciation first");
    process.exit(1);
  }

  await ensureDownloaded(OEWN_URL, oewnZipPath);
  await ensureDownloaded(WIKT_URL, wiktPath);
  unzipOewn(oewnZipPath, oewnDir);

  const { words: lexWords } = decodeLexicon(readFileSync(lexiconPath));
  const lexSet = new Set(lexWords);
  console.log(`Lexicon: ${lexWords.length} lemmas`);

  const byHead = loadOewnDefinitions(oewnDir, lexSet);

  /** @type {Set<string>} */
  const missing = new Set();
  for (const w of lexWords) {
    if (!byHead.has(w)) missing.add(w);
  }
  console.log(`Missing OEWN glosses: ${missing.size} lexicon heads`);

  await fillWiktionaryDefinitions(wiktPath, missing, byHead, lexSet);

  writeDefinitionsPacks({ lexWords, byHead, outDir });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
