/**
 * Perfect-rhyme key from IPA (last primary-stressed vowel, else last
 * secondary, else last non-reduced vowel). Mirrored in scripts/lib/ipa.mjs —
 * keep in sync.
 */

const IPA_MULTI = [
  "aɪ",
  "aʊ",
  "oʊ",
  "eɪ",
  "ɔɪ",
  "dʒ",
  "tʃ",
  "n̩",
  "l̩",
  "m̩",
  "ŋ̩",
  "ɹ̩",
  "r̩",
] as const;

const IPA_REDUCED = new Set(["ə", "ɚ"]);

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
  "eɪ",
  "ɔɪ",
  "a",
  "ɒ",
  "e",
  "o",
  "n̩",
  "l̩",
  "m̩",
  "ŋ̩",
  "ɹ̩",
  "r̩",
]);

const SYLLABIC_MARK = "\u0329";

type IpaPhone = { phone: string; stress: 0 | 1 | 2; isVowel: boolean };

function canonicalizeIpa(ipa: string): string {
  return ipa.replaceAll("g", "ɡ");
}

function tokenizeIpa(ipa: string): IpaPhone[] {
  const text = canonicalizeIpa(ipa);
  const phones: IpaPhone[] = [];
  let pending: 0 | 1 | 2 = 0;
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

    let matched: string | null = null;
    for (const multi of IPA_MULTI) {
      if (text.startsWith(multi, i)) {
        matched = multi;
        break;
      }
    }
    if (
      !matched &&
      ch &&
      "nlmŋrɹ".includes(ch) &&
      text[i + 1] === SYLLABIC_MARK
    ) {
      matched = `${ch}${SYLLABIC_MARK}`;
    }
    const phone = matched ?? ch ?? "";
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

function keyFrom(phones: IpaPhone[], start: number): string | null {
  if (start === -1) return null;
  return phones
    .slice(start)
    .map((p) => p.phone)
    .join("");
}

/** Perfect-rhyme key from a stress-marked IPA string. */
export function rhymeKeyFromIpa(ipa: string): string | null {
  const phones = tokenizeIpa(ipa);
  let start = -1;
  for (let i = phones.length - 1; i >= 0; i -= 1) {
    const p = phones[i];
    if (p?.isVowel && p.stress === 1) {
      start = i;
      break;
    }
  }
  if (start === -1) {
    for (let i = phones.length - 1; i >= 0; i -= 1) {
      const p = phones[i];
      if (p?.isVowel && p.stress === 2) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) {
    for (let i = phones.length - 1; i >= 0; i -= 1) {
      const p = phones[i];
      if (
        p?.isVowel &&
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
      if (phones[i]?.isVowel) {
        start = i;
        break;
      }
    }
  }
  return keyFrom(phones, start);
}

/**
 * End-rhyme / unstressed key: last vowel nucleus through the coda, ignoring
 * stress (fun ↔ anyone). Mirrored in scripts/lib/ipa.mjs.
 */
export function endRhymeKeyFromIpa(ipa: string): string | null {
  const phones = tokenizeIpa(ipa);
  for (let i = phones.length - 1; i >= 0; i -= 1) {
    if (phones[i]?.isVowel) return keyFrom(phones, i);
  }
  return null;
}

/**
 * @deprecated Prefer {@link rhymeKeyFromIpa}. Kept for ARPAbet unit tests during
 * migration; converts stress digits on vowel phones.
 */
export function rhymeKeyFromPhones(phones: readonly string[]): string | null {
  let start = -1;
  for (let i = phones.length - 1; i >= 0; i -= 1) {
    const phone = phones[i];
    if (phone !== undefined && /\d$/.test(phone) && phone.endsWith("1")) {
      start = i;
      break;
    }
  }
  if (start === -1) {
    for (let i = phones.length - 1; i >= 0; i -= 1) {
      const phone = phones[i];
      if (phone !== undefined && /\d$/.test(phone) && phone.endsWith("2")) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) return null;
  return phones.slice(start).join(" ");
}
