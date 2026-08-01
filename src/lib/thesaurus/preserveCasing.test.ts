import { describe, expect, it } from "vitest";

import { preserveCasing } from "./preserveCasing";

describe("preserveCasing", () => {
  it("preserves lowercase", () => {
    expect(preserveCasing("fire", "flame")).toBe("flame");
  });

  it("preserves title case", () => {
    expect(preserveCasing("Fire", "flame")).toBe("Flame");
  });

  it("preserves all caps", () => {
    expect(preserveCasing("FIRE", "flame")).toBe("FLAME");
  });

  it("returns lowercase for non-plain replacements", () => {
    expect(preserveCasing("Fire", "well-known")).toBe("well-known");
  });
});
