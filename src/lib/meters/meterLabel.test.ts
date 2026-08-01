import { describe, expect, it } from "vitest";
import { formatMeterLabel } from "./meterLabel";

describe("formatMeterLabel", () => {
  it("labels empty lines", () => {
    expect(formatMeterLabel(0, 5, "none", false)).toBe("Empty line");
  });

  it("omits target when pattern has none", () => {
    expect(formatMeterLabel(3, null, "none", true)).toBe("3 syllables");
  });

  it("phrases on / under / over meter", () => {
    expect(formatMeterLabel(5, 5, "exact", true)).toBe(
      "5 of 5 syllables, on meter",
    );
    expect(formatMeterLabel(4, 5, "under", true)).toBe(
      "4 of 5 syllables, under target",
    );
    expect(formatMeterLabel(6, 5, "over", true)).toBe(
      "6 of 5 syllables, over target",
    );
  });
});
