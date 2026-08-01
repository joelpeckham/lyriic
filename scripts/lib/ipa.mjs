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
const IPA_MULTI = ["aɪ", "aʊ", "oʊ", "eɪ", "ɔɪ", "dʒ", "tʃ"];

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
  "eɪ",
  "ɔɪ",
  "a",
  "ɒ",
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

/** Strip WikiPron narrow-IPA decoration. */
const WIKIPRON_STRIP_RE = /[\u0300-\u036fː͜͡]/g;

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
  return phonesSpaceSeparated.replace(/ /g, "").replace(WIKIPRON_STRIP_RE, "");
}

/**
 * @param {string} ipa
 * @returns {{ phone: string, stress: 0 | 1 | 2, isVowel: boolean }[]}
 */
export function tokenizeIpa(ipa) {
  /** @type {{ phone: string, stress: 0 | 1 | 2, isVowel: boolean }[]} */
  const phones = [];
  let pending = /** @type {0 | 1 | 2} */ (0);
  let i = 0;
  while (i < ipa.length) {
    const ch = ipa[i];
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
      if (ipa.startsWith(multi, i)) {
        matched = multi;
        break;
      }
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
 * Perfect-rhyme key: phones from the last primary-stressed vowel (else last
 * secondary) through the coda. Mirrored in src/lib/rhyme/rhymeKey.ts.
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
    // Unmarked transcriptions (some WikiPron): use last vowel nucleus.
    for (let i = phones.length - 1; i >= 0; i -= 1) {
      if (phones[i].isVowel) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) return null;
  return phones
    .slice(start)
    .map((p) => p.phone)
    .join("");
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
