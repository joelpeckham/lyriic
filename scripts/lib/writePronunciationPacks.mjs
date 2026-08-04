/**
 * Encode pronunciation artifacts as binary packs from in-memory maps.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import {
  encodeIpa,
  encodeLexicon,
  encodeRhymePack,
  encodeStress,
  encodeVariants,
  reportPackSize,
} from "./dictPack.mjs";

/**
 * @param {object} input
 * @param {Record<string, number>} input.syllables
 * @param {Record<string, number>} input.stressPacked word → packed u32
 * @param {Record<string, Array<{ syllables: number, packedStress: number }>>} [input.variantsByWord]
 * @param {Record<string, string>} [input.ipaByWord] word → primary display IPA
 * @param {Record<string, string | string[]>} input.byWord
 * @param {Record<string, string[]>} input.byKey
 * @param {Record<string, string | string[]>} input.byWordEnd
 * @param {Record<string, string[]>} input.byKeyEnd
 * @param {Record<string, string | string[]>} input.byWordSlant
 * @param {Record<string, string[]>} input.byKeySlant
 * @param {string} input.lexiconPath
 * @param {string} input.stressPath
 * @param {string} input.variantsPath
 * @param {string} input.ipaPath
 * @param {string} input.perfectPath
 * @param {string} input.endPath
 * @param {string} input.slantPath
 */
export function writePronunciationPacks({
  syllables,
  stressPacked,
  variantsByWord = {},
  ipaByWord = {},
  byWord,
  byKey,
  byWordEnd,
  byKeyEnd,
  byWordSlant,
  byKeySlant,
  lexiconPath,
  stressPath,
  variantsPath,
  ipaPath,
  perfectPath,
  endPath,
  slantPath,
}) {
  const words = Object.keys(byWord).sort();
  const wordIndex = new Map(words.map((w, i) => [w, i]));
  const sylArr = new Uint8Array(words.length);
  /** @type {number[]} */
  const stressArr = new Array(words.length);
  /** @type {string[]} */
  const ipaArr = new Array(words.length);
  for (let i = 0; i < words.length; i++) {
    sylArr[i] = syllables[words[i]] ?? 0;
    stressArr[i] = stressPacked[words[i]] ?? 0;
    ipaArr[i] = ipaByWord[words[i]] ?? "";
  }

  /** @type {Array<{ wordId: number, alts: Array<{ syllables: number, packedStress: number }> }>} */
  const variantEntries = [];
  for (let i = 0; i < words.length; i++) {
    const alts = variantsByWord[words[i]];
    if (!alts || alts.length === 0) continue;
    variantEntries.push({ wordId: i, alts });
  }

  /**
   * @param {Record<string, string | string[]>} wordKeys
   * @param {Record<string, string[]>} buckets
   * @param {"perfect" | "end" | "slant"} mode
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
  const stressBuf = encodeStress(stressArr);
  const variantsBuf = encodeVariants(variantEntries);
  const ipaBuf = encodeIpa(ipaArr);
  const perfectBuf = buildMode(byWord, byKey, "perfect");
  const endBuf = buildMode(byWordEnd, byKeyEnd, "end");
  const slantBuf = buildMode(byWordSlant, byKeySlant, "slant");

  mkdirSync(dirname(lexiconPath), { recursive: true });
  mkdirSync(dirname(stressPath), { recursive: true });
  mkdirSync(dirname(variantsPath), { recursive: true });
  mkdirSync(dirname(ipaPath), { recursive: true });
  mkdirSync(dirname(perfectPath), { recursive: true });
  mkdirSync(dirname(endPath), { recursive: true });
  mkdirSync(dirname(slantPath), { recursive: true });
  writeFileSync(lexiconPath, lexBuf);
  writeFileSync(stressPath, stressBuf);
  writeFileSync(variantsPath, variantsBuf);
  writeFileSync(ipaPath, ipaBuf);
  writeFileSync(perfectPath, perfectBuf);
  writeFileSync(endPath, endBuf);
  writeFileSync(slantPath, slantBuf);

  reportPackSize(`lexicon → ${lexiconPath}`, lexBuf);
  reportPackSize(`stress → ${stressPath}`, stressBuf);
  reportPackSize(`variants → ${variantsPath}`, variantsBuf);
  reportPackSize(`ipa → ${ipaPath}`, ipaBuf);
  reportPackSize(`rhyme-perfect → ${perfectPath}`, perfectBuf);
  reportPackSize(`rhyme-end → ${endPath}`, endBuf);
  reportPackSize(`rhyme-slant → ${slantPath}`, slantBuf);

  const ipaFilled = ipaArr.reduce((n, s) => n + (s ? 1 : 0), 0);
  return {
    wordCount: words.length,
    variantEntryCount: variantEntries.length,
    ipaFilled,
  };
}
