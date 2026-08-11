import type { ToolFaq } from "@/content/formCheckers/types";
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

export type PoemSourceLink = {
  label: string;
  url: string;
  publisher?: string;
};

export type PoemTheme = {
  theme: string;
  discussion: string;
};

export type PoemLiteraryDevice = {
  device: string;
  example?: string;
  discussion: string;
};

export type PoemCriticalView = {
  source: string;
  author?: string;
  quote: string;
  url: string;
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
  /** Full poem or excerpt shown in the embedded editor. */
  text: string;
  isExcerpt?: boolean;
  excerptNote?: string;
  fullTextSource: PoemSourceLink;
  editorSettings: EditorSettings;
  summary: string[];
  meaning: string[];
  themes: PoemTheme[];
  formAndMeter: string[];
  literaryDevices: PoemLiteraryDevice[];
  historicalContext: string[];
  criticalViews: PoemCriticalView[];
  faqs: ToolFaq[];
  sources: PoemSourceLink[];
  cta: string;
};

/** Composed page model for PoemPage / SEO mirrors. */
export type ComposedPoemPage = PoemAnalysisContent & {
  path: string;
};

export function poemPath(slug: string): string {
  return `/poems/${slug}`;
}

export function composePoemPage(poem: PoemAnalysisContent): ComposedPoemPage {
  return {
    ...poem,
    path: poemPath(poem.slug),
  };
}

export type { ToolFaq };
