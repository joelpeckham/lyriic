/**
 * Encode pronunciation artifacts as binary packs from in-memory maps.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import {
  encodeLexicon,
  encodeRhymePack,
  reportPackSize,
} from "./dictPack.mjs";

/**
 * @param {object} input
 * @param {Record<string, number>} input.syllables
 * @param {Record<string, string | string[]>} input.byWord
 * @param {Record<string, string[]>} input.byKey
 * @param {Record<string, string | string[]>} input.byWordEnd
 * @param {Record<string, string[]>} input.byKeyEnd
 * @param {string} input.lexiconPath
 * @param {string} input.perfectPath
 * @param {string} input.endPath
 */
export function writePronunciationPacks({
  syllables,
  byWord,
  byKey,
  byWordEnd,
  byKeyEnd,
  lexiconPath,
  perfectPath,
  endPath,
}) {
  const words = Object.keys(byWord).sort();
  const wordIndex = new Map(words.map((w, i) => [w, i]));
  const sylArr = new Uint8Array(words.length);
  for (let i = 0; i < words.length; i++) {
    sylArr[i] = syllables[words[i]] ?? 0;
  }

  /**
   * @param {Record<string, string | string[]>} wordKeys
   * @param {Record<string, string[]>} buckets
   * @param {"perfect" | "end"} mode
   */
  function buildMode(wordKeys, buckets, mode) {
    const keys = Object.keys(buckets);
    const keyIndex = new Map(keys.map((k, i) => [k, i]));
    /** @type {number[][]} */
    const byWordIds = new Array(words.length);
    for (let i = 0; i < words.length; i++) {
      const raw = wordKeys[words[i]];
      if (!raw) {
        byWordIds[i] = [];
        continue;
      }
      const list = Array.isArray(raw) ? raw : [raw];
      byWordIds[i] = list.map((k) => {
        const id = keyIndex.get(k);
        if (id === undefined) throw new Error(`missing key ${k} in ${mode}`);
        return id;
      });
    }
    /** @type {number[][]} */
    const bucketIds = keys.map((k) =>
      buckets[k].map((w) => {
        const id = wordIndex.get(w);
        if (id === undefined) throw new Error(`missing word ${w} in ${mode}`);
        return id;
      }),
    );
    return encodeRhymePack(mode, words.length, keys, byWordIds, bucketIds);
  }

  const lexBuf = encodeLexicon(words, sylArr);
  const perfectBuf = buildMode(byWord, byKey, "perfect");
  const endBuf = buildMode(byWordEnd, byKeyEnd, "end");

  mkdirSync(dirname(lexiconPath), { recursive: true });
  mkdirSync(dirname(perfectPath), { recursive: true });
  mkdirSync(dirname(endPath), { recursive: true });
  writeFileSync(lexiconPath, lexBuf);
  writeFileSync(perfectPath, perfectBuf);
  writeFileSync(endPath, endBuf);

  reportPackSize(`lexicon → ${lexiconPath}`, lexBuf);
  reportPackSize(`rhyme-perfect → ${perfectPath}`, perfectBuf);
  reportPackSize(`rhyme-end → ${endPath}`, endBuf);

  return { wordCount: words.length };
}
