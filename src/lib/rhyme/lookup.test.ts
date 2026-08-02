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

  it("returns slant-rhyme buckets in slant mode", () => {
    __setRhymeDataForTests({
      byWord: { night: "aɪt", light: "aɪt" },
      byKey: { aɪt: ["night", "light"] },
      byWordEnd: { night: "aɪt", light: "aɪt" },
      byKeyEnd: { aɪt: ["night", "light"] },
      byWordSlant: {
        night: ["f:AI+T"],
        side: ["f:AI+T"],
        mind: ["f:AI+NT", "f:AI+N"],
        time: ["f:AI+N"],
      },
      byKeySlant: {
        "f:AI+T": ["night", "side", "light"],
        "f:AI+NT": ["mind"],
        "f:AI+N": ["mind", "time"],
      },
    });
    expect(lookupRhymes("night", "slant")).toEqual(["side", "light"]);
    expect(lookupRhymes("mind", "slant")).toEqual(["time"]);
    expect(hasRhymeEntry("side", "slant")).toBe(true);
  });
});

describe("queryRhymeIds", () => {
  it("returns perfect only when near modes are off", () => {
    __setRhymeDataForTests({
      byWord: { fun: "ʌn", begun: "ʌn" },
      byKey: { ʌn: ["fun", "begun", "gun"] },
      byWordEnd: { fun: "ʌn", anyone: "ʌn" },
      byKeyEnd: { ʌn: ["fun", "anyone", "gun"] },
      byWordSlant: { fun: "f:V+N", love: "f:V+F" },
      byKeySlant: { "f:V+N": ["fun", "sun"], "f:V+F": ["love"] },
    });
    expect(materializeWords(queryRhymeIds("fun", {}), null)).toEqual([
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
    expect(
      materializeWords(queryRhymeIds("fun", { includeEnd: true }), null),
    ).toEqual(["begun", "gun", "anyone"]);
    expect(hasRhymeQueryEntry("anyone", {})).toBe(false);
    expect(hasRhymeQueryEntry("anyone", { includeEnd: true })).toBe(true);
  });

  it("unions slant after perfect and end", () => {
    __setRhymeDataForTests({
      byWord: { night: "aɪt", light: "aɪt" },
      byKey: { aɪt: ["night", "light"] },
      byWordEnd: { night: "aɪt" },
      byKeyEnd: { aɪt: ["night", "light"] },
      byWordSlant: { night: "f:AI+T", side: "f:AI+T" },
      byKeySlant: { "f:AI+T": ["night", "side", "light"] },
    });
    expect(
      materializeWords(
        queryRhymeIds("night", { includeEnd: true, includeSlant: true }),
        null,
      ),
    ).toEqual(["light", "side"]);
    expect(hasRhymeQueryEntry("side", { includeSlant: true })).toBe(true);
  });

  it("accepts boolean includeEnd for backward compatibility", () => {
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
  });
});
