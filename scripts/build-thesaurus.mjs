/**
 * Build a compact synonym map from Open English WordNet 2025 + Wiktionary.
 *
 * Primary: OEWN synset members + adjective `similar` links (CC-BY 4.0).
 * Depth: English Wiktionary synonyms via kaikki.org extract (CC-BY-SA).
 * Ranking: OEWN first (Zipf within), then Wiktionary fill (Zipf), per usage.
 * Requires: pip install wordfreq
 *
 * Single-word lemmas only; headwords must exist in the syllable map.
 * Output groups synonyms by WordNet-style usage: n / v / a / r.
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

/** @typedef {"n" | "v" | "a" | "r"} Usage */

/** @type {Usage[]} */
const USAGE_ORDER = ["n", "v", "a", "r"];

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
 * @param {Map<string, Map<Usage, Set<string>>>} map
 * @param {string} head
 * @param {string} syn
 * @param {Usage} usage
 */
function addSyn(map, head, syn, usage) {
  if (!head || !syn || head === syn) return;
  let byUsage = map.get(head);
  if (!byUsage) {
    byUsage = new Map();
    map.set(head, byUsage);
  }
  let set = byUsage.get(usage);
  if (!set) {
    set = new Set();
    byUsage.set(usage, set);
  }
  set.add(syn);
}

/**
 * @param {string} dir
 * @returns {Map<string, Map<Usage, Set<string>>>}
 */
function loadOewnSynonyms(dir) {
  const files = readdirSync(dir).filter(
    (name) =>
      /^(noun|verb|adj|adv)\./.test(name) && name.endsWith(".json"),
  );

  /** @type {Map<string, { members: string[], similar: string[], usage: Usage }>} */
  const synsets = new Map();

  for (const file of files) {
    const usage = usageFromOewnFile(file);
    if (!usage) continue;
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
        usage,
      });
    }
  }

  /** @type {Map<string, Map<Usage, Set<string>>>} */
  const map = new Map();

  for (const { members, similar, usage } of synsets.values()) {
    for (const a of members) {
      for (const b of members) addSyn(map, a, b, usage);
    }
    for (const simId of similar) {
      const other = synsets.get(simId);
      if (!other) continue;
      for (const a of members) {
        for (const b of other.members) addSyn(map, a, b, usage);
      }
      for (const a of other.members) {
        for (const b of members) addSyn(map, a, b, other.usage);
      }
    }
  }

  console.log(`OEWN: ${map.size} heads from ${synsets.size} synsets`);
  return map;
}

/**
 * @param {string} gzPath
 * @returns {Promise<Map<string, Map<Usage, Set<string>>>>}
 */
async function loadWiktionarySynonyms(gzPath) {
  /** @type {Map<string, Map<Usage, Set<string>>>} */
  const map = new Map();
  const input = createReadStream(gzPath).pipe(createGunzip());
  const rl = createInterface({ input, crlfDelay: Infinity });

  let lines = 0;

  /** Skip historical / joke thesaurus fill that drowns OEWN ranking. */
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
   * @param {unknown} linkages
   * @param {string} head
   * @param {Usage} usage
   */
  function absorb(linkages, head, usage) {
    if (!Array.isArray(linkages)) return;
    for (const item of linkages) {
      if (item && typeof item === "object" && "tags" in item) {
        const tags = /** @type {{ tags?: unknown }} */ (item).tags;
        if (
          Array.isArray(tags) &&
          tags.some((t) => typeof t === "string" && SKIP_TAGS.has(t))
        ) {
          continue;
        }
      }
      const raw =
        typeof item === "string"
          ? item
          : item && typeof item === "object" && "word" in item
            ? /** @type {{ word?: string }} */ (item).word
            : null;
      if (typeof raw !== "string") continue;
      const syn = normalizeLemma(raw);
      if (!syn) continue;
      addSyn(map, head, syn, usage);
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

    const usage = usageFromWiktionaryPos(obj.pos);
    if (!usage) continue;

    const head = normalizeLemma(obj.word ?? "");
    if (!head) continue;

    absorb(obj.synonyms, head, usage);
    if (Array.isArray(obj.senses)) {
      for (const sense of obj.senses) {
        absorb(sense?.synonyms, head, usage);
      }
    }
  }

  console.log(`Wiktionary: ${map.size} heads (${lines} lines)`);
  return map;
}

/**
 * OEWN syns first (freq-ranked), then Wiktionary fill (freq-ranked), per usage.
 *
 * @param {Map<Usage, Set<string>> | undefined} oewn
 * @param {Map<Usage, Set<string>> | undefined} wikt
 * @param {string} head
 * @param {Map<string, number>} freq
 * @returns {Record<string, string[]> | null}
 */
function selectSynonyms(oewn, wikt, head, freq) {
  /** @type {Record<string, string[]>} */
  const out = {};
  let total = 0;

  for (const usage of USAGE_ORDER) {
    const primary = selectByFrequency(
      [...(oewn?.get(usage) ?? [])],
      freq,
    ).filter((s) => s !== head);
    const seen = new Set(primary);
    seen.add(head);
    const fill = selectByFrequency([...(wikt?.get(usage) ?? [])], freq).filter(
      (s) => !seen.has(s),
    );
    const list = [...primary, ...fill];
    if (list.length === 0) continue;
    out[usage] = list;
    total += list.length;
  }

  return total > 0 ? out : null;
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
  for (const [head, byUsage] of oewn) {
    if (!(head in cmu)) continue;
    heads.add(head);
    toScore.add(head);
    for (const syns of byUsage.values()) {
      for (const s of syns) toScore.add(s);
    }
  }
  for (const [head, byUsage] of wikt) {
    if (!(head in cmu)) continue;
    heads.add(head);
    toScore.add(head);
    for (const syns of byUsage.values()) {
      for (const s of syns) toScore.add(s);
    }
  }

  console.log(
    `Ranking ${heads.size} CMU-overlap heads (${toScore.size} unique lemmas) by wordfreq…`,
  );
  const freq = zipfFrequencies(toScore);

  /** @type {Record<string, Record<string, string[]>>} */
  const out = Object.create(null);
  let synonymTotal = 0;
  let skippedHeads = 0;

  for (const head of heads) {
    const selected = selectSynonyms(oewn.get(head), wikt.get(head), head, freq);
    if (!selected) {
      skippedHeads += 1;
      continue;
    }
    out[head] = selected;
    for (const list of Object.values(selected)) synonymTotal += list.length;
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
