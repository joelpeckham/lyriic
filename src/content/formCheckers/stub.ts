import {
  formCheckerLineCount,
  getMeterCatalogEntry,
  stressExplainerIdForEntry,
  type MeterCatalogEntry,
} from "@/lib/meters/presets";
import { writerPath } from "@/lib/meters/seed";

import type { FormCheckerContent } from "./types";

function formatPattern(pattern: readonly number[]): string {
  return pattern.join("-");
}

function formatPatternDots(pattern: readonly number[]): string {
  return pattern.join(" · ");
}

/** Generate stub FormCheckerContent from a catalog entry. */
export function stubFormCheckerContent(
  entry: MeterCatalogEntry,
): FormCheckerContent {
  const patternLabel = formatPatternDots(entry.pattern);
  const lineCount = formCheckerLineCount(entry);
  const stressId = stressExplainerIdForEntry(entry);

  return {
    meterId: entry.id,
    status: "stub",
    title: `${entry.label} Checker — lyriic`,
    description: `Check a ${entry.label.toLowerCase()} draft against ${patternLabel} with live syllable${entry.footId ? " and stress" : ""} feedback. Free, private, and dictionary-based — then keep writing in lyriic’s zen editor.`,
    h1: `${entry.label} checker`,
    intro: `Shape a draft against ${patternLabel}. Same syllable${entry.footId ? " and stress" : ""} engine as the lyriic poetry editor — private in your browser.`,
    history: [
      `Stub history for ${entry.label}. Replace with a short, sourced overview of the form’s origins and teaching tradition.`,
    ],
    famousPoems: [],
    formNotes: [
      entry.footId
        ? `lyriic checks syllable targets and the ${entry.footId} stress contour. Rhyme schemes and theme rules are not enforced.`
        : `lyriic checks syllable targets for this form. Rhyme schemes and theme rules are not enforced.`,
    ],
    faqs: [
      {
        q: `What pattern does this ${entry.label.toLowerCase()} checker use?`,
        plain: `${entry.label} targets ${patternLabel} syllables per line in cycle order${entry.stanzaLines ? ` across ${entry.stanzaLines} lines` : ""}. ${entry.description}.`,
      },
      {
        q: "Is my draft uploaded?",
        plain:
          "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
      },
      {
        q: "Can I keep writing with this meter?",
        plain: `Yes. Open the zen editor, or jump straight to the ${entry.label} writer at ${writerPath(entry.id)} for live rulers beside each line.`,
      },
    ],
    sampleLines: Array.from({ length: lineCount }, () => ""),
    cta: "Write in the zen editor",
    meterExplainerId: entry.id,
    footExplainerId: entry.footId,
    stressExplainerId: stressId ?? undefined,
  };
}

export function stubFormCheckerContentById(meterId: string): FormCheckerContent {
  return stubFormCheckerContent(getMeterCatalogEntry(meterId));
}

export function patternDisplay(pattern: readonly number[]): string {
  return formatPattern(pattern);
}
