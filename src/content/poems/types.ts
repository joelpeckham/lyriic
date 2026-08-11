import type { ToolFaq } from "@/content/formCheckers/types";
import { isMeterCatalogId } from "@/lib/meters/presets";
import { writerPath } from "@/lib/meters/seed";
import type { EditorSettings } from "@/lib/settings";

export type ContentStatus = "stub" | "ready";

export type PoemCopyrightStatus =
  | "public-domain"
  | "copyrighted-skip"
  | "verify";

/** Source list entry (scrape + screening). Not a rendered page by itself. */
export type PoemCatalogEntry = {
  slug: string;
  poemTitle: string;
  author: string;
  /** Approximate first publication year (US copyright screening). */
  yearPublished: number | null;
  copyrightStatus: PoemCopyrightStatus;
  /** Short note for agents (why skipped, translation caution, etc.). */
  notes?: string;
};

export type PoemCitation = {
  /** Stable kebab id, e.g. "poetry-foundation-mikics". */
  id: string;
  source: string;
  author?: string;
  url: string;
  /** Verified quote — required when featured in criticalViews. */
  quote?: string;
};

export type PoemParagraph = {
  type: "p";
  text: string;
  /** Citation ids rendered as superscripts after the paragraph. */
  cites?: string[];
};

export type PoemExcerpt = {
  type: "excerpt";
  /** 1–3 verse lines; blank lines only for stanza breaks. */
  lines: string;
};

export type PoemBlock = PoemParagraph | PoemExcerpt;

export type PoemTheme = {
  theme: string;
  blocks: PoemBlock[];
};

export type PoemLiteraryDevice = {
  device: string;
  blocks: PoemBlock[];
};

export type PoemCriticalView = {
  citeId: string;
};

/** Authorable per-poem SEO + analysis content. */
export type PoemAnalysisContent = {
  slug: string;
  status: ContentStatus;
  poemTitle: string;
  author: string;
  yearPublished: number;
  /** One-line justification that the text is public domain in the US. */
  publicDomainBasis: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Link to a public-domain full text (Wikisource, Gutenberg, etc.). */
  fullTextSource: {
    label: string;
    url: string;
    publisher?: string;
  };
  editorSettings: EditorSettings;
  summary: PoemBlock[];
  meaning: PoemBlock[];
  themes: PoemTheme[];
  formAndMeter: PoemBlock[];
  literaryDevices: PoemLiteraryDevice[];
  historicalContext: PoemBlock[];
  /** Primary evidence store — bibliography + inline cite targets. */
  citations: PoemCitation[];
  /** Featured pull-quotes; each citeId must resolve to a citation with quote. */
  criticalViews: PoemCriticalView[];
  faqs: ToolFaq[];
  cta: string;
};

/** Composed page model for PoemPage / SEO mirrors. */
export type ComposedPoemPage = PoemAnalysisContent & {
  path: string;
  writePath: string;
};

export function poemPath(slug: string): string {
  return `/poems/${slug}`;
}

export function poemWritePath(settings: EditorSettings): string {
  const meter = settings.meter;
  if (
    meter &&
    meter !== "none" &&
    meter !== "custom" &&
    isMeterCatalogId(meter)
  ) {
    return writerPath(meter);
  }
  return "/write";
}

export function composePoemPage(poem: PoemAnalysisContent): ComposedPoemPage {
  return {
    ...poem,
    path: poemPath(poem.slug),
    writePath: poemWritePath(poem.editorSettings),
  };
}

export type { ToolFaq };
