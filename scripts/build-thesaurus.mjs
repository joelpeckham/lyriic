/**
 * Build a compact synonym map from Open English WordNet 2025 + Wiktionary.
 *
 * Primary: OEWN synset members + adjective `similar` links (CC-BY 4.0).
 * Related: OEWN co-hyponym neighborhood (siblings, sibling-hyponyms, hyponyms,
 * hypernym members), Zipf-capped per usage.
 * Depth: English Wiktionary synonyms via kaikki.org extract (CC-BY-SA).
 * Ranking: OEWN syns → OEWN related → Wiktionary fill (Zipf within each), per usage.
 * Requires: pip install wordfreq
 *
 * Single-word lemmas only; headwords must exist in the shared lexicon.
 * Output: src/lib/data/packs/thesaurus.bin (IDs into lexicon + overflow).
 *
 * Usage: node scripts/build-thesaurus.mjs
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
import { selectByFrequency, zipfFrequencies } from "./lib/frequency.mjs";
import { normalizeLemma } from "./lib/lemma.mjs";
import { writeThesaurusPack } from "./lib/writeThesaurusPack.mjs";

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
const outPath = join(root, "src/lib/data/packs/thesaurus.bin");

/** @typedef {"n" | "v" | "a" | "r"} Usage */

/** @type {Usage[]} */
const USAGE_ORDER = ["n", "v", "a", "r"];

/** Max OEWN related (co-hyponym) lemmas kept per head × usage after Zipf rank. */
const RELATED_CAP = 16;

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
 * @returns {{
 *   syn: Map<string, Map<Usage, Set<string>>>,
 *   related: Map<string, Map<Usage, Set<string>>>,
 * }}
 */
function loadOewnSynonyms(dir) {
  const files = readdirSync(dir).filter(
    (name) =>
      /^(noun|verb|adj|adv)\./.test(name) && name.endsWith(".json"),
  );

  /** @type {Map<string, { members: string[], similar: string[], hypernym: string[], usage: Usage }>} */
  const synsets = new Map();

  for (const file of files) {
    const usage = usageFromOewnFile(file);
    if (!usage) continue;
    /** @type {Record<string, { members?: string[], similar?: string[], hypernym?: string[] }>} */
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
        hypernym: synset.hypernym ?? [],
        usage,
      });
    }
  }

  /** @type {Map<string, string[]>} */
  const childrenByParent = new Map();
  for (const [id, { hypernym }] of synsets) {
    for (const parentId of hypernym) {
      let kids = childrenByParent.get(parentId);
      if (!kids) {
        kids = [];
        childrenByParent.set(parentId, kids);
      }
      kids.push(id);
    }
  }

  /** @type {Map<string, Map<Usage, Set<string>>>} */
  const syn = new Map();
  /** @type {Map<string, Map<Usage, Set<string>>>} */
  const related = new Map();

  for (const { members, similar, usage } of synsets.values()) {
    for (const a of members) {
      for (const b of members) addSyn(syn, a, b, usage);
    }
    for (const simId of similar) {
      const other = synsets.get(simId);
      if (!other) continue;
      for (const a of members) {
        for (const b of other.members) addSyn(syn, a, b, usage);
      }
      for (const a of other.members) {
        for (const b of members) addSyn(syn, a, b, other.usage);
      }
    }
  }

  /**
   * Link every member of `fromIds` → every member of `toIds` (one way).
   * Sibling pairs still become mutual because each synset is processed; avoiding
   * reverse cousin edges keeps high-frequency motion verbs from drowning heads
   * like bathe when a distant sibling-of-parent lists them as cousins.
   * @param {string[]} fromIds
   * @param {string[]} toIds
   */
  function linkRelated(fromIds, toIds) {
    for (const fromId of fromIds) {
      const from = synsets.get(fromId);
      if (!from) continue;
      for (const toId of toIds) {
        if (fromId === toId) continue;
        const to = synsets.get(toId);
        if (!to) continue;
        for (const a of from.members) {
          for (const b of to.members) {
            addSyn(related, a, b, from.usage);
          }
        }
      }
    }
  }

  for (const [id, { hypernym }] of synsets) {
    /** @type {Set<string>} */
    const siblingIds = new Set();
    for (const parentId of hypernym) {
      for (const kid of childrenByParent.get(parentId) ?? []) {
        if (kid !== id) siblingIds.add(kid);
      }
    }

    /** @type {Set<string>} */
    const cousinIds = new Set();
    for (const sibId of siblingIds) {
      for (const niece of childrenByParent.get(sibId) ?? []) {
        cousinIds.add(niece);
      }
    }

    const childIds = childrenByParent.get(id) ?? [];
    const parentIds = hypernym.filter((p) => synsets.has(p));

    linkRelated([id], [...siblingIds]);
    linkRelated([id], [...cousinIds]);
    linkRelated([id], childIds);
    linkRelated([id], parentIds);
  }

  console.log(
    `OEWN: ${syn.size} syn heads, ${related.size} related heads from ${synsets.size} synsets`,
  );
  return { syn, related };
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
 * OEWN syns → OEWN related (capped) → Wiktionary fill, each Zipf-ranked.
 *
 * @param {Map<Usage, Set<string>> | undefined} oewn
 * @param {Map<Usage, Set<string>> | undefined} oewnRelated
 * @param {Map<Usage, Set<string>> | undefined} wikt
 * @param {string} head
 * @param {Map<string, number>} freq
 * @returns {Record<string, string[]> | null}
 */
function selectSynonyms(oewn, oewnRelated, wikt, head, freq) {
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
    const related = selectByFrequency(
      [...(oewnRelated?.get(usage) ?? [])].filter((s) => !seen.has(s)),
      freq,
      RELATED_CAP,
    );
    for (const s of related) seen.add(s);
    const fill = selectByFrequency([...(wikt?.get(usage) ?? [])], freq).filter(
      (s) => !seen.has(s),
    );
    const list = [...primary, ...related, ...fill];
    if (list.length === 0) continue;
    out[usage] = list;
    total += list.length;
  }

  return total > 0 ? out : null;
}

async function main() {
  await ensureDownloaded(OEWN_URL, oewnZipPath);
  unzipOewn(oewnZipPath, oewnDir);

  if (!existsSync(lexiconPath)) {
    throw new Error(
      `Missing ${lexiconPath}. Run pnpm build:pronunciation first.`,
    );
  }
  const { words: lexWords } = decodeLexicon(readFileSync(lexiconPath));
  const lexSet = new Set(lexWords);

  const { syn: oewn, related: oewnRelated } = loadOewnSynonyms(oewnDir);

  console.log("Fetching / loading Wiktionary synonyms…");
  await ensureDownloaded(WIKT_URL, wiktPath);
  const wikt = await loadWiktionarySynonyms(wiktPath);

  /** @type {Set<string>} */
  const heads = new Set();
  /** @type {Set<string>} */
  const toScore = new Set();
  /**
   * @param {Map<string, Map<Usage, Set<string>>>} map
   */
  function absorbHeads(map) {
    for (const [head, byUsage] of map) {
      if (!lexSet.has(head)) continue;
      heads.add(head);
      toScore.add(head);
      for (const syns of byUsage.values()) {
        for (const s of syns) toScore.add(s);
      }
    }
  }
  absorbHeads(oewn);
  absorbHeads(oewnRelated);
  absorbHeads(wikt);

  console.log(
    `Ranking ${heads.size} lexicon-overlap heads (${toScore.size} unique lemmas) by wordfreq…`,
  );
  const freq = zipfFrequencies(toScore);

  /** @type {Record<string, Record<string, string[]>>} */
  const out = Object.create(null);
  let skippedHeads = 0;

  for (const head of heads) {
    const selected = selectSynonyms(
      oewn.get(head),
      oewnRelated.get(head),
      wikt.get(head),
      head,
      freq,
    );
    if (!selected) {
      skippedHeads += 1;
      continue;
    }
    out[head] = selected;
  }

  writeThesaurusPack({
    lexWords,
    synonymMap: out,
    outPath,
  });
  console.log(`Skipped empty heads: ${skippedHeads}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
