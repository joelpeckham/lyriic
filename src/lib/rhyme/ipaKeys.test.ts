import { describe, expect, it } from "vitest";

// Build-time IPA helpers — not part of the client bundle.
import {
  endRhymeKeyFromIpa,
  rhymeKeyFromIpa,
  slantRhymeKeysFromIpa,
} from "../../../scripts/lib/ipa.mjs";

describe("rhymeKeyFromIpa (scripts/lib/ipa.mjs)", () => {
  it("shares a key for perfect rhymes (rhyme / time / lime)", () => {
    const rhyme = rhymeKeyFromIpa("ɹˈaɪm");
    const time = rhymeKeyFromIpa("tˈaɪm");
    const lime = rhymeKeyFromIpa("lˈaɪm");
    expect(rhyme).toBe("aɪm");
    expect(time).toBe(rhyme);
    expect(lime).toBe(rhyme);
  });

  it("uses the last primary stress for multi-syllable words", () => {
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

describe("endRhymeKeyFromIpa (scripts/lib/ipa.mjs)", () => {
  it("uses the last nucleus ignoring stress (fun ↔ anyone)", () => {
    expect(endRhymeKeyFromIpa("fˈʌn")).toBe("ʌn");
    expect(endRhymeKeyFromIpa("ˈɛniwʌn")).toBe("ʌn");
  });

  it("differs from perfect rhyme on early-stressed words", () => {
    expect(rhymeKeyFromIpa("ˈɛniwʌn")).toBe("ɛniwʌn");
    expect(endRhymeKeyFromIpa("ˈɛniwʌn")).toBe("ʌn");
  });

  it("keeps the diphthong for -ire endings (fire ↛ butter)", () => {
    expect(endRhymeKeyFromIpa("fˈaɪɚ")).toBe("aɪɚ");
    expect(endRhymeKeyFromIpa("fˈaɪəɹ")).toBe("aɪɚ");
  });

  it("collapses NURSE/LETTER for end rhyme", () => {
    expect(endRhymeKeyFromIpa("wˈɝld")).toBe("ɚld");
    expect(endRhymeKeyFromIpa("kˈɝld")).toBe(
      endRhymeKeyFromIpa("ˈʌndɚwɝld"),
    );
  });
});

describe("slantRhymeKeysFromIpa (scripts/lib/ipa.mjs)", () => {
  it("shares family keys for night / side (AI+T)", () => {
    const night = slantRhymeKeysFromIpa("nˈaɪt");
    const side = slantRhymeKeysFromIpa("sˈaɪd");
    expect(night[0]).toBe("f:AI+T");
    expect(side[0]).toBe(night[0]);
    expect(night[1]).toBe("a:AI");
  });

  it("shares family keys for love / rough (V+F)", () => {
    expect(slantRhymeKeysFromIpa("lˈʌv")[0]).toBe("f:V+F");
    expect(slantRhymeKeysFromIpa("ɹˈʌf")[0]).toBe("f:V+F");
  });

  it("shares family keys for cat / bad (A+T)", () => {
    expect(slantRhymeKeysFromIpa("kæt")[0]).toBe("f:A+T");
    expect(slantRhymeKeysFromIpa("bæd")[0]).toBe("f:A+T");
  });

  it("does not family-match time / tame (AI vs E)", () => {
    expect(slantRhymeKeysFromIpa("tˈaɪm")[0]).toBe("f:AI+N");
    expect(slantRhymeKeysFromIpa("tˈeɪm")[0]).toBe("f:E+N");
  });

  it("does not family-match cat / cast (coda length)", () => {
    expect(slantRhymeKeysFromIpa("kæt")[0]).toBe("f:A+T");
    expect(slantRhymeKeysFromIpa("kæst")[0]).toBe("f:A+ST");
  });

  it("does not family-match tie / time (open vs closed)", () => {
    expect(slantRhymeKeysFromIpa("tˈaɪ")[0]).toBe("f:AI+Ø");
    expect(slantRhymeKeysFromIpa("tˈaɪm")[0]).toBe("f:AI+N");
  });

  it("assonance matches hold / coal; family does not", () => {
    const hold = slantRhymeKeysFromIpa("hˈoʊld");
    const coal = slantRhymeKeysFromIpa("kˈoʊl");
    expect(hold[0]).toBe("f:O+LT");
    expect(coal[0]).toBe("f:O+L");
    expect(hold[1]).toBe("a:O");
    expect(coal[1]).toBe(hold[1]);
  });

  it("keeps fire as AI+V (not reduced-only)", () => {
    expect(slantRhymeKeysFromIpa("fˈaɪɚ")[0]).toBe("f:AI+V");
    expect(slantRhymeKeysFromIpa("fˈaɪɚ")[1]).toBe("a:AI");
  });

  it("returns empty when no vowel", () => {
    expect(slantRhymeKeysFromIpa("")).toEqual([]);
    expect(slantRhymeKeysFromIpa("ʃ")).toEqual([]);
  });
});

describe("canonicalize (via keys)", () => {
  it("unifies Misaki ɜɹ/əɹ with CMU ɝ/ɚ", () => {
    expect(rhymeKeyFromIpa("wˈɜɹld")).toBe(rhymeKeyFromIpa("wˈɝld"));
    expect(rhymeKeyFromIpa("bˈʌtəɹ")).toBe(rhymeKeyFromIpa("bˈʌtɚ"));
  });

  it("maps US flap to t for rhyme identity", () => {
    expect(rhymeKeyFromIpa("ˈæɾɪk")).toBe(rhymeKeyFromIpa("ˈætɪk"));
  });

  it("maps British əʊ to US oʊ", () => {
    expect(rhymeKeyFromIpa("ɡəʊ")).toBe(rhymeKeyFromIpa("ɡoʊ"));
  });
});
