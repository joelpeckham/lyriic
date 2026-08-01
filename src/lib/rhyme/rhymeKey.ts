/**
 * Perfect-rhyme key from ARPAbet phones (last primary stress, else last
 * secondary). Mirrored in scripts/build-rhyme-index.mjs — keep in sync.
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
