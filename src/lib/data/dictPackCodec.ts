/**
 * Binary dictionary pack decode (shared by main thread + worker).
 * Formats mirror scripts/lib/dictPack.mjs (LYXL / LYXP / LYXE / LYXR / LYXT).
 */

export const DICT_PACK_VERSION = 1;

/** Stress pack uses a dedicated version (u32 patterns; v1 was u16). */
export const STRESS_PACK_VERSION = 2;

/** Variants pack version (sparse alt list). */
export const VARIANTS_PACK_VERSION = 1;

export const DICT_MAGIC = {
  lexicon: "LYXL",
  stress: "LYXS",
  variants: "LYXV",
  rhymePerfect: "LYXP",
  rhymeEnd: "LYXE",
  rhymeSlant: "LYXR",
  thesaurus: "LYXT",
} as const;

export type RhymePackMode = "perfect" | "end" | "slant";

function rhymeMagicForMode(mode: RhymePackMode): string {
  if (mode === "perfect") return DICT_MAGIC.rhymePerfect;
  if (mode === "end") return DICT_MAGIC.rhymeEnd;
  return DICT_MAGIC.rhymeSlant;
}

/** Max syllables encodable in a packed u32 (2 bits each). */
export const STRESS_PACK_MAX_SYLLABLES = 16;

export type StressCode = 0 | 1 | 2;

export type Lexicon = {
  words: string[];
  wordToId: Map<string, number>;
  syllables: Uint8Array;
};

/** Packed per-word stress patterns aligned with lexicon word ids. */
export type StressPack = {
  packed: Uint32Array;
};

/** One non-primary syllable/stress alternate. */
export type SyllableVariantAlt = {
  syllables: number;
  packedStress: number;
};

/** Sparse syllable/stress variants keyed by lexicon word id. */
export type VariantsPack = {
  /** wordId → non-primary alts (absent ids have no alts). */
  byWordId: Map<number, SyllableVariantAlt[]>;
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
    if (i + 3 > buf.length) {
      throw new Error("front-coded header truncated");
    }
    const shared = buf[i++]!;
    const restLen = buf[i]! | (buf[i + 1]! << 8);
    i += 2;
    if (i + restLen > buf.length) {
      throw new Error("front-coded body truncated");
    }
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

/** Pack stress codes into a u32 (2 bits per syllable, low → high index). */
export function packStressPattern(pattern: readonly StressCode[]): number {
  if (pattern.length > STRESS_PACK_MAX_SYLLABLES) {
    throw new Error(
      `stress pattern exceeds max syllables (${STRESS_PACK_MAX_SYLLABLES}): ${pattern.length}`,
    );
  }
  let packed = 0;
  for (let i = 0; i < pattern.length; i++) {
    const code = pattern[i]! & 3;
    packed |= (code === 3 ? 0 : code) << (i * 2);
  }
  return packed >>> 0;
}

/** Unpack a u32 stress pattern for `syllableCount` syllables. */
export function unpackStressPattern(
  packed: number,
  syllableCount: number,
): StressCode[] {
  const n = Math.min(
    Math.max(0, syllableCount | 0),
    STRESS_PACK_MAX_SYLLABLES,
  );
  const out = new Array<StressCode>(n);
  for (let i = 0; i < n; i++) {
    const code = (packed >>> (i * 2)) & 3;
    out[i] = (code === 3 ? 0 : code) as StressCode;
  }
  return out;
}

export function decodeStress(buf: Uint8Array): StressPack {
  const magic = readMagic(buf);
  if (magic !== DICT_MAGIC.stress) {
    throw new Error(`bad stress magic: ${magic}`);
  }
  if (buf[4] !== STRESS_PACK_VERSION) {
    throw new Error(`unsupported stress version: ${buf[4]}`);
  }
  const count = readU32LE(buf, 5);
  const need = 9 + count * 4;
  if (buf.length < need) {
    throw new Error("stress pack truncated");
  }
  const packed = new Uint32Array(count);
  for (let i = 0; i < count; i++) {
    const o = 9 + i * 4;
    packed[i] = readU32LE(buf, o);
  }
  return { packed };
}

export function decodeVariants(buf: Uint8Array): VariantsPack {
  const magic = readMagic(buf);
  if (magic !== DICT_MAGIC.variants) {
    throw new Error(`bad variants magic: ${magic}`);
  }
  if (buf[4] !== VARIANTS_PACK_VERSION) {
    throw new Error(`unsupported variants version: ${buf[4]}`);
  }
  const entryCount = readU32LE(buf, 5);
  let i = 9;
  const byWordId = new Map<number, SyllableVariantAlt[]>();
  for (let e = 0; e < entryCount; e++) {
    if (i + 5 > buf.length) throw new Error("variants pack truncated");
    const wordId = readU32LE(buf, i);
    i += 4;
    const altCount = buf[i++]!;
    if (i + altCount * 5 > buf.length) {
      throw new Error("variants pack truncated");
    }
    const alts = new Array<SyllableVariantAlt>(altCount);
    for (let a = 0; a < altCount; a++) {
      const syllables = buf[i++]!;
      const packedStress = readU32LE(buf, i);
      i += 4;
      alts[a] = { syllables, packedStress };
    }
    byWordId.set(wordId, alts);
  }
  return { byWordId };
}

export function decodeRhymePack(
  buf: Uint8Array,
  expectMode: RhymePackMode,
): RhymeModeData {
  const magic = readMagic(buf);
  const expect = rhymeMagicForMode(expectMode);
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
  | "stress"
  | "variants"
  | "rhyme-perfect"
  | "rhyme-end"
  | "rhyme-slant"
  | "thesaurus";

export type DecodedPack =
  | { kind: "lexicon"; data: Lexicon }
  | { kind: "stress"; data: StressPack }
  | { kind: "variants"; data: VariantsPack }
  | { kind: "rhyme-perfect"; data: RhymeModeData }
  | { kind: "rhyme-end"; data: RhymeModeData }
  | { kind: "rhyme-slant"; data: RhymeModeData }
  | { kind: "thesaurus"; data: ThesaurusPack };

export function decodePack(kind: DictPackKind, buf: Uint8Array): DecodedPack {
  switch (kind) {
    case "lexicon":
      return { kind, data: decodeLexicon(buf) };
    case "stress":
      return { kind, data: decodeStress(buf) };
    case "variants":
      return { kind, data: decodeVariants(buf) };
    case "rhyme-perfect":
      return { kind, data: decodeRhymePack(buf, "perfect") };
    case "rhyme-end":
      return { kind, data: decodeRhymePack(buf, "end") };
    case "rhyme-slant":
      return { kind, data: decodeRhymePack(buf, "slant") };
    case "thesaurus":
      return { kind, data: decodeThesaurus(buf) };
  }
}
