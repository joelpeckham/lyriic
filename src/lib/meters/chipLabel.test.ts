import { describe, expect, it } from "vitest";

import {
  formatActiveMeterChip,
  formatCustomPatternDashes,
} from "./chipLabel";

describe("formatCustomPatternDashes", () => {
  it("joins with en-dashes", () => {
    expect(formatCustomPatternDashes([5, 7, 5])).toBe("5–7–5");
    expect(formatCustomPatternDashes([])).toBe("8");
  });
});

describe("formatActiveMeterChip", () => {
  it("labels custom meters with the pattern", () => {
    expect(formatActiveMeterChip("custom", [5, 7, 5], 0).label).toBe(
      "Custom · 5–7–5",
    );
  });

  it("uses line progress for stanza forms instead of a grade fraction", () => {
    expect(formatActiveMeterChip("sonnet", [], 20).label).toBe(
      "line 20 · 14-line form",
    );
    expect(formatActiveMeterChip("sonnet", [], 8).label).toBe(
      "line 8 · 14-line form",
    );
    expect(formatActiveMeterChip("sonnet", [], 0).label).toBe(
      "Sonnet (iambic pentameter)",
    );
  });

  it("keeps catalog labels when there is no stanza length", () => {
    expect(formatActiveMeterChip("blank-verse", [], 2).label).toBe(
      "Blank verse",
    );
  });
});
