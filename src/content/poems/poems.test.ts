import { describe, expect, it } from "vitest";

import {
  assertPoemRegistryInvariants,
  listPoemContents,
  listPoemPages,
  listSkippedCatalog,
  poemPath,
  poemWritePath,
  POEM_CATALOG,
} from "./index";
import type { PoemAnalysisContent, PoemBlock } from "./types";

const HTTPS = /^https:\/\//;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CITE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function walkBlocks(
  poem: PoemAnalysisContent,
  visit: (block: PoemBlock) => void,
): void {
  for (const block of poem.summary) visit(block);
  for (const block of poem.meaning) visit(block);
  for (const block of poem.formAndMeter) visit(block);
  for (const block of poem.historicalContext) visit(block);
  for (const theme of poem.themes) {
    for (const block of theme.blocks) visit(block);
  }
  for (const device of poem.literaryDevices) {
    for (const block of device.blocks) visit(block);
  }
}

function collectExcerpts(poem: PoemAnalysisContent): string[] {
  const lines: string[] = [];
  walkBlocks(poem, (block) => {
    if (block.type === "excerpt") lines.push(block.lines);
  });
  return lines;
}

function collectInlineCiteIds(poem: PoemAnalysisContent): Set<string> {
  const ids = new Set<string>();
  walkBlocks(poem, (block) => {
    if (block.type === "p" && block.cites) {
      for (const id of block.cites) ids.add(id);
    }
  });
  return ids;
}

describe("poem catalog", () => {
  it("has unique slugs and known copyright statuses", () => {
    const seen = new Set<string>();
    for (const entry of POEM_CATALOG) {
      expect(entry.slug).toMatch(SLUG);
      expect(seen.has(entry.slug)).toBe(false);
      seen.add(entry.slug);
      expect(["public-domain", "copyrighted-skip", "verify"]).toContain(
        entry.copyrightStatus,
      );
    }
    expect(POEM_CATALOG.length).toBeGreaterThanOrEqual(100);
  });

  it("skips known copyrighted poems", () => {
    const skipped = new Set(listSkippedCatalog().map((e) => e.slug));
    expect(skipped.has("do-not-go-gentle-into-that-good-night")).toBe(true);
    expect(skipped.has("the-more-loving-one")).toBe(true);
    expect(skipped.has("let-america-be-america-again")).toBe(true);
    expect(skipped.has("this-is-just-to-say")).toBe(true);
  });
});

describe("poem analysis registry", () => {
  it("obeys registry invariants", () => {
    expect(() => assertPoemRegistryInvariants()).not.toThrow();
  });

  it("keeps ready poems well-formed", () => {
    const problems: string[] = [];
    for (const poem of listPoemContents()) {
      const fail = (msg: string) => problems.push(`${poem.slug}: ${msg}`);
      if (!SLUG.test(poem.slug)) fail("bad slug");
      if (poemPath(poem.slug) !== `/poems/${poem.slug}`) fail("bad path");
      if (poem.status !== "ready") fail("not ready");
      if (!poem.poemTitle || !poem.author || !poem.publicDomainBasis) {
        fail("missing identity fields");
      }
      if (!poem.title.includes("lyriic")) fail("title missing lyriic");
      if (poem.description.length <= 40) fail("short description");
      if (!poem.h1 || !poem.intro) fail("missing h1/intro");
      if (!HTTPS.test(poem.fullTextSource.url)) fail("bad fullTextSource");
      if (
        !poem.summary.length ||
        !poem.meaning.length ||
        !poem.themes.length ||
        !poem.formAndMeter.length ||
        !poem.literaryDevices.length ||
        !poem.historicalContext.length
      ) {
        fail("empty analysis slot");
      }

      const citeIds = new Set(poem.citations.map((c) => c.id));
      if (poem.citations.length < 4) fail(`citations=${poem.citations.length}`);
      if (citeIds.size !== poem.citations.length) fail("duplicate citation ids");
      for (const cite of poem.citations) {
        if (!CITE_ID.test(cite.id) || !HTTPS.test(cite.url) || !cite.source.trim()) {
          fail(`bad citation ${cite.id}`);
        }
      }

      if (poem.criticalViews.length < 2) {
        fail(`criticalViews=${poem.criticalViews.length}`);
      }
      for (const view of poem.criticalViews) {
        const cite = poem.citations.find((c) => c.id === view.citeId);
        if (!cite?.quote?.trim()) fail(`critical ${view.citeId} missing quote`);
      }

      const excerpts = collectExcerpts(poem);
      if (excerpts.length < 3) fail(`excerpts=${excerpts.length}`);
      for (const excerptLines of excerpts) {
        const nonEmpty = excerptLines
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        if (nonEmpty.length < 1 || nonEmpty.length > 3) {
          fail(`excerpt lines=${nonEmpty.length}`);
        }
      }

      const inlineCites = collectInlineCiteIds(poem);
      if (inlineCites.size < 2) {
        fail(`inline cites=${inlineCites.size}`);
      }
      for (const id of inlineCites) {
        if (!citeIds.has(id)) fail(`unknown inline cite ${id}`);
      }

      if (poem.faqs.length < 3) fail(`faqs=${poem.faqs.length}`);
      if (!poem.cta) fail("missing cta");
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("composes /poems/{slug} paths and writePath", () => {
    for (const page of listPoemPages()) {
      expect(page.path).toBe(`/poems/${page.slug}`);
      expect(page.writePath).toBe(poemWritePath(page.editorSettings));
    }
  });
});
