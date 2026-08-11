import type { PoemLine } from "@/components/editor/PoemLines";
import { listComposedFormToolPages } from "@/content/formCheckers";
import { listPoemPages } from "@/content/poems";
import { getToolBySlug } from "@/content/tools";
import { isStressAwareMeter } from "@/lib/meters";

export type OgSpec = {
  /** Filename stem under /og/ (also data-og-id). */
  id: string;
  /** App path this image belongs to (`/` for home). */
  path: string;
  lines: readonly PoemLine[];
  cta: string;
};

function shortenCta(cta: string): string {
  return cta.length > 36 ? "Continue in the editor" : cta;
}

function twoLines(headline: string, support: string): PoemLine[] {
  return [{ text: headline }, { text: support }];
}

/** Title-case catalog label + "checker" (e.g. Blank Verse checker). */
function formHeadline(label: string, h1: string): string {
  const titled = label.replace(/\b[a-z]/g, (ch) => ch.toUpperCase());
  const candidate = `${titled} checker`;
  return candidate.length <= 36 ? candidate : h1;
}

function formSupport(meterId: string): string {
  return isStressAwareMeter(meterId)
    ? "check rhyme and meter and stress"
    : "check syllables against the form";
}

const HOME_SPEC: OgSpec = {
  id: "home",
  path: "/",
  lines: twoLines(
    "Zen poetry editor",
    "write with syllables meter and stress",
  ),
  cta: "Start writing",
};

function utilitySpecs(): OgSpec[] {
  const syllable = getToolBySlug("syllable-counter");
  const rhymeFinder = getToolBySlug("rhyme-finder");
  const rhymeChecker = getToolBySlug("rhyme-checker");
  if (!syllable || !rhymeFinder || !rhymeChecker) {
    throw new Error("Missing utility tool content for OG specs");
  }

  return [
    {
      id: syllable.slug,
      path: syllable.path,
      lines: twoLines(syllable.h1, "count every beat as you write"),
      cta: syllable.cta,
    },
    {
      id: rhymeFinder.slug,
      path: rhymeFinder.path,
      lines: twoLines(rhymeFinder.h1, "find rhymes that keep the meter"),
      cta: shortenCta(rhymeFinder.cta),
    },
    {
      id: rhymeChecker.slug,
      path: rhymeChecker.path,
      lines: twoLines(rhymeChecker.h1, "check if two words rhyme"),
      cta: shortenCta(rhymeChecker.cta),
    },
  ];
}

function formCheckerSpecs(): OgSpec[] {
  return listComposedFormToolPages().map((page) => ({
    id: page.slug,
    path: page.path,
    lines: twoLines(formHeadline(page.label, page.h1), formSupport(page.meterId)),
    cta: shortenCta(page.cta),
  }));
}

function poemAnalysisSpecs(): OgSpec[] {
  return listPoemPages().map((page) => {
    const title =
      page.poemTitle.length <= 36 ? page.poemTitle : page.h1.slice(0, 36);
    return {
      id: page.slug,
      path: page.path,
      lines: twoLines(title, `${page.author} — analysis & meaning`),
      cta: shortenCta(page.cta),
    };
  });
}

/** All OG cards: home, utility tools, form checkers, poem analyses. */
export function listOgSpecs(): OgSpec[] {
  return [
    HOME_SPEC,
    ...utilitySpecs(),
    ...formCheckerSpecs(),
    ...poemAnalysisSpecs(),
  ];
}

export function getOgSpecByPath(path: string): OgSpec | undefined {
  const normalized = path === "" ? "/" : path;
  return listOgSpecs().find((spec) => spec.path === normalized);
}

export function getOgSpecById(id: string): OgSpec | undefined {
  return listOgSpecs().find((spec) => spec.id === id);
}
