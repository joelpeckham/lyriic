import { describe, expect, it } from "vitest";

import { formatMeterLabel } from "./meterLabel";

describe("formatMeterLabel", () => {
  it("describes stress mismatch separately from over/under", () => {
    expect(formatMeterLabel(10, 10, "exact", true)).toBe(
      "10 of 10 syllables, on meter",
    );
    expect(formatMeterLabel(10, 10, "stress", true)).toBe(
      "10 of 10 syllables, stress off meter",
    );
  });
});
