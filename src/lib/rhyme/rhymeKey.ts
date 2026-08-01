/**
 * Perfect-rhyme key from IPA (last primary-stressed vowel, else last
 * secondary, else last vowel). Mirrored in scripts/lib/ipa.mjs — keep in sync.
 */

const IPA_MULTI = ["aɪ", "aʊ", "oʊ", "eɪ", "ɔɪ", "dʒ", "tʃ"] as const;

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

type IpaPhone = { phone: string; stress: 0 | 1 | 2; isVowel: boolean };

function tokenizeIpa(ipa: string): IpaPhone[] {
  const phones: IpaPhone[] = [];
  let pending: 0 | 1 | 2 = 0;
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

    let matched: string | null = null;
    for (const multi of IPA_MULTI) {
      if (ipa.startsWith(multi, i)) {
        matched = multi;
        break;
      }
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
      if (phones[i]?.isVowel) {
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
