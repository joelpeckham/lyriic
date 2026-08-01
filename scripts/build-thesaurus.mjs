/**
 * Build a compact synonym map from Open English WordNet 2025 + Wiktionary.
 *
 * Primary: OEWN synset members + adjective `similar` links (CC-BY 4.0).
 * Depth: English Wiktionary synonyms via kaikki.org extract (CC-BY-SA).
 * Ranking: OEWN first (Zipf within), then Wiktionary fill (Zipf).
 * Requires: pip install wordfreq
 *
 * Single-word lemmas only; headwords must exist in the syllable map.
 *
 * Usage: node scripts/build-thesaurus.mjs
 */

import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createGunzip } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { execFileSync } from "node:child_process";

import { ensureDownloaded } from "./lib/download.mjs";
import { selectByFrequency, zipfFrequencies } from "./lib/frequency.mjs";
import { normalizeLemma } from "./lib/lemma.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sourcesDir = join(__dirname, "sources");

const OEWN_URL = "https://en-word.net/downloads/english-wordnet-2025-json.zip";
const WIKT_URL =
  "https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl.gz";

const oewnZipPath = join(sourcesDir, "english-wordnet-2025-json.zip");
const oewnDir = join(sourcesDir, "oewn-2025");
const wiktPath = join(sourcesDir, "kaikki-english.jsonl.gz");
const cmuPath = join(root, "src/lib/syllables/data/cmu-syllables.json");
const outDir = join(root, "src/lib/thesaurus/data");
const outPath = join(outDir, "synonyms.json");

const MAX_SYNS = 60;

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
 * @param {Map<string, Set<string>>} map
 * @param {string} head
 * @param {string} syn
 */
function addSyn(map, head, syn) {
  if (!head || !syn || head === syn) return;
  let set = map.get(head);
  if (!set) {
    set = new Set();
    map.set(head, set);
  }
  set.add(syn);
}

/**
 * @param {string} dir
 * @returns {Map<string, Set<string>>}
 */
function loadOewnSynonyms(dir) {
  const files = readdirSync(dir).filter(
    (name) =>
      /^(noun|verb|adj|adv)\./.test(name) && name.endsWith(".json"),
  );

  /** @type {Map<string, { members: string[], similar: string[] }>} */
  const synsets = new Map();

  for (const file of files) {
    /** @type {Record<string, { members?: string[], similar?: string[] }>} */
    const data = JSON.parse(readFileSync(join(dir, file), "utf8"));
    for (const [id, synset] of Object.entries(data)) {
      /** @type {string[]} */
      const members = [];
      for (const m of synset.members ?? []) {
        const lemma = normalizeLemma(m);
        if (lemma) members.push(lemma);
      }
      if (members.length === 0) continue;
      synsets.set(id, {
        members,
        similar: synset.similar ?? [],
      });
    }
  }

  /** @type {Map<string, Set<string>>} */
  const map = new Map();

  for (const { members, similar } of synsets.values()) {
    for (const a of members) {
      for (const b of members) addSyn(map, a, b);
    }
    for (const simId of similar) {
      const other = synsets.get(simId);
      if (!other) continue;
      for (const a of members) {
        for (const b of other.members) addSyn(map, a, b);
      }
      for (const a of other.members) {
        for (const b of members) addSyn(map, a, b);
      }
    }
  }

  console.log(`OEWN: ${map.size} heads from ${synsets.size} synsets`);
  return map;
}

/**
 * @param {string} gzPath
 * @returns {Promise<Map<string, Set<string>>>}
 */
async function loadWiktionarySynonyms(gzPath) {
  /** @type {Map<string, Set<string>>} */
  const map = new Map();
  const input = createReadStream(gzPath).pipe(createGunzip());
  const rl = createInterface({ input, crlfDelay: Infinity });

  let lines = 0;

  /**
   * @param {unknown} linkages
   * @param {string} head
   */
  function absorb(linkages, head) {
    if (!Array.isArray(linkages)) return;
    for (const item of linkages) {
      const raw =
        typeof item === "string"
          ? item
          : item && typeof item === "object" && "word" in item
            ? /** @type {{ word?: string }} */ (item).word
            : null;
      if (typeof raw !== "string") continue;
      const syn = normalizeLemma(raw);
      if (!syn) continue;
      addSyn(map, head, syn);
    }
  }

  for await (const line of rl) {
    if (!line) continue;
    lines += 1;
    if (lines % 200000 === 0) {
      console.log(`  Wiktionary… ${lines} lines`);
    }

    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      continue;
    }

    if (obj.lang_code && obj.lang_code !== "en") continue;
    if (obj.lang && obj.lang !== "English") continue;

    const head = normalizeLemma(obj.word ?? "");
    if (!head) continue;

    absorb(obj.synonyms, head);
    if (Array.isArray(obj.senses)) {
      for (const sense of obj.senses) {
        absorb(sense?.synonyms, head);
      }
    }
  }

  console.log(`Wiktionary: ${map.size} heads (${lines} lines)`);
  return map;
}

/**
 * OEWN syns first (freq-ranked), then Wiktionary fill (freq-ranked).
 *
 * @param {Set<string> | undefined} oewn
 * @param {Set<string> | undefined} wikt
 * @param {string} head
 * @param {Map<string, number>} freq
 * @returns {string[]}
 */
function selectSynonyms(oewn, wikt, head, freq) {
  const primary = selectByFrequency([...(oewn ?? [])], freq, MAX_SYNS).filter(
    (s) => s !== head,
  );
  if (primary.length >= MAX_SYNS) return primary;

  const seen = new Set(primary);
  seen.add(head);
  const fill = selectByFrequency([...(wikt ?? [])], freq, MAX_SYNS)
    .filter((s) => !seen.has(s))
    .slice(0, MAX_SYNS - primary.length);
  return [...primary, ...fill];
}

async function main() {
  await ensureDownloaded(OEWN_URL, oewnZipPath);
  unzipOewn(oewnZipPath, oewnDir);

  /** @type {Record<string, number>} */
  const cmu = JSON.parse(readFileSync(cmuPath, "utf8"));

  const oewn = loadOewnSynonyms(oewnDir);

  console.log("Fetching / loading Wiktionary synonyms…");
  await ensureDownloaded(WIKT_URL, wiktPath);
  const wikt = await loadWiktionarySynonyms(wiktPath);

  /** @type {Set<string>} */
  const heads = new Set();
  /** @type {Set<string>} */
  const toScore = new Set();
  for (const [head, syns] of oewn) {
    if (!(head in cmu)) continue;
    heads.add(head);
    toScore.add(head);
    for (const s of syns) toScore.add(s);
  }
  for (const [head, syns] of wikt) {
    if (!(head in cmu)) continue;
    heads.add(head);
    toScore.add(head);
    for (const s of syns) toScore.add(s);
  }

  console.log(
    `Ranking ${heads.size} CMU-overlap heads (${toScore.size} unique lemmas) by wordfreq…`,
  );
  const freq = zipfFrequencies(toScore);

  /** @type {Record<string, string[]>} */
  const out = Object.create(null);
  let synonymTotal = 0;
  let skippedHeads = 0;

  for (const head of heads) {
    const selected = selectSynonyms(oewn.get(head), wikt.get(head), head, freq);
    if (selected.length === 0) {
      skippedHeads += 1;
      continue;
    }
    out[head] = selected;
    synonymTotal += selected.length;
  }

  mkdirSync(outDir, { recursive: true });
  const payload = `${JSON.stringify(out)}\n`;
  writeFileSync(outPath, payload, "utf8");

  const bytes = Buffer.byteLength(payload);
  console.log(
    `Wrote ${Object.keys(out).length} headwords (${synonymTotal} synonyms; ${skippedHeads} empty) → ${outPath} (${(bytes / 1024 / 1024).toFixed(2)} MiB)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
