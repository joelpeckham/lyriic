import { afterEach, describe, expect, it } from "vitest";

import {
  __setRhymeDataForTests,
  hasRhymeEntry,
  hasRhymeQueryEntry,
  lookupRhymes,
  materializeWords,
  queryRhymeIds,
} from "./lookup";

afterEach(() => {
  __setRhymeDataForTests(null);
});

describe("lookupRhymes", () => {
  it("returns perfect-rhyme buckets by default", () => {
    __setRhymeDataForTests({
      byWord: { fun: "ʌn", begun: "ʌn" },
      byKey: { ʌn: ["fun", "begun", "gun"] },
      byWordEnd: { fun: "ʌn", anyone: "ʌn" },
      byKeyEnd: { ʌn: ["fun", "anyone", "gun"] },
    });
    expect(lookupRhymes("fun")).toEqual(["begun", "gun"]);
    expect(hasRhymeEntry("fun")).toBe(true);
  });

  it("returns end-rhyme buckets in end mode", () => {
    __setRhymeDataForTests({
      byWord: { fun: "ʌn", anyone: "ɛniwʌn" },
      byKey: { ʌn: ["fun", "gun"], ɛniwʌn: ["anyone"] },
      byWordEnd: { fun: "ʌn", anyone: "ʌn" },
      byKeyEnd: { ʌn: ["fun", "anyone", "gun"] },
    });
    expect(lookupRhymes("fun", "end")).toEqual(["anyone", "gun"]);
    expect(lookupRhymes("anyone", "perfect")).toEqual([]);
    expect(hasRhymeEntry("anyone", "end")).toBe(true);
  });
});

describe("queryRhymeIds", () => {
  it("returns perfect only when includeEnd is false", () => {
    __setRhymeDataForTests({
      byWord: { fun: "ʌn", begun: "ʌn" },
      byKey: { ʌn: ["fun", "begun", "gun"] },
      byWordEnd: { fun: "ʌn", anyone: "ʌn" },
      byKeyEnd: { ʌn: ["fun", "anyone", "gun"] },
    });
    expect(materializeWords(queryRhymeIds("fun", false), null)).toEqual([
      "begun",
      "gun",
    ]);
  });

  it("unions end rhymes after perfect when includeEnd is true", () => {
    __setRhymeDataForTests({
      byWord: { fun: "ʌn", begun: "ʌn" },
      byKey: { ʌn: ["fun", "begun", "gun"] },
      byWordEnd: { fun: "ʌn", anyone: "ʌn" },
      byKeyEnd: { ʌn: ["fun", "anyone", "gun"] },
    });
    expect(materializeWords(queryRhymeIds("fun", true), null)).toEqual([
      "begun",
      "gun",
      "anyone",
    ]);
    expect(hasRhymeQueryEntry("anyone", false)).toBe(false);
    expect(hasRhymeQueryEntry("anyone", true)).toBe(true);
  });
});
