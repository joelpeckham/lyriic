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
  it("maps meter status, text presence, and slim tokens for rulers", () => {
    const lines = toOverlayLines(
      [
        metered({
          total: 5,
          target: 5,
          status: "exact",
          tokens: [
            {
              raw: "hello",
              word: "hello",
              start: 0,
              end: 5,
              syllables: 2,
              syllableStart: 0,
              syllableEnd: 2,
              source: "dict",
            },
          ],
          boundaries: [0, 2],
        }),
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
        tokens: [
          {
            start: 0,
            end: 5,
            syllables: 2,
            syllableStart: 0,
            syllableEnd: 2,
          },
        ],
      },
      {
        total: 0,
        target: null,
        status: "none",
        lineHasText: false,
        tokens: [],
      },
      {
        total: 8,
        target: 7,
        status: "over",
        lineHasText: true,
        tokens: [],
      },
    ]);
  });
});
