import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { WriteSeoPage } from "@/components/pages/WriteSeoPage";
import { WriterSeoPage } from "@/components/pages/WriterSeoPage";
import { writerDocumentMeta } from "@/lib/meters/seed";
import { WRITE_DESCRIPTION, WRITE_TITLE, absoluteUrl } from "@/lib/seo";

import { metaForRoute, render } from "./render";

describe("metaForRoute", () => {
  it("maps bare /write to editor meta with /write path", () => {
    expect(metaForRoute("/write")).toEqual({
      title: WRITE_TITLE,
      description: WRITE_DESCRIPTION,
      path: "/write",
    });
  });
});

describe("render write shells", () => {
  it("prerenders /write as an seo-shell without About landing copy", () => {
    const result = render("/write");
    expect(result.path).toBe("/write");
    expect(result.canonical).toBe(absoluteUrl("/write"));
    expect(result.title).toBe(WRITE_TITLE);
    expect(result.description).toBe(WRITE_DESCRIPTION);
    expect(result.html).toContain("seo-shell");
    expect(result.html).toContain("lyriic editor");
    expect(result.html).not.toContain("Why I built it");
    expect(result.html).not.toContain("A failed poem");
  });

  it("prerenders /write/:slug with seo-shell and writer meta", () => {
    const meta = writerDocumentMeta("haiku");
    expect(meta).not.toBeNull();
    const result = render("/write/haiku");
    expect(result.path).toBe(meta!.path);
    expect(result.canonical).toBe(absoluteUrl(meta!.path));
    expect(result.title).toBe(meta!.title);
    expect(result.html).toContain("seo-shell");
    expect(result.html).toContain("Haiku");
    expect(result.html).toContain("writer");
  });
});

describe("write SEO page markup", () => {
  it("WriteSeoPage root is seo-shell", () => {
    const html = renderToStaticMarkup(<WriteSeoPage />);
    expect(html).toMatch(/^<article class="seo-shell"/);
  });

  it("WriterSeoPage root includes seo-shell", () => {
    const html = renderToStaticMarkup(<WriterSeoPage slug="haiku" />);
    expect(html).toContain('class="seo-shell');
  });
});
