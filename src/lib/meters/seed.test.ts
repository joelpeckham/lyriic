import { describe, expect, it } from "vitest";

import {
  isReusableEmptyDraft,
  meterSeedIdentity,
  parseMeterSeed,
  settingsFromMeterSeed,
  urlHasMeterSeedQuery,
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
  it("defaults syllable forms without stress overlays", () => {
    const settings = settingsFromMeterSeed({
      meterId: "haiku",
      overlays: {},
    });
    expect(settings?.meter).toBe("haiku");
    expect(settings?.showStress).toBe(false);
    expect(settings?.showMeterBreaks).toBe(false);
    expect(settings?.showRulers).toBe(true);
  });

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

describe("meterSeedIdentity / urlHasMeterSeedQuery", () => {
  it("keys identity on slug or meter only (not overlay query)", () => {
    expect(meterSeedIdentity("haiku", "haiku")).toBe("slug:haiku");
    expect(meterSeedIdentity(undefined, "sonnet")).toBe("meter:sonnet");
    // Same identity before/after strip — overlays must not re-default.
    expect(meterSeedIdentity("haiku", "haiku")).toBe(
      meterSeedIdentity("haiku", "haiku"),
    );
  });

  it("detects fresh deep-link query flags", () => {
    expect(urlHasMeterSeedQuery(new URLSearchParams("meter=haiku"))).toBe(
      true,
    );
    expect(urlHasMeterSeedQuery(new URLSearchParams("stress=1"))).toBe(true);
    expect(urlHasMeterSeedQuery(new URLSearchParams())).toBe(false);
  });
});

describe("isReusableEmptyDraft", () => {
  it("reuses empty default-meter or same-meter drafts", () => {
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
    expect(
      isReusableEmptyDraft(
        {
          text: "",
          settings: { ...DEFAULT_SETTINGS, meter: "haiku" },
        },
        "haiku",
      ),
    ).toBe(true);
  });
});

describe("writerDocumentMeta", () => {
  it("builds titles for known writers", () => {
    const meta = writerDocumentMeta("iambic-pentameter");
    expect(meta?.path).toBe("/write/iambic-pentameter");
    expect(meta?.title).toContain("Iambic pentameter");
  });
});
