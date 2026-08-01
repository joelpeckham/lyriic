import { describe, expect, it } from "vitest";

import { rhymeKeyFromPhones } from "./rhymeKey";

describe("rhymeKeyFromPhones", () => {
  it("shares a key for perfect rhymes (rhyme / time / lime)", () => {
    const rhyme = rhymeKeyFromPhones(["R", "AY1", "M"]);
    const time = rhymeKeyFromPhones(["T", "AY1", "M"]);
    const lime = rhymeKeyFromPhones(["L", "AY1", "M"]);
    expect(rhyme).toBe("AY1 M");
    expect(time).toBe(rhyme);
    expect(lime).toBe(rhyme);
  });

  it("uses the last primary stress for multi-syllable words", () => {
    // orange: AO1 R AH0 N JH
    expect(rhymeKeyFromPhones(["AO1", "R", "AH0", "N", "JH"])).toBe(
      "AO1 R AH0 N JH",
    );
  });

  it("falls back to secondary stress when no primary", () => {
    expect(rhymeKeyFromPhones(["HH", "AH0", "L", "OW2"])).toBe("OW2");
  });

  it("returns null when no stressed vowel", () => {
    expect(rhymeKeyFromPhones(["AH0", "N"])).toBeNull();
    expect(rhymeKeyFromPhones([])).toBeNull();
  });
});
