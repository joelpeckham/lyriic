/**
 * Digraph pack key for a normalized lemma (mirrors build-time sharding).
 * One-letter / non-letter second char → `{letter}_`; non a–z start → `_`.
 */
export function definitionPairKey(lemma: string): string {
  const a = lemma[0];
  if (!a || a < "a" || a > "z") return "_";
  const b = lemma[1];
  if (!b || b < "a" || b > "z") return `${a}_`;
  return `${a}${b}`;
}
