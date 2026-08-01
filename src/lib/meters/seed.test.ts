import { describe, expect, it } from "vitest";

import {
  isReusableEmptyDraft,
  parseMeterSeed,
  settingsFromMeterSeed,
  writerDocumentMeta,
} from "./seed";
import { DEFAULT_SETTINGS } from "@/lib/settings";

describe("parseMeterSeed", () => {
  it("reads meter from slug", () => {
    const seed = parseMeterSeed("haiku", new URLSearchParams());
    expect(seed).toEqual({ meterId: "haiku", overlays: {} });
  });

  it("reads meter from query when slug is absent", () => {
    const seed = parseMeterSeed(
      undefined,
      new URLSearchParams("meter=sonnet&stress=1"),
    );
    expect(seed?.meterId).toBe("sonnet");
    expect(seed?.overlays.showStress).toBe(true);
  });

  it("prefers slug over query meter id", () => {
    const seed = parseMeterSeed(
      "tanka",
      new URLSearchParams("meter=haiku&rulers=0"),
    );
    expect(seed?.meterId).toBe("tanka");
    expect(seed?.overlays.showRulers).toBe(false);
  });

  it("rejects custom and unknown meters", () => {
    expect(parseMeterSeed("custom", new URLSearchParams())).toBeNull();
    expect(parseMeterSeed("zzz", new URLSearchParams())).toBeNull();
  });
});

describe("settingsFromMeterSeed", () => {
  it("applies overlay overrides on top of defaults", () => {
    const settings = settingsFromMeterSeed({
      meterId: "haiku",
      overlays: { showStress: true, showRulers: false },
    });
    expect(settings?.meter).toBe("haiku");
    expect(settings?.showStress).toBe(true);
    expect(settings?.showRulers).toBe(false);
  });
});

describe("isReusableEmptyDraft", () => {
  it("only reuses empty default-meter drafts", () => {
    expect(
      isReusableEmptyDraft({ text: "", settings: DEFAULT_SETTINGS }),
    ).toBe(true);
    expect(
      isReusableEmptyDraft({
        text: "hi",
        settings: DEFAULT_SETTINGS,
      }),
    ).toBe(false);
    expect(
      isReusableEmptyDraft({
        text: "",
        settings: { ...DEFAULT_SETTINGS, meter: "haiku" },
      }),
    ).toBe(false);
  });
});

describe("writerDocumentMeta", () => {
  it("builds titles for known writers", () => {
    const meta = writerDocumentMeta("iambic-pentameter");
    expect(meta?.path).toBe("/write/iambic-pentameter");
    expect(meta?.title).toContain("Iambic pentameter");
  });
});
