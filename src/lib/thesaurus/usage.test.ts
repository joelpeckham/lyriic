import { describe, expect, it } from "vitest";

import { detectUsage } from "./usage";

describe("detectUsage", () => {
  it("uses determiners for nouns", () => {
    const line = "the remains of winter";
    const start = line.indexOf("remains");
    expect(detectUsage("remains", line, start, start + 7)).toBe("n");
  });

  it("uses subject pronouns for verbs", () => {
    const line = "she remains here still";
    const start = line.indexOf("remains");
    expect(detectUsage("remains", line, start, start + 7)).toBe("v");
  });

  it("uses infinitive to for verbs", () => {
    const line = "ready to light the lamp";
    const start = line.indexOf("light");
    expect(detectUsage("light", line, start, start + 5)).toBe("v");
  });

  it("uses degree modifiers for adjectives", () => {
    const line = "a very light touch";
    const start = line.indexOf("light");
    expect(detectUsage("light", line, start, start + 5)).toBe("a");
  });

  it("uses morphology for -ly adverbs", () => {
    const line = "softly falling snow";
    const start = 0;
    expect(detectUsage("softly", line, start, 6)).toBe("r");
  });

  it("returns null when context is ambiguous", () => {
    expect(detectUsage("light", "light", 0, 5)).toBeNull();
  });
});
