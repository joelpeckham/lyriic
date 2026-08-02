import { describe, expect, it } from "vitest";

import { OG_IMAGE, ogImageForPath, ogImageTypeForUrl } from "./seo";

describe("ogImageForPath", () => {
  it("uses the home JPEG for / and unknown routes", () => {
    expect(ogImageForPath("/")).toBe(OG_IMAGE);
    expect(ogImageForPath("/faq")).toBe(OG_IMAGE);
    expect(ogImageForPath("/write/haiku")).toBe(OG_IMAGE);
  });

  it("maps tool slugs to per-page PNGs", () => {
    expect(ogImageForPath("/tools/haiku-checker")).toBe(
      "https://lyriic.com/og/haiku-checker.png",
    );
    expect(ogImageForPath("/tools/syllable-counter")).toBe(
      "https://lyriic.com/og/syllable-counter.png",
    );
  });
});

describe("ogImageTypeForUrl", () => {
  it("detects png vs jpeg", () => {
    expect(ogImageTypeForUrl("https://lyriic.com/og/home.png")).toBe(
      "image/png",
    );
    expect(ogImageTypeForUrl(OG_IMAGE)).toBe("image/jpeg");
  });
});
