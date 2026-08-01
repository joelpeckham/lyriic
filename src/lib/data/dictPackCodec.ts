/**
 * Binary dictionary pack decode (shared by main thread + worker).
 * Formats mirror scripts/lib/dictPack.mjs (LYXL / LYXP / LYXE / LYXT).
 */

export const DICT_PACK_VERSION = 1;

export const DICT_MAGIC = {
  lexicon: "LYXL",
  rhymePerfect: "LYXP",
  rhymeEnd: "LYXE",
  thesaurus: "LYXT",
} as const;

export type Lexicon = {
  words: string[];
  wordToId: Map<string, number>;
  syllables: Uint8Array;
};

export type RhymeModeData = {
  keys: string[];
  /** wordId → keyIds */
  byWord: number[][];
  /** keyId → wordIds (Zipf order) */
  buckets: number[][];
};

export type ThesaurusUsageCode = 0 | 1 | 2 | 3;

export type ThesaurusEntry = {
  headId: number;
  usages: Array<{ usage: ThesaurusUsageCode; synIds: number[] }>;
};

export type ThesaurusPack = {
  lexWordCount: number;
  overflowWords: string[];
  /** head string → entry (built when lexicon is available) */
  byHead: Map<string, ThesaurusEntry>;
  entries: ThesaurusEntry[];
};

const USAGE_CHARS = ["n", "v", "a", "r"] as const;

export function usageCodeToChar(
  code: number,
): (typeof USAGE_CHARS)[number] | null {
  return USAGE_CHARS[code] ?? null;
}

function readMagic(buf: Uint8Array): string {
  return String.fromCharCode(buf[0]!, buf[1]!, buf[2]!, buf[3]!);
}

function readU32LE(buf: Uint8Array, offset: number): number {
  return (
    (buf[offset]! |
      (buf[offset + 1]! << 8) |
      (buf[offset + 2]! << 16) |
      (buf[offset + 3]! << 24)) >>>
    0
  );
}

export function decodeUvarint(
  buf: Uint8Array,
  offset: number,
): [number, number] {
  let result = 0;
  let shift = 0;
  let i = offset;
  while (i < buf.length) {
    const byte = buf[i++]!;
    result |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return [result >>> 0, i];
    shift += 7;
    if (shift > 35) throw new Error("uvarint too long");
  }
  throw new Error("uvarint truncated");
}

export function decodeFrontCoded(
  buf: Uint8Array,
  offset: number,
  count: number,
): [string[], number] {
  const words = new Array<string>(count);
  let prev = "";
  let i = offset;
  const dec = new TextDecoder();
  for (let n = 0; n < count; n++) {
    const shared = buf[i++]!;
    const restLen = buf[i]! | (buf[i + 1]! << 8);
    i += 2;
    const rest = dec.decode(buf.subarray(i, i + restLen));
    i += restLen;
    const w = prev.slice(0, shared) + rest;
    words[n] = w;
    prev = w;
  }
  return [words, i];
}

export function decodeLexicon(buf: Uint8Array): Lexicon {
  const magic = readMagic(buf);
  if (magic !== DICT_MAGIC.lexicon) {
    throw new Error(`bad lexicon magic: ${magic}`);
  }
  if (buf[4] !== DICT_PACK_VERSION) {
    throw new Error(`unsupported lexicon version: ${buf[4]}`);
  }
  const count = readU32LE(buf, 5);
  const [words, afterWords] = decodeFrontCoded(buf, 9, count);
  const syllables = buf.subarray(afterWords, afterWords + count);
  if (syllables.length !== count) {
    throw new Error("lexicon syllables truncated");
  }
  const wordToId = new Map<string, number>();
  for (let i = 0; i < words.length; i++) {
    wordToId.set(words[i]!, i);
  }
  return { words, wordToId, syllables: new Uint8Array(syllables) };
}

export function decodeRhymePack(
  buf: Uint8Array,
  expectMode: "perfect" | "end",
): RhymeModeData {
  const magic = readMagic(buf);
  const expect =
    expectMode === "perfect" ? DICT_MAGIC.rhymePerfect : DICT_MAGIC.rhymeEnd;
  if (magic !== expect) throw new Error(`bad rhyme magic: ${magic}`);
  if (buf[4] !== DICT_PACK_VERSION) {
    throw new Error(`unsupported rhyme version: ${buf[4]}`);
  }
  const wordCount = readU32LE(buf, 5);
  const keyCount = readU32LE(buf, 9);
  let i = 13;
  const [keys, afterKeys] = decodeFrontCoded(buf, i, keyCount);
  i = afterKeys;

  const byWord = new Array<number[]>(wordCount);
  for (let w = 0; w < wordCount; w++) {
    const n = buf[i++]!;
    const ids = new Array<number>(n);
    for (let k = 0; k < n; k++) {
      const [id, next] = decodeUvarint(buf, i);
      i = next;
      ids[k] = id;
    }
    byWord[w] = ids;
  }

  const buckets = new Array<number[]>(keyCount);
  for (let k = 0; k < keyCount; k++) {
    const [n, afterN] = decodeUvarint(buf, i);
    i = afterN;
    const ids = new Array<number>(n);
    for (let w = 0; w < n; w++) {
      const [id, next] = decodeUvarint(buf, i);
      i = next;
      ids[w] = id;
    }
    buckets[k] = ids;
  }
  return { keys, byWord, buckets };
}

export function decodeThesaurus(buf: Uint8Array): ThesaurusPack {
  const magic = readMagic(buf);
  if (magic !== DICT_MAGIC.thesaurus) {
    throw new Error(`bad thesaurus magic: ${magic}`);
  }
  if (buf[4] !== DICT_PACK_VERSION) {
    throw new Error(`unsupported thesaurus version: ${buf[4]}`);
  }
  const lexWordCount = readU32LE(buf, 5);
  const overflowCount = readU32LE(buf, 9);
  let i = 13;
  const [overflowWords, afterOverflow] = decodeFrontCoded(
    buf,
    i,
    overflowCount,
  );
  i = afterOverflow;
  const entryCount = readU32LE(buf, i);
  i += 4;

  const entries = new Array<ThesaurusEntry>(entryCount);
  for (let e = 0; e < entryCount; e++) {
    const [headId, afterHead] = decodeUvarint(buf, i);
    i = afterHead;
    const nUsages = buf[i++]!;
    const usages = new Array<{
      usage: ThesaurusUsageCode;
      synIds: number[];
    }>(nUsages);
    for (let u = 0; u < nUsages; u++) {
      const usage = buf[i++]! as ThesaurusUsageCode;
      const [nSyns, afterN] = decodeUvarint(buf, i);
      i = afterN;
      const synIds = new Array<number>(nSyns);
      for (let s = 0; s < nSyns; s++) {
        const [id, next] = decodeUvarint(buf, i);
        i = next;
        synIds[s] = id;
      }
      usages[u] = { usage, synIds };
    }
    entries[e] = { headId, usages };
  }

  return {
    lexWordCount,
    overflowWords,
    entries,
    byHead: new Map(),
  };
}

/** Resolve a thesaurus/lexicon id once lexicon words are known. */
export function resolveDictId(
  id: number,
  lexWords: readonly string[],
  overflowWords: readonly string[],
): string | undefined {
  if (id < lexWords.length) return lexWords[id];
  return overflowWords[id - lexWords.length];
}

export function buildThesaurusByHead(
  pack: ThesaurusPack,
  lexWords: readonly string[],
): Map<string, ThesaurusEntry> {
  const byHead = new Map<string, ThesaurusEntry>();
  for (const entry of pack.entries) {
    const head = resolveDictId(entry.headId, lexWords, pack.overflowWords);
    if (head) byHead.set(head, entry);
  }
  pack.byHead = byHead;
  return byHead;
}

export type DictPackKind =
  | "lexicon"
  | "rhyme-perfect"
  | "rhyme-end"
  | "thesaurus";

export type DecodedPack =
  | { kind: "lexicon"; data: Lexicon }
  | { kind: "rhyme-perfect"; data: RhymeModeData }
  | { kind: "rhyme-end"; data: RhymeModeData }
  | { kind: "thesaurus"; data: ThesaurusPack };

export function decodePack(kind: DictPackKind, buf: Uint8Array): DecodedPack {
  switch (kind) {
    case "lexicon":
      return { kind, data: decodeLexicon(buf) };
    case "rhyme-perfect":
      return { kind, data: decodeRhymePack(buf, "perfect") };
    case "rhyme-end":
      return { kind, data: decodeRhymePack(buf, "end") };
    case "thesaurus":
      return { kind, data: decodeThesaurus(buf) };
  }
}
