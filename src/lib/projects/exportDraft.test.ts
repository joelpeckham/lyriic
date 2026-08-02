import { describe, expect, it } from "vitest";

import {
  countPoemLines,
  defaultDraftName,
  draftFilename,
  draftListSecondary,
  firstVerseLine,
  formatRelativeUpdatedAt,
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
  it("prefers verse preview over relative time", () => {
    const now = Date.now();
    expect(draftListSecondary("first line\nsecond", now - 60_000, now)).toBe(
      "first line",
    );
    expect(draftListSecondary("  \n  ", now - 60_000, now)).toBe("1m ago");
  });
});

describe("defaultDraftName", () => {
  it("returns a non-empty locale date stub", () => {
    expect(defaultDraftName(Date.UTC(2026, 7, 1, 18, 30)).length).toBeGreaterThan(
      0,
    );
  });
});
