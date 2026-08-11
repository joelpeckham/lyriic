import type { PoemExcerpt, PoemParagraph } from "./types";

/** Paragraph block with optional inline citation ids. */
export function p(text: string, cites?: string[]): PoemParagraph {
  return cites?.length ? { type: "p", text, cites } : { type: "p", text };
}

/** Read-only editor excerpt (1–3 verse lines). */
export function excerpt(lines: string): PoemExcerpt {
  return { type: "excerpt", lines };
}
