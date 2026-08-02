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
    // Single-segment coda: no truncation key.
    expect(night).toEqual(["f:AI+T"]);
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
    // Stop truncation is ST→S, not ST→T, so cat ↛ cast.
    expect(slantRhymeKeysFromIpa("kæst")[1]).toBe("f:A+S");
  });

  it("does not family-match tie / time (open vs closed)", () => {
    expect(slantRhymeKeysFromIpa("tˈaɪ")[0]).toBe("f:AI+Ø");
    expect(slantRhymeKeysFromIpa("tˈaɪm")[0]).toBe("f:AI+N");
  });

  it("additive slant matches hold / coal and mind / time", () => {
    const hold = slantRhymeKeysFromIpa("hˈoʊld");
    const coal = slantRhymeKeysFromIpa("kˈoʊl");
    expect(hold).toEqual(["f:O+LT", "f:O+L"]);
    expect(coal).toEqual(["f:O+L"]);
    expect(hold).toContain(coal[0]);

    const mind = slantRhymeKeysFromIpa("mˈaɪnd");
    const time = slantRhymeKeysFromIpa("tˈaɪm");
    expect(mind).toEqual(["f:AI+NT", "f:AI+N"]);
    expect(time).toEqual(["f:AI+N"]);
    expect(mind).toContain(time[0]);
  });

  it("does not truncate affricates (french ↛ pen / members)", () => {
    const french = slantRhymeKeysFromIpa("fɹˈɛntʃ");
    const pen = slantRhymeKeysFromIpa("pˈɛn");
    const members = slantRhymeKeysFromIpa("mˈɛmbɚz");
    // CH is not a stop — no NCH→N truncation into the E+N mega-bucket.
    expect(french).toEqual(["f:E+NCH"]);
    expect(pen).toEqual(["f:E+N"]);
    expect(members).toEqual(["f:E+NPERS"]);
    expect(french.some((k) => pen.includes(k))).toBe(false);
    expect(french.some((k) => members.includes(k))).toBe(false);
  });

  it("does not truncate trailing vowel coda (city ↛ sit)", () => {
    const city = slantRhymeKeysFromIpa("sˈɪti");
    const sit = slantRhymeKeysFromIpa("sˈɪt");
    expect(city).toEqual(["f:I+TI"]);
    expect(sit).toEqual(["f:I+T"]);
    expect(city.some((k) => sit.includes(k))).toBe(false);
  });

  it("keeps STRUT / NURSE / schwa apart (her ↛ the)", () => {
    expect(slantRhymeKeysFromIpa("lˈʌv")[0]).toBe("f:V+F");
    expect(slantRhymeKeysFromIpa("hˈɝ")).toEqual(["f:ER+Ø"]);
    expect(slantRhymeKeysFromIpa("ðə")).toEqual([]);
    expect(
      slantRhymeKeysFromIpa("hˈɝ").some((k) =>
        slantRhymeKeysFromIpa("ðə").includes(k),
      ),
    ).toBe(false);
  });

  it("keeps fire as AI+ER (NURSE coda, not STRUT)", () => {
    expect(slantRhymeKeysFromIpa("fˈaɪɚ")).toEqual(["f:AI+ER"]);
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
