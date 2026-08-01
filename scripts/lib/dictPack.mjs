/**
 * Shared binary dictionary pack codec (Node build scripts).
 *
 * Formats (little-endian):
 *   lexicon.bin   magic LYXL — front-coded words + syllable bytes
 *   stress.bin    magic LYXS — packed per-syllable stress (u32 × wordCount, v2)
 *   variants.bin  magic LYXV — sparse non-primary syl/stress alts by word id
 *   rhyme-*.bin   magic LYXP / LYXE — IPA keys + word→key + key→wordIds
 *   thesaurus.bin magic LYXT — overflow words + head/synonym id entries
 */

import { brotliCompressSync, constants as zlibConstants, gzipSync } from "node:zlib";

export const VERSION = 1;

/** Stress pack version (u32 patterns; v1 was u16). */
export const STRESS_PACK_VERSION = 2;

/** Variants pack version (sparse alt list). */
export const VARIANTS_PACK_VERSION = 1;

export const MAGIC = {
  lexicon: "LYXL",
  stress: "LYXS",
  variants: "LYXV",
  rhymePerfect: "LYXP",
  rhymeEnd: "LYXE",
  thesaurus: "LYXT",
};

/** @param {string} s */
function magicBytes(s) {
  return Buffer.from(s, "ascii");
}

/** @param {number} n */
export function encodeUvarint(n) {
  const out = [];
  let v = n >>> 0;
  while (v >= 0x80) {
    out.push((v & 0x7f) | 0x80);
    v >>>= 7;
  }
  out.push(v);
  return Buffer.from(out);
}

/**
 * @param {Uint8Array} buf
 * @param {number} offset
 * @returns {[number, number]}
 */
export function decodeUvarint(buf, offset) {
  let result = 0;
  let shift = 0;
  let i = offset;
  while (i < buf.length) {
    const byte = buf[i++];
    result |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return [result >>> 0, i];
    shift += 7;
    if (shift > 35) throw new Error("uvarint too long");
  }
  throw new Error("uvarint truncated");
}

/**
 * @param {string[]} words sorted
 * @returns {Buffer}
 */
export function encodeFrontCoded(words) {
  const parts = [];
  let prev = "";
  const enc = new TextEncoder();
  for (const w of words) {
    let shared = 0;
    const max = Math.min(prev.length, w.length, 255);
    while (shared < max && prev.charCodeAt(shared) === w.charCodeAt(shared)) {
      shared += 1;
    }
    const rest = w.slice(shared);
    const bytes = enc.encode(rest);
    if (bytes.length > 0xffff) {
      throw new Error(`rest too long for word: ${w}`);
    }
    const header = Buffer.alloc(3);
    header[0] = shared;
    header.writeUInt16LE(bytes.length, 1);
    parts.push(header, Buffer.from(bytes));
    prev = w;
  }
  return Buffer.concat(parts);
}

/**
 * @param {Uint8Array} buf
 * @param {number} offset
 * @param {number} count
 * @returns {[string[], number]}
 */
export function decodeFrontCoded(buf, offset, count) {
  const words = new Array(count);
  let prev = "";
  let i = offset;
  const dec = new TextDecoder();
  for (let n = 0; n < count; n++) {
    const shared = buf[i++];
    const restLen = buf[i] | (buf[i + 1] << 8);
    i += 2;
    const rest = dec.decode(buf.subarray(i, i + restLen));
    i += restLen;
    const w = prev.slice(0, shared) + rest;
    words[n] = w;
    prev = w;
  }
  return [words, i];
}

/**
 * @param {string[]} words sorted unique lemmas
 * @param {Uint8Array | number[]} syllables parallel counts
 * @returns {Buffer}
 */
export function encodeLexicon(words, syllables) {
  if (words.length !== syllables.length) {
    throw new Error("lexicon words/syllables length mismatch");
  }
  const count = words.length;
  const header = Buffer.alloc(9);
  magicBytes(MAGIC.lexicon).copy(header, 0);
  header[4] = VERSION;
  header.writeUInt32LE(count, 5);
  const wordBuf = encodeFrontCoded(words);
  const sylBuf = Buffer.from(syllables);
  return Buffer.concat([header, wordBuf, sylBuf]);
}

/**
 * @param {Uint8Array | Buffer} buf
 * @returns {{ words: string[], syllables: Uint8Array }}
 */
export function decodeLexicon(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const magic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);
  if (magic !== MAGIC.lexicon) throw new Error(`bad lexicon magic: ${magic}`);
  if (u8[4] !== VERSION) throw new Error(`unsupported lexicon version: ${u8[4]}`);
  const count = u8[5] | (u8[6] << 8) | (u8[7] << 16) | (u8[8] << 24);
  const [words, afterWords] = decodeFrontCoded(u8, 9, count);
  const syllables = u8.subarray(afterWords, afterWords + count);
  if (syllables.length !== count) throw new Error("lexicon syllables truncated");
  return { words, syllables: new Uint8Array(syllables) };
}

/**
 * @param {number[]} packedStress parallel u32 packed patterns (wordCount)
 * @returns {Buffer}
 */
export function encodeStress(packedStress) {
  const count = packedStress.length;
  const header = Buffer.alloc(9);
  magicBytes(MAGIC.stress).copy(header, 0);
  header[4] = STRESS_PACK_VERSION;
  header.writeUInt32LE(count, 5);
  const body = Buffer.alloc(count * 4);
  for (let i = 0; i < count; i++) {
    body.writeUInt32LE(packedStress[i] >>> 0, i * 4);
  }
  return Buffer.concat([header, body]);
}

/**
 * @param {Uint8Array | Buffer} buf
 * @returns {{ packed: Uint32Array }}
 */
export function decodeStress(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const magic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);
  if (magic !== MAGIC.stress) throw new Error(`bad stress magic: ${magic}`);
  if (u8[4] !== STRESS_PACK_VERSION) {
    throw new Error(`unsupported stress version: ${u8[4]}`);
  }
  const count =
    (u8[5] | (u8[6] << 8) | (u8[7] << 16) | (u8[8] << 24)) >>> 0;
  const need = 9 + count * 4;
  if (u8.length < need) throw new Error("stress pack truncated");
  const packed = new Uint32Array(count);
  for (let i = 0; i < count; i++) {
    const o = 9 + i * 4;
    packed[i] =
      (u8[o] | (u8[o + 1] << 8) | (u8[o + 2] << 16) | (u8[o + 3] << 24)) >>>
      0;
  }
  return { packed };
}

/**
 * Sparse syllable/stress variants (non-primary only).
 *
 * @param {Array<{ wordId: number, alts: Array<{ syllables: number, packedStress: number }> }>} entries
 * @returns {Buffer}
 */
export function encodeVariants(entries) {
  const header = Buffer.alloc(9);
  magicBytes(MAGIC.variants).copy(header, 0);
  header[4] = VARIANTS_PACK_VERSION;
  header.writeUInt32LE(entries.length, 5);
  /** @type {Buffer[]} */
  const parts = [header];
  for (const entry of entries) {
    if (entry.alts.length === 0 || entry.alts.length > 255) {
      throw new Error(
        `variants entry wordId=${entry.wordId} has invalid altCount ${entry.alts.length}`,
      );
    }
    const block = Buffer.alloc(4 + 1 + entry.alts.length * 5);
    block.writeUInt32LE(entry.wordId >>> 0, 0);
    block[4] = entry.alts.length;
    let o = 5;
    for (const alt of entry.alts) {
      block[o++] = alt.syllables & 0xff;
      block.writeUInt32LE(alt.packedStress >>> 0, o);
      o += 4;
    }
    parts.push(block);
  }
  return Buffer.concat(parts);
}

/**
 * @param {Uint8Array | Buffer} buf
 * @returns {{ entries: Array<{ wordId: number, alts: Array<{ syllables: number, packedStress: number }> }> }}
 */
export function decodeVariants(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const magic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);
  if (magic !== MAGIC.variants) throw new Error(`bad variants magic: ${magic}`);
  if (u8[4] !== VARIANTS_PACK_VERSION) {
    throw new Error(`unsupported variants version: ${u8[4]}`);
  }
  const entryCount =
    (u8[5] | (u8[6] << 8) | (u8[7] << 16) | (u8[8] << 24)) >>> 0;
  let i = 9;
  /** @type {Array<{ wordId: number, alts: Array<{ syllables: number, packedStress: number }> }>} */
  const entries = new Array(entryCount);
  for (let e = 0; e < entryCount; e++) {
    if (i + 5 > u8.length) throw new Error("variants pack truncated");
    const wordId =
      (u8[i] | (u8[i + 1] << 8) | (u8[i + 2] << 16) | (u8[i + 3] << 24)) >>> 0;
    i += 4;
    const altCount = u8[i++];
    if (i + altCount * 5 > u8.length) throw new Error("variants pack truncated");
    /** @type {Array<{ syllables: number, packedStress: number }>} */
    const alts = new Array(altCount);
    for (let a = 0; a < altCount; a++) {
      const syllables = u8[i++];
      const packedStress =
        (u8[i] | (u8[i + 1] << 8) | (u8[i + 2] << 16) | (u8[i + 3] << 24)) >>>
        0;
      i += 4;
      alts[a] = { syllables, packedStress };
    }
    entries[e] = { wordId, alts };
  }
  return { entries };
}

/**
 * @param {"perfect" | "end"} mode
 * @param {number} wordCount lexicon size
 * @param {string[]} keys sorted? insertion order from Object.keys is fine
 * @param {Array<number[]>} byWord wordId → keyIds
 * @param {Array<number[]>} buckets keyId → wordIds Zipf-ordered
 * @returns {Buffer}
 */
export function encodeRhymePack(mode, wordCount, keys, byWord, buckets) {
  const magic = mode === "perfect" ? MAGIC.rhymePerfect : MAGIC.rhymeEnd;
  if (byWord.length !== wordCount) {
    throw new Error("rhyme byWord length mismatch");
  }
  if (buckets.length !== keys.length) {
    throw new Error("rhyme buckets length mismatch");
  }
  const header = Buffer.alloc(13);
  magicBytes(magic).copy(header, 0);
  header[4] = VERSION;
  header.writeUInt32LE(wordCount, 5);
  header.writeUInt32LE(keys.length, 9);

  const keyBuf = encodeFrontCoded(keys);
  const byWordParts = [];
  for (let w = 0; w < wordCount; w++) {
    const ids = byWord[w] ?? [];
    if (ids.length > 255) throw new Error(`too many keys for word ${w}`);
    byWordParts.push(Buffer.from([ids.length]));
    for (const id of ids) byWordParts.push(encodeUvarint(id));
  }
  const bucketParts = [];
  for (const wordIds of buckets) {
    bucketParts.push(encodeUvarint(wordIds.length));
    for (const id of wordIds) bucketParts.push(encodeUvarint(id));
  }
  return Buffer.concat([
    header,
    keyBuf,
    Buffer.concat(byWordParts),
    Buffer.concat(bucketParts),
  ]);
}

/**
 * @param {Uint8Array | Buffer} buf
 * @param {"perfect" | "end"} expectMode
 * @returns {{ keys: string[], byWord: number[][], buckets: number[][] }}
 */
export function decodeRhymePack(buf, expectMode) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const magic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);
  const expect = expectMode === "perfect" ? MAGIC.rhymePerfect : MAGIC.rhymeEnd;
  if (magic !== expect) throw new Error(`bad rhyme magic: ${magic}`);
  if (u8[4] !== VERSION) throw new Error(`unsupported rhyme version: ${u8[4]}`);
  const wordCount = u8[5] | (u8[6] << 8) | (u8[7] << 16) | (u8[8] << 24);
  const keyCount = u8[9] | (u8[10] << 8) | (u8[11] << 16) | (u8[12] << 24);
  let i = 13;
  const [keys, afterKeys] = decodeFrontCoded(u8, i, keyCount);
  i = afterKeys;

  /** @type {number[][]} */
  const byWord = new Array(wordCount);
  for (let w = 0; w < wordCount; w++) {
    const n = u8[i++];
    const ids = new Array(n);
    for (let k = 0; k < n; k++) {
      const [id, next] = decodeUvarint(u8, i);
      i = next;
      ids[k] = id;
    }
    byWord[w] = ids;
  }

  /** @type {number[][]} */
  const buckets = new Array(keyCount);
  for (let k = 0; k < keyCount; k++) {
    const [n, afterN] = decodeUvarint(u8, i);
    i = afterN;
    const ids = new Array(n);
    for (let w = 0; w < n; w++) {
      const [id, next] = decodeUvarint(u8, i);
      i = next;
      ids[w] = id;
    }
    buckets[k] = ids;
  }
  return { keys, byWord, buckets };
}

/**
 * @param {number} lexWordCount
 * @param {string[]} overflowWords sorted
 * @param {Array<{ headId: number, usages: Array<{ usage: number, synIds: number[] }> }>} entries
 * @returns {Buffer}
 */
export function encodeThesaurus(lexWordCount, overflowWords, entries) {
  const header = Buffer.alloc(13);
  magicBytes(MAGIC.thesaurus).copy(header, 0);
  header[4] = VERSION;
  header.writeUInt32LE(lexWordCount, 5);
  header.writeUInt32LE(overflowWords.length, 9);
  const overflowBuf = encodeFrontCoded(overflowWords);
  const entryHeader = Buffer.alloc(4);
  entryHeader.writeUInt32LE(entries.length, 0);
  const parts = [header, overflowBuf, entryHeader];
  for (const entry of entries) {
    parts.push(encodeUvarint(entry.headId));
    parts.push(Buffer.from([entry.usages.length]));
    for (const u of entry.usages) {
      parts.push(Buffer.from([u.usage]));
      parts.push(encodeUvarint(u.synIds.length));
      for (const id of u.synIds) parts.push(encodeUvarint(id));
    }
  }
  return Buffer.concat(parts);
}

/**
 * @param {Uint8Array | Buffer} buf
 * @returns {{
 *   lexWordCount: number,
 *   overflowWords: string[],
 *   entries: Array<{ headId: number, usages: Array<{ usage: number, synIds: number[] }> }>
 * }}
 */
export function decodeThesaurus(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const magic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);
  if (magic !== MAGIC.thesaurus) throw new Error(`bad thesaurus magic: ${magic}`);
  if (u8[4] !== VERSION) throw new Error(`unsupported thesaurus version: ${u8[4]}`);
  const lexWordCount = u8[5] | (u8[6] << 8) | (u8[7] << 16) | (u8[8] << 24);
  const overflowCount = u8[9] | (u8[10] << 8) | (u8[11] << 16) | (u8[12] << 24);
  let i = 13;
  const [overflowWords, afterOverflow] = decodeFrontCoded(u8, i, overflowCount);
  i = afterOverflow;
  const entryCount = u8[i] | (u8[i + 1] << 8) | (u8[i + 2] << 16) | (u8[i + 3] << 24);
  i += 4;
  /** @type {Array<{ headId: number, usages: Array<{ usage: number, synIds: number[] }> }>} */
  const entries = new Array(entryCount);
  for (let e = 0; e < entryCount; e++) {
    const [headId, afterHead] = decodeUvarint(u8, i);
    i = afterHead;
    const nUsages = u8[i++];
    /** @type {Array<{ usage: number, synIds: number[] }>} */
    const usages = new Array(nUsages);
    for (let u = 0; u < nUsages; u++) {
      const usage = u8[i++];
      const [nSyns, afterN] = decodeUvarint(u8, i);
      i = afterN;
      const synIds = new Array(nSyns);
      for (let s = 0; s < nSyns; s++) {
        const [id, next] = decodeUvarint(u8, i);
        i = next;
        synIds[s] = id;
      }
      usages[u] = { usage, synIds };
    }
    entries[e] = { headId, usages };
  }
  return { lexWordCount, overflowWords, entries };
}

/**
 * @param {string} label
 * @param {Buffer} buf
 */
export function reportPackSize(label, buf) {
  const gzip = gzipSync(buf, { level: 9 });
  const brotli = brotliCompressSync(buf, {
    params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 },
  });
  console.log(
    `${label}: ${(buf.length / 1024 / 1024).toFixed(2)} MiB raw, ${(gzip.length / 1024 / 1024).toFixed(2)} MiB gzip, ${(brotli.length / 1024 / 1024).toFixed(2)} MiB brotli`,
  );
}
