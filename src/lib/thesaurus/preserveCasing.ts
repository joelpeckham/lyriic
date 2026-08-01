/**
 * Apply the casing pattern of `raw` onto `replacement` when both are
 * plain letter/apostrophe words. Otherwise return lowercase replacement.
 */
export function preserveCasing(raw: string, replacement: string): string {
  const candidate = replacement.toLowerCase();
  if (!isPlainWord(raw) || !isPlainWord(candidate)) {
    return candidate;
  }

  if (raw === raw.toUpperCase() && /[A-Za-z]/.test(raw)) {
    return candidate.toUpperCase();
  }

  if (isTitleCase(raw)) {
    return candidate.charAt(0).toUpperCase() + candidate.slice(1);
  }

  return candidate;
}

function isPlainWord(value: string): boolean {
  return /^[A-Za-z']+$/.test(value);
}

function isTitleCase(value: string): boolean {
  if (value.length === 0) return false;
  const first = value.charAt(0);
  if (first !== first.toUpperCase() || first === first.toLowerCase()) {
    return false;
  }
  const rest = value.slice(1);
  return rest === rest.toLowerCase();
}
