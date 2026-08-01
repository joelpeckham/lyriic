import { describe, expect, it } from "vitest";

import { lookupForms } from "./lookupForms";

describe("lookupForms", () => {
  it("includes the surface form first", () => {
    expect(lookupForms("remain")[0]).toBe("remain");
  });

  it("strips a simple -s plural / 3sg", () => {
    expect(lookupForms("remains")).toContain("remain");
    expect(lookupForms("stays")).toContain("stay");
  });

  it("handles -ies → y", () => {
    expect(lookupForms("bodies")).toContain("body");
  });

  it("handles -ing / -ed with silent-e restoration", () => {
    expect(lookupForms("writing")).toContain("write");
    expect(lookupForms("loved")).toContain("love");
  });
});
