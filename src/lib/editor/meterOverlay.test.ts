import { describe, expect, it } from "vitest";

import { toOverlayLines } from "./meterOverlay";
import type { MeteredLine } from "@/lib/meters";

function metered(
  partial: Partial<MeteredLine> & Pick<MeteredLine, "total" | "status">,
): MeteredLine {
  return {
    target: null,
    tokens: [],
    boundaries: [0],
    ...partial,
  };
}

describe("toOverlayLines", () => {
  it("maps meter status and whether the line has text", () => {
    const lines = toOverlayLines(
      [
        metered({ total: 5, target: 5, status: "exact" }),
        metered({ total: 0, status: "none" }),
        metered({ total: 8, target: 7, status: "over" }),
      ],
      ["hello", "", "too many words here"],
    );

    expect(lines).toEqual([
      {
        total: 5,
        target: 5,
        status: "exact",
        lineHasText: true,
      },
      {
        total: 0,
        target: null,
        status: "none",
        lineHasText: false,
      },
      {
        total: 8,
        target: 7,
        status: "over",
        lineHasText: true,
      },
    ]);
  });
});
