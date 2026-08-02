import { describe, expect, it } from "vitest";

import {
  countPoemLines,
  defaultDraftName,
  draftFilename,
  draftListSecondary,
  firstVerseLine,
  formatRelativeUpdatedAt,
  isPlaceholderDraftName,
  softDraftNameFromText,
} from "./exportDraft";

describe("draftFilename", () => {
  it("sanitizes names and adds .txt", () => {
    expect(draftFilename("My Sonnet!")).toBe("My-Sonnet.txt");
    expect(draftFilename("  ")).toBe("draft.txt");
  });
});

describe("countPoemLines", () => {
  it("counts non-empty lines", () => {
    expect(countPoemLines("")).toBe(0);
    expect(countPoemLines("a\n\nb\n")).toBe(2);
  });
});

describe("firstVerseLine", () => {
  it("returns the first non-empty line, truncated", () => {
    expect(firstVerseLine("\n  hello world  \nnext")).toBe("hello world");
    expect(firstVerseLine("x".repeat(50), 10)).toBe(`${"x".repeat(9)}…`);
  });
});

describe("formatRelativeUpdatedAt", () => {
  it("formats recent and older times", () => {
    const now = Date.UTC(2026, 7, 1, 20, 0, 0);
    expect(formatRelativeUpdatedAt(now - 10_000, now)).toBe("Just now");
    expect(formatRelativeUpdatedAt(now - 5 * 60_000, now)).toBe("5m ago");
    expect(formatRelativeUpdatedAt(now - 3 * 3_600_000, now)).toBe("3h ago");
    expect(formatRelativeUpdatedAt(now - 2 * 86_400_000, now)).toBe("2d ago");
  });
});

describe("draftListSecondary", () => {
  it("prefers verse preview over empty cue", () => {
    const now = Date.now();
    expect(draftListSecondary("first line\nsecond", now - 60_000)).toBe(
      "first line",
    );
  });

  it("shows Empty · relative time when no verse", () => {
    const now = Date.now();
    expect(draftListSecondary("  \n  ", now - 60_000, undefined, now)).toBe(
      "Empty · 1m ago",
    );
  });

  it("accepts optional meter label for empty drafts", () => {
    const now = Date.now();
    expect(draftListSecondary("  \n  ", now - 60_000, "Haiku")).toBe(
      "Empty · Haiku",
    );
  });
});

describe("defaultDraftName", () => {
  it("returns a non-empty locale date stub", () => {
    expect(defaultDraftName(Date.UTC(2026, 7, 1, 18, 30)).length).toBeGreaterThan(
      0,
    );
  });
});

describe("isPlaceholderDraftName", () => {
  it("detects Untitled, seed labels, and datetime stubs", () => {
    expect(isPlaceholderDraftName("Untitled")).toBe(true);
    expect(isPlaceholderDraftName("  ")).toBe(true);
    expect(isPlaceholderDraftName("Haiku")).toBe(true);
    expect(isPlaceholderDraftName("Sonnet (iambic pentameter)")).toBe(true);
    expect(isPlaceholderDraftName("Free verse")).toBe(true);
    expect(
      isPlaceholderDraftName(defaultDraftName(Date.UTC(2026, 7, 1, 18, 30))),
    ).toBe(true);
  });

  it("does not treat user-chosen names as placeholders", () => {
    expect(isPlaceholderDraftName("My sonnet")).toBe(false);
    expect(isPlaceholderDraftName("River song")).toBe(false);
  });
});

describe("softDraftNameFromText", () => {
  it("renames placeholders from the first verse line", () => {
    expect(softDraftNameFromText("Untitled", "\n  soft rain  \nfalls")).toBe(
      "soft rain",
    );
    expect(softDraftNameFromText("Haiku", "an old pond")).toBe("an old pond");
  });

  it("leaves user names alone", () => {
    expect(softDraftNameFromText("My poem", "new first line")).toBeNull();
    expect(softDraftNameFromText("Untitled", "   ")).toBeNull();
  });
});
