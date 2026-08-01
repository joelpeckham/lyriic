import { describe, expect, it } from "vitest";

import {
  assertFormCheckerCoverage,
  formCheckerSlug,
  listComposedFormToolPages,
  listFormCheckerContents,
} from "./index";
import {
  formCheckerLineCount,
  listFormCheckerMeters,
  stressExplainerIdForEntry,
} from "@/lib/meters/presets";

describe("form checkers registry", () => {
  it("covers every catalog form-checker meter", () => {
    expect(() => assertFormCheckerCoverage()).not.toThrow();
    expect(listFormCheckerContents()).toHaveLength(
      listFormCheckerMeters().length,
    );
  });

  it("uses {meterId}-checker slugs and writable paths", () => {
    for (const page of listComposedFormToolPages()) {
      expect(page.slug).toBe(formCheckerSlug(page.meterId));
      expect(page.path).toBe(`/tools/${page.slug}`);
      expect(page.writePath).toBe(`/write/${page.meterId}`);
      expect(page.sampleLines.length).toBe(
        formCheckerLineCount(
          listFormCheckerMeters().find((e) => e.id === page.meterId)!,
        ),
      );
    }
  });

  it("wires stress explainers for stress-aware meters", () => {
    for (const entry of listFormCheckerMeters()) {
      const stressId = stressExplainerIdForEntry(entry);
      const page = listComposedFormToolPages().find(
        (p) => p.meterId === entry.id,
      );
      expect(page).toBeDefined();
      if (stressId) {
        expect(page!.stressExplainer?.id).toBe(stressId);
        expect(page!.footExplainer).not.toBeNull();
      } else {
        expect(page!.stressExplainer).toBeNull();
        expect(page!.footExplainer).toBeNull();
      }
    }
  });

  it("keeps all form content ready with history and samples", () => {
    for (const form of listFormCheckerContents()) {
      expect(form.status).toBe("ready");
      expect(form.history.length).toBeGreaterThan(0);
      expect(form.faqs.length).toBeGreaterThanOrEqual(3);
      expect(form.sampleLines.length).toBeGreaterThan(0);
    }
  });
});
