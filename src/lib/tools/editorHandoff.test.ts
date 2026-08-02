import { afterEach, describe, expect, it } from "vitest";

import {
  TOOL_HANDOFF_KEY,
  consumeToolDraft,
  shouldCarryToolText,
  stashToolDraft,
} from "./editorHandoff";

describe("editorHandoff", () => {
  afterEach(() => {
    sessionStorage.removeItem(TOOL_HANDOFF_KEY);
  });

  it("skips stock samples and empty text", () => {
    const sample = "An old silent pond\nA frog jumps into the pond";
    expect(shouldCarryToolText("", [sample])).toBe(false);
    expect(shouldCarryToolText(sample, [sample])).toBe(false);
    expect(shouldCarryToolText("My own line\nAnother", [sample])).toBe(true);
  });

  it("stashes and consumes once", () => {
    stashToolDraft("Line one\nLine two");
    const first = consumeToolDraft();
    expect(first?.text).toBe("Line one\nLine two");
    expect(consumeToolDraft()).toBeNull();
  });
});
