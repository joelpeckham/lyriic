import { afterEach, describe, expect, it } from "vitest";

import {
  continueToEditor,
  registerToolHandoffSource,
} from "./continueToEditor";
import { TOOL_HANDOFF_KEY, consumeToolDraft } from "./editorHandoff";

describe("continueToEditor", () => {
  afterEach(() => {
    registerToolHandoffSource(null);
    sessionStorage.removeItem(TOOL_HANDOFF_KEY);
  });

  it("stashes explicit carryable text", () => {
    const sample = "stock sample";
    continueToEditor({ text: "my draft", samples: [sample] });
    expect(consumeToolDraft()?.text).toBe("my draft");
  });

  it("skips untouched samples", () => {
    const sample = "stock sample";
    continueToEditor({ text: sample, samples: [sample] });
    expect(consumeToolDraft()).toBeNull();
  });

  it("uses registered source for FAQ-style continues", () => {
    const sample = "stock sample";
    registerToolHandoffSource({ text: "edited draft", samples: [sample] });
    continueToEditor();
    expect(consumeToolDraft()?.text).toBe("edited draft");
  });

  it("no-ops when nothing is registered or carryable", () => {
    continueToEditor();
    expect(consumeToolDraft()).toBeNull();
  });
});
