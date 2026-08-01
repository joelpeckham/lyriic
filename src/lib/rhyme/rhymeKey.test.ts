import { describe, expect, it } from "vitest";

import {
  endRhymeKeyFromIpa,
  rhymeKeyFromIpa,
  rhymeKeyFromPhones,
} from "./rhymeKey";

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

  it("falls back to last vowel when unmarked and monosyllabic", () => {
    expect(rhymeKeyFromIpa("kæt")).toBe("æt");
  });

  it("treats WikiPron ASCII e as a vowel nucleus", () => {
    expect(rhymeKeyFromIpa("eɹ")).toBe("eɹ");
  });

  it("skips trailing schwa when unmarked (banana)", () => {
    expect(rhymeKeyFromIpa("bənænə")).toBe("ænə");
  });

  it("normalizes ASCII g to IPA ɡ in keys", () => {
    expect(rhymeKeyFromIpa("tæg")).toBe(rhymeKeyFromIpa("tæɡ"));
    expect(rhymeKeyFromIpa("tæg")).toBe("æɡ");
  });

  it("treats syllabic consonants as nuclei", () => {
    expect(rhymeKeyFromIpa("tɪzn̩t")).toBe("ɪzn̩t");
  });

  it("returns null when no vowel", () => {
    expect(rhymeKeyFromIpa("")).toBeNull();
    expect(rhymeKeyFromIpa("ʃ")).toBeNull();
  });
});

describe("endRhymeKeyFromIpa", () => {
  it("uses the last nucleus ignoring stress (fun ↔ anyone)", () => {
    expect(endRhymeKeyFromIpa("fˈʌn")).toBe("ʌn");
    expect(endRhymeKeyFromIpa("ˈɛniwʌn")).toBe("ʌn");
  });

  it("differs from perfect rhyme on early-stressed words", () => {
    expect(rhymeKeyFromIpa("ˈɛniwʌn")).toBe("ɛniwʌn");
    expect(endRhymeKeyFromIpa("ˈɛniwʌn")).toBe("ʌn");
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
