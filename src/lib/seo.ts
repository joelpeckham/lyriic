export const SITE_URL = "https://lyriic.com";

export const SITE_TITLE =
  "lyriic — zen poetry & lyric editor with syllable counts";

export const SITE_DESCRIPTION =
  "Free local-first poetry and lyric editor with per-line syllable counts, meter rulers for haiku and iambic verse, plus quiet rhyme and synonym helpers — all in your browser.";

export const OG_IMAGE = `${SITE_URL}/og.jpg`;

export const SITE_FEATURE_LIST = [
  "Per-line syllable counts from a fused US pronunciation dictionary",
  "Optional meter rulers for haiku, iambic pentameter, and common meter",
  "Hover or tap a word for rhyme and synonym helpers",
  "Local-first drafts with no account or cloud sync",
  "Works offline after assets load",
] as const;

export const SITE_KNOWS_ABOUT = [
  "poetry",
  "lyrics",
  "meter",
  "syllables",
  "haiku",
  "rhyme",
  "songwriting",
] as const;

export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
