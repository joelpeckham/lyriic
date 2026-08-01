/**
 * IPA / ARPAbet helpers for fused pronunciation builds.
 * Misaki near-IPA expansion and CMU ARPAbet→IPA follow OpenEPD conventions.
 */

/** Misaki custom tokens → canonical IPA (longer keys first). */
const MISAKI_TO_IPA = [
  ["ʤ", "dʒ"],
  ["ʧ", "tʃ"],
  ["A", "eɪ"],
  ["I", "aɪ"],
  ["W", "aʊ"],
  ["Y", "ɔɪ"],
  ["O", "oʊ"],
  ["ᵊ", "ə"],
  ["ᵻ", "ɪ"],
];

/** Multi-character IPA phones (longest first for tokenization). */
const IPA_MULTI = [
  "aɪ",
  "aʊ",
  "oʊ",
  "əʊ",
  "eɪ",
  "ɔɪ",
  "ɪə",
  "ʊə",
  "ɛə",
  "dʒ",
  "tʃ",
  "n̩",
  "l̩",
  "m̩",
  "ŋ̩",
  "ɹ̩",
  "r̩",
];

/** Reduced vowels — unmarked keys prefer a fuller nucleus when present. */
const IPA_REDUCED = new Set(["ə", "ɚ"]);

/** Syllabic consonants count as nuclei for syllables, not as rhyme anchors. */
const IPA_SYLLABIC = new Set(["n̩", "l̩", "m̩", "ŋ̩", "ɹ̩", "r̩"]);

const IPA_VOWELS = new Set([
  "ə",
  "i",
  "u",
  "ɑ",
  "ɔ",
  "ɛ",
  "ɜ",
  "ɪ",
  "ʊ",
  "ʌ",
  "æ",
  "ɚ",
  "ɝ",
  "aɪ",
  "aʊ",
  "oʊ",
  "əʊ",
  "eɪ",
  "ɔɪ",
  "ɪə",
  "ʊə",
  "ɛə",
  "a",
  "ɒ",
  // WikiPron broad often uses ASCII mid vowels / extra qualities.
  "e",
  "o",
  "ɐ",
  "ɨ",
  "ɘ",
  "ɵ",
  "ʉ",
  // Syllabic consonants (WikiPron).
  "n̩",
  "l̩",
  "m̩",
  "ŋ̩",
  "ɹ̩",
  "r̩",
]);

const ARPABET_VOWELS = {
  AA: "ɑ",
  AE: "æ",
  AH: "ʌ",
  AO: "ɔ",
  AW: "aʊ",
  AY: "aɪ",
  EH: "ɛ",
  ER: "ɝ",
  EY: "eɪ",
  IH: "ɪ",
  IY: "i",
  OW: "oʊ",
  OY: "ɔɪ",
  UH: "ʊ",
  UW: "u",
};

const ARPABET_CONSONANTS = {
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  F: "f",
  G: "ɡ",
  HH: "h",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  P: "p",
  R: "ɹ",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
};

const ARPABET_STRESS_RE = /^([A-Z]+)(\d?)$/;

/** Combining vertical line below — syllabic consonant mark (keep). */
const SYLLABIC_MARK = "\u0329";

/** Strip WikiPron narrow-IPA decoration (not syllabic mark). */
const WIKIPRON_STRIP_RE = /[\u0300-\u0328\u032a-\u036fː͜͡]/g;

/**
 * @param {string} ps
 * @returns {string}
 */
export function misakiToIpa(ps) {
  let out = ps;
  for (const [old, next] of MISAKI_TO_IPA) {
    out = out.replaceAll(old, next);
  }
  return out;
}

/**
 * @param {string[]} arpaTokens
 * @returns {string}
 */
export function arpabetToIpa(arpaTokens) {
  /** @type {string[]} */
  const out = [];
  for (const tok of arpaTokens) {
    const m = ARPABET_STRESS_RE.exec(tok);
    if (!m) continue;
    const phone = m[1];
    const stress = m[2] ?? "";
    if (phone in ARPABET_VOWELS) {
      let ipa;
      if (phone === "AH" && stress === "0") ipa = "ə";
      else if (phone === "ER" && stress === "0") ipa = "ɚ";
      else ipa = ARPABET_VOWELS[phone];
      if (stress === "1") out.push("ˈ");
      else if (stress === "2") out.push("ˌ");
      out.push(ipa);
    } else if (phone in ARPABET_CONSONANTS) {
      out.push(ARPABET_CONSONANTS[phone]);
    }
  }
  return out.join("");
}

/**
 * @param {string} phonesSpaceSeparated
 * @returns {string}
 */
export function wikipronToIpa(phonesSpaceSeparated) {
  let s = phonesSpaceSeparated.replace(/ /g, "").replaceAll("g", "ɡ");
  // Protect syllabic marks from the diacritic strip, then restore.
  /** @type {string[]} */
  const reserved = [];
  s = s.replace(
    new RegExp(`([nlmŋrɹ])${SYLLABIC_MARK}`, "g"),
    (full) => {
      reserved.push(full);
      return `\0${reserved.length - 1}\0`;
    },
  );
  s = s.replace(WIKIPRON_STRIP_RE, "");
  s = s.replace(/\0(\d+)\0/g, (_, idx) => reserved[Number(idx)] ?? "");
  return s;
}

/**
 * @param {string} ipa
 * @returns {string}
 */
function canonicalizeIpa(ipa) {
  let s = ipa.replaceAll("g", "ɡ");
  // Length marks must not participate in keys.
  s = s.replaceAll("ː", "");
  // Misaki uses ɜɹ/əɹ; CMU ER → ɝ/ɚ. Collapse to the compact rhotic vowels.
  s = s.replaceAll("ɜɹ", "ɝ");
  s = s.replaceAll("əɹ", "ɚ");
  // US flap is an allophone of /t/; keep rhyme identity with CMU t.
  s = s.replaceAll("ɾ", "t");
  // WikiPron / British GOAT → US oʊ.
  s = s.replaceAll("əʊ", "oʊ");
  // Misaki-style reduced markers that may appear outside misakiToIpa.
  s = s.replaceAll("ᵻ", "ɪ");
  s = s.replaceAll("ᵊ", "ə");
  return s;
}

/**
 * @param {string} ipa
 * @returns {{ phone: string, stress: 0 | 1 | 2, isVowel: boolean }[]}
 */
export function tokenizeIpa(ipa) {
  const text = canonicalizeIpa(ipa);
  /** @type {{ phone: string, stress: 0 | 1 | 2, isVowel: boolean }[]} */
  const phones = [];
  let pending = /** @type {0 | 1 | 2} */ (0);
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === "ˈ") {
      pending = 1;
      i += 1;
      continue;
    }
    if (ch === "ˌ") {
      pending = 2;
      i += 1;
      continue;
    }
    if (ch === " " || ch === "." || ch === "-") {
      i += 1;
      continue;
    }

    let matched = null;
    for (const multi of IPA_MULTI) {
      if (text.startsWith(multi, i)) {
        matched = multi;
        break;
      }
    }
    // Base + combining syllabic mark not listed as a multi (defensive).
    if (
      !matched &&
      ch &&
      "nlmŋrɹ".includes(ch) &&
      text[i + 1] === SYLLABIC_MARK
    ) {
      matched = `${ch}${SYLLABIC_MARK}`;
    }
    const phone = matched ?? ch;
    i += phone.length;

    const isVowel = IPA_VOWELS.has(phone);
    if (isVowel && pending) {
      phones.push({ phone, stress: pending, isVowel: true });
      pending = 0;
    } else {
      phones.push({ phone, stress: 0, isVowel });
    }
  }
  return phones;
}

/**
 * @param {{ phone: string, stress: 0 | 1 | 2, isVowel: boolean }[]} phones
 * @param {number} start
 * @returns {string | null}
 */
function keyFrom(phones, start) {
  if (start === -1) return null;
  return phones
    .slice(start)
    .map((p) => p.phone)
    .join("");
}

/**
 * Perfect-rhyme key: phones from the last primary-stressed vowel (else last
 * secondary) through the coda. Build-time only (packs store precomputed keys).
 *
 * @param {string} ipa
 * @returns {string | null}
 */
export function rhymeKeyFromIpa(ipa) {
  const phones = tokenizeIpa(ipa);
  let start = -1;
  for (let i = phones.length - 1; i >= 0; i -= 1) {
    if (phones[i].isVowel && phones[i].stress === 1) {
      start = i;
      break;
    }
  }
  if (start === -1) {
    for (let i = phones.length - 1; i >= 0; i -= 1) {
      if (phones[i].isVowel && phones[i].stress === 2) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) {
    // Unmarked (WikiPron): prefer last non-reduced oral nucleus so trailing
    // schwa / syllabic consonants do not own the key (banana → ænə, not ə).
    for (let i = phones.length - 1; i >= 0; i -= 1) {
      const p = phones[i];
      if (
        p.isVowel &&
        !IPA_REDUCED.has(p.phone) &&
        !IPA_SYLLABIC.has(p.phone)
      ) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) {
    for (let i = phones.length - 1; i >= 0; i -= 1) {
      if (phones[i].isVowel) {
        start = i;
        break;
      }
    }
  }
  return keyFrom(phones, start);
}

const IPA_CLOSING_DIPHTHONGS = new Set(["aɪ", "aʊ", "ɔɪ"]);

/**
 * End-rhyme / unstressed key: last vowel nucleus through the coda, ignoring
 * stress. Matches line-final identity (fun ↔ anyone).
 * For -ire sequences (aɪɚ / aɪə), keep the diphthong so fire ↛ butter.
 * Build-time only (packs store precomputed keys).
 *
 * @param {string} ipa
 * @returns {string | null}
 */
export function endRhymeKeyFromIpa(ipa) {
  const phones = tokenizeIpa(ipa);
  let lastV = -1;
  for (let i = phones.length - 1; i >= 0; i -= 1) {
    if (phones[i].isVowel) {
      lastV = i;
      break;
    }
  }
  if (lastV === -1) return null;
  const last = phones[lastV];
  let start = lastV;
  if (
    last &&
    IPA_REDUCED.has(last.phone) &&
    lastV > 0 &&
    phones[lastV - 1]?.isVowel &&
    IPA_CLOSING_DIPHTHONGS.has(phones[lastV - 1].phone)
  ) {
    start = lastV - 1;
  }
  const key = keyFrom(phones, start);
  // End rhyme ignores stress: NURSE (ɝ) and LETTER (ɚ) are the same coda.
  return key ? key.replaceAll("ɝ", "ɚ") : null;
}

/**
 * Syllable count = number of vowel nuclei in IPA.
 *
 * @param {string} ipa
 * @returns {number}
 */
export function syllableCountFromIpa(ipa) {
  let count = 0;
  for (const p of tokenizeIpa(ipa)) {
    if (p.isVowel) count += 1;
  }
  return count;
}

/**
 * Per-syllable stress codes from IPA (0 unstressed, 1 primary, 2 secondary).
 * Unmarked multi-syllable IPA gets primary on the last non-reduced oral
 * nucleus (aligned with rhymeKeyFromIpa). Secondary-only patterns promote
 * the last secondary to primary.
 *
 * @param {string} ipa
 * @returns {(0 | 1 | 2)[]}
 */
export function stressPatternFromIpa(ipa) {
  const phones = tokenizeIpa(ipa);
  /** @type {(0 | 1 | 2)[]} */
  const pattern = [];
  /** @type {number[]} phone index of each vowel nucleus */
  const vowelPhoneIdx = [];
  for (let i = 0; i < phones.length; i++) {
    if (phones[i].isVowel) {
      pattern.push(phones[i].stress);
      vowelPhoneIdx.push(i);
    }
  }
  if (pattern.length > 1 && pattern.every((s) => s === 0)) {
    // Match rhyme unmarked heuristic: last non-reduced oral nucleus.
    let primarySyl = -1;
    for (let s = pattern.length - 1; s >= 0; s -= 1) {
      const p = phones[vowelPhoneIdx[s]];
      if (
        p &&
        !IPA_REDUCED.has(p.phone) &&
        !IPA_SYLLABIC.has(p.phone)
      ) {
        primarySyl = s;
        break;
      }
    }
    if (primarySyl === -1) primarySyl = pattern.length - 1;
    pattern[primarySyl] = 1;
  } else if (pattern.length > 0 && !pattern.some((s) => s === 1)) {
    // Secondary-only: promote last secondary to primary.
    for (let s = pattern.length - 1; s >= 0; s -= 1) {
      if (pattern[s] === 2) {
        pattern[s] = 1;
        break;
      }
    }
  }
  return pattern;
}

/** Max syllables encodable in a packed u32 (2 bits each). */
export const STRESS_PACK_MAX_SYLLABLES = 16;

/**
 * Pack stress codes into a u32 (2 bits per syllable, low → high index).
 * Throws if the pattern exceeds {@link STRESS_PACK_MAX_SYLLABLES}.
 *
 * @param {readonly (0 | 1 | 2)[]} pattern
 * @returns {number}
 */
export function packStressPattern(pattern) {
  if (pattern.length > STRESS_PACK_MAX_SYLLABLES) {
    throw new Error(
      `stress pattern exceeds max syllables (${STRESS_PACK_MAX_SYLLABLES}): ${pattern.length}`,
    );
  }
  let packed = 0;
  for (let i = 0; i < pattern.length; i++) {
    const code = pattern[i] & 3;
    packed |= (code === 3 ? 0 : code) << (i * 2);
  }
  return packed >>> 0;
}

/**
 * Unpack a u32 stress pattern for `syllableCount` syllables.
 *
 * @param {number} packed
 * @param {number} syllableCount
 * @returns {(0 | 1 | 2)[]}
 */
export function unpackStressPattern(packed, syllableCount) {
  const n = Math.min(
    Math.max(0, syllableCount | 0),
    STRESS_PACK_MAX_SYLLABLES,
  );
  /** @type {(0 | 1 | 2)[]} */
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const code = (packed >>> (i * 2)) & 3;
    out[i] = /** @type {0 | 1 | 2} */ (code === 3 ? 0 : code);
  }
  return out;
}

/**
 * True when every nucleus is reduced or syllabic (weak-form reading).
 *
 * @param {string} ipa
 * @returns {boolean}
 */
export function isWeakIpa(ipa) {
  const vowels = tokenizeIpa(ipa).filter((p) => p.isVowel);
  return (
    vowels.length > 0 &&
    vowels.every(
      (p) => IPA_REDUCED.has(p.phone) || IPA_SYLLABIC.has(p.phone),
    )
  );
}

/**
 * True when a rhyme key is anchored on a reduced / syllabic nucleus only.
 *
 * @param {string} key
 * @returns {boolean}
 */
export function isReducedRhymeKey(key) {
  return (
    key.startsWith("ə") ||
    key.startsWith("ɚ") ||
    key.startsWith("n̩") ||
    key.startsWith("l̩") ||
    key.startsWith("m̩") ||
    key.startsWith("ŋ̩") ||
    key.startsWith("ɹ̩") ||
    key.startsWith("r̩")
  );
}
