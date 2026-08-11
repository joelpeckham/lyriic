import { describe, expect, it } from "vitest";

import {
  assertPoemRegistryInvariants,
  listPoemContents,
  listPoemPages,
  listSkippedCatalog,
  poemPath,
  POEM_CATALOG,
} from "./index";

const HTTPS = /^https:\/\//;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
    for (const poem of listPoemContents()) {
      expect(poem.slug).toMatch(SLUG);
      expect(poemPath(poem.slug)).toBe(`/poems/${poem.slug}`);
      expect(poem.status).toBe("ready");
      expect(poem.poemTitle.length).toBeGreaterThan(0);
      expect(poem.author.length).toBeGreaterThan(0);
      expect(poem.publicDomainBasis.length).toBeGreaterThan(0);
      expect(poem.title).toContain("lyriic");
      expect(poem.description.length).toBeGreaterThan(40);
      expect(poem.h1.length).toBeGreaterThan(0);
      expect(poem.intro.length).toBeGreaterThan(0);
      expect(poem.text.trim().length).toBeGreaterThan(0);
      expect(poem.fullTextSource.url).toMatch(HTTPS);
      expect(poem.summary.length).toBeGreaterThan(0);
      expect(poem.meaning.length).toBeGreaterThan(0);
      expect(poem.themes.length).toBeGreaterThan(0);
      expect(poem.formAndMeter.length).toBeGreaterThan(0);
      expect(poem.literaryDevices.length).toBeGreaterThan(0);
      expect(poem.historicalContext.length).toBeGreaterThan(0);
      expect(poem.criticalViews.length).toBeGreaterThanOrEqual(2);
      for (const view of poem.criticalViews) {
        expect(view.url).toMatch(HTTPS);
        expect(view.quote.trim().length).toBeGreaterThan(0);
        expect(view.source.trim().length).toBeGreaterThan(0);
      }
      expect(poem.faqs.length).toBeGreaterThanOrEqual(3);
      expect(poem.sources.length).toBeGreaterThanOrEqual(2);
      for (const source of poem.sources) {
        expect(source.url).toMatch(HTTPS);
      }
      if (poem.isExcerpt) {
        expect(poem.excerptNote?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it("composes /poems/{slug} paths", () => {
    for (const page of listPoemPages()) {
      expect(page.path).toBe(`/poems/${page.slug}`);
    }
  });
});
