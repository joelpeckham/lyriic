import { describe, expect, it } from "vitest";

import {
  formatActiveMeterChip,
  formatCustomPatternDashes,
} from "./chipLabel";

describe("formatCustomPatternDashes", () => {
  it("joins with en-dashes", () => {
    expect(formatCustomPatternDashes([5, 7, 5])).toBe("5–7–5");
  });

  it("defaults empty pattern to 8", () => {
    expect(formatCustomPatternDashes([])).toBe("8");
  });
});

describe("formatActiveMeterChip", () => {
  it("labels free verse for none", () => {
    const chip = formatActiveMeterChip("none", [8], 0);
    expect(chip.label).toBe("Free verse");
    expect(chip.ariaLabel).toContain("Free verse");
  });

  it("shows custom cycle", () => {
    const chip = formatActiveMeterChip("custom", [5, 7, 5], 2);
    expect(chip.label).toBe("Custom · 5–7–5");
  });

  it("keeps form name with N/M progress for closed forms", () => {
    const chip = formatActiveMeterChip("haiku", [8], 2);
    expect(chip.label).toBe("Haiku · 2/3");
    expect(chip.ariaLabel).toContain("Haiku");
    expect(chip.ariaLabel).toContain("line 2 of 3");
  });

  it("uses catalog label when no written lines or unbounded form", () => {
    expect(formatActiveMeterChip("haiku", [8], 0).label).toBe("Haiku");
    expect(formatActiveMeterChip("iambic-pentameter", [8], 3).label).toBe(
      "Iambic pentameter",
    );
  });
});
