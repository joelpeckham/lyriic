/**
 * Golden suite: every ready form checker’s sampleLines must score exact
 * under that meter once lexicon / stress / variants packs are loaded.
 */
import { describe, expect, it } from "vitest";

import { listFormCheckerContents } from "@/content/formCheckers";
import { buildMeteredLine } from "@/lib/meters/buildMeteredLine";
import {
  getMeterCatalogEntry,
  isStressAwareMeterConfig,
} from "@/lib/meters/presets";
import { countLine } from "@/lib/syllables/countLine";

describe("form checker sampleLines", () => {
  const ready = listFormCheckerContents().filter(
    (form) => form.status === "ready",
  );

  it("has ready forms to validate", () => {
    expect(ready.length).toBeGreaterThan(10);
  });

  for (const form of ready) {
    it(`${form.meterId} sampleLines are exact`, () => {
      const entry = getMeterCatalogEntry(form.meterId);
      expect(form.sampleLines.length).toBeGreaterThan(0);

      for (let i = 0; i < form.sampleLines.length; i++) {
        const line = form.sampleLines[i]!;
        if (!line.trim()) continue;
        const metered = buildMeteredLine(countLine(line), i, {
          pattern: entry.pattern,
          stressPatterns: entry.stressPatterns,
          footId: entry.footId,
        });
        expect(
          { meterId: form.meterId, line, status: metered.status },
          `${form.meterId} line ${i + 1}: ${line}`,
        ).toEqual({
          meterId: form.meterId,
          line,
          status: "exact",
        });
      }
    });
  }
});

describe("famous teaching lines", () => {
  it("accepts Blake catalexis, Hamlet feminine, and Pope compressions", () => {
    const cases = [
      {
        meterId: "trochaic-tetrameter",
        line: "Tyger Tyger, burning bright",
        fit: "catalexis" as const,
      },
      {
        meterId: "iambic-pentameter",
        line: "To be, or not to be, that is the question",
        fit: "feminine" as const,
      },
      {
        meterId: "heroic-couplet",
        line: "A little learning is a dangerous thing",
        fit: "ideal" as const,
      },
      {
        meterId: "heroic-couplet",
        line: "Drink deep, or taste not the Pierian spring",
        fit: "ideal" as const,
      },
    ];

    for (const { meterId, line, fit } of cases) {
      const entry = getMeterCatalogEntry(meterId);
      expect(isStressAwareMeterConfig(entry)).toBe(true);
      const metered = buildMeteredLine(countLine(line), 0, {
        pattern: entry.pattern,
        stressPatterns: entry.stressPatterns,
        footId: entry.footId,
      });
      expect({ line, status: metered.status, fit: metered.fit }).toEqual({
        line,
        status: "exact",
        fit,
      });
    }
  });

  it("still rejects hard polysyllable fights", () => {
    const entry = getMeterCatalogEntry("iambic-pentameter");
    const metered = buildMeteredLine(
      countLine("Banana banana banana banana ban"),
      0,
      {
        pattern: entry.pattern,
        stressPatterns: entry.stressPatterns,
        footId: entry.footId,
      },
    );
    expect(metered.status).not.toBe("exact");
  });
});
