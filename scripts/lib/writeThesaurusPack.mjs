/**
 * Encode thesaurus.bin from a synonym map + lexicon word list.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { encodeThesaurus, reportPackSize } from "./dictPack.mjs";

const USAGE_ORDER = ["n", "v", "a", "r"];

/**
 * @param {object} input
 * @param {string[]} input.lexWords sorted lexicon lemmas
 * @param {Record<string, Record<string, string[]>>} input.synonymMap
 * @param {string} input.outPath
 */
export function writeThesaurusPack({ lexWords, synonymMap, outPath }) {
  const lexIndex = new Map(lexWords.map((w, i) => [w, i]));
  const overflowSet = new Set();

  for (const [head, groups] of Object.entries(synonymMap)) {
    if (!lexIndex.has(head)) overflowSet.add(head);
    for (const list of Object.values(groups)) {
      for (const syn of list) {
        if (!lexIndex.has(syn)) overflowSet.add(syn);
      }
    }
  }

  const overflowWords = [...overflowSet].sort();
  const overflowIndex = new Map(
    overflowWords.map((w, i) => [w, lexWords.length + i]),
  );

  /** @param {string} w */
  function idOf(w) {
    const lex = lexIndex.get(w);
    if (lex !== undefined) return lex;
    const ov = overflowIndex.get(w);
    if (ov === undefined) throw new Error(`unindexed lemma ${w}`);
    return ov;
  }

  /** @type {Array<{ headId: number, usages: Array<{ usage: number, synIds: number[] }> }>} */
  const entries = [];
  let synonymTotal = 0;

  for (const [head, groups] of Object.entries(synonymMap)) {
    /** @type {Array<{ usage: number, synIds: number[] }>} */
    const usages = [];
    for (let u = 0; u < USAGE_ORDER.length; u++) {
      const list = groups[USAGE_ORDER[u]];
      if (!list || list.length === 0) continue;
      usages.push({ usage: u, synIds: list.map(idOf) });
      synonymTotal += list.length;
    }
    if (usages.length === 0) continue;
    entries.push({ headId: idOf(head), usages });
  }

  // Stable order by headId for better compression
  entries.sort((a, b) => a.headId - b.headId);

  const buf = encodeThesaurus(lexWords.length, overflowWords, entries);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, buf);
  reportPackSize(`thesaurus → ${outPath}`, buf);
  console.log(
    `Thesaurus: ${entries.length} heads, ${synonymTotal} synonym seats, ${overflowWords.length} overflow lemmas`,
  );
}
