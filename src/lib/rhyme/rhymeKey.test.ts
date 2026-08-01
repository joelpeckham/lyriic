import { describe, expect, it } from "vitest";

import { rhymeKeyFromIpa, rhymeKeyFromPhones } from "./rhymeKey";

describe("rhymeKeyFromIpa", () => {
  it("shares a key for perfect rhymes (rhyme / time / lime)", () => {
    const rhyme = rhymeKeyFromIpa("ɹˈaɪm");
    const time = rhymeKeyFromIpa("tˈaɪm");
    const lime = rhymeKeyFromIpa("lˈaɪm");
    expect(rhyme).toBe("aɪm");
    expect(time).toBe(rhyme);
    expect(lime).toBe(rhyme);
  });

  it("uses the last primary stress for multi-syllable words", () => {
    // hello: həˈloʊ
    expect(rhymeKeyFromIpa("həˈloʊ")).toBe("oʊ");
  });

  it("falls back to secondary stress when no primary", () => {
    expect(rhymeKeyFromIpa("həˌloʊ")).toBe("oʊ");
  });

  it("falls back to last vowel when unmarked", () => {
    expect(rhymeKeyFromIpa("kæt")).toBe("æt");
  });

  it("returns null when no vowel", () => {
    expect(rhymeKeyFromIpa("")).toBeNull();
    expect(rhymeKeyFromIpa("ʃ")).toBeNull();
  });
});

describe("rhymeKeyFromPhones (ARPAbet legacy)", () => {
  it("shares a key for perfect rhymes", () => {
    const rhyme = rhymeKeyFromPhones(["R", "AY1", "M"]);
    const time = rhymeKeyFromPhones(["T", "AY1", "M"]);
    expect(rhyme).toBe("AY1 M");
    expect(time).toBe(rhyme);
  });
});
