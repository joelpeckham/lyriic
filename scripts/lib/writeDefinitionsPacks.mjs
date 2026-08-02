/**
 * Encode letter-pair definition packs (LYXD) under packs/defs/.
 */

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { encodeDefinitions, reportPackSize } from "./dictPack.mjs";

const USAGE_ORDER = ["n", "v", "a", "r"];

/**
 * First two letters of a normalized lemma → digraph pack key.
 * One-letter / non-letter second char → `{letter}_`; non a–z start → `_`.
 *
 * @param {string} lemma
 * @returns {string}
 */
export function definitionPairKey(lemma) {
  const a = lemma[0];
  if (!a || a < "a" || a > "z") return "_";
  const b = lemma[1];
  if (!b || b < "a" || b > "z") return `${a}_`;
  return `${a}${b}`;
}

/**
 * @param {object} input
 * @param {string[]} input.lexWords
 * @param {Map<string, Array<{ usage: string, source: number, gloss: string }>>} input.byHead
 * @param {string} input.outDir
 */
export function writeDefinitionsPacks({ lexWords, byHead, outDir }) {
  const lexIndex = new Map(lexWords.map((w, i) => [w, i]));

  /** @type {Map<string, Array<{ wordId: number, senses: Array<{ usage: number, source: number, gloss: string }> }>>} */
  const byPair = new Map();

  for (const [head, senses] of byHead) {
    const wordId = lexIndex.get(head);
    if (wordId === undefined) continue;
    if (!senses || senses.length === 0) continue;

    const packed = [];
    for (const sense of senses) {
      const usage = USAGE_ORDER.indexOf(sense.usage);
      if (usage < 0) continue;
      packed.push({
        usage,
        source: sense.source & 0xff,
        gloss: sense.gloss,
      });
    }
    if (packed.length === 0) continue;

    const pair = definitionPairKey(head);
    let list = byPair.get(pair);
    if (!list) {
      list = [];
      byPair.set(pair, list);
    }
    list.push({ wordId, senses: packed });
  }

  mkdirSync(outDir, { recursive: true });
  for (const name of readdirSync(outDir)) {
    if (name.startsWith("defs-") && name.endsWith(".bin")) {
      rmSync(join(outDir, name));
    }
  }

  let totalRaw = 0;
  let totalEntries = 0;
  const pairs = [...byPair.keys()].sort();

  for (const pair of pairs) {
    const entries = byPair.get(pair);
    entries.sort((a, b) => a.wordId - b.wordId);
    const buf = encodeDefinitions(entries);
    const outPath = join(outDir, `defs-${pair}.bin`);
    writeFileSync(outPath, buf);
    totalRaw += buf.length;
    totalEntries += entries.length;
  }

  console.log(
    `Definitions: ${pairs.length} digraph packs, ${totalEntries} heads, ${(totalRaw / 1024 / 1024).toFixed(2)} MiB raw total`,
  );

  // Sample a mid-sized pack for size reporting.
  const samplePair =
    pairs.find((p) => p === "li") ??
    pairs.find((p) => (byPair.get(p)?.length ?? 0) > 50) ??
    pairs[0];
  if (samplePair) {
    const sampleEntries = byPair.get(samplePair);
    reportPackSize(
      `defs-${samplePair} (sample)`,
      encodeDefinitions(sampleEntries),
    );
  }
}
