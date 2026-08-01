import { afterEach, describe, expect, it } from "vitest";

import {
  __setRhymeDataForTests,
  isRhymeIndexReady,
  lookupRhymes,
} from "./lookup";

describe("lookupRhymes", () => {
  afterEach(() => {
    __setRhymeDataForTests(null);
  });

  it("returns [] when data is not loaded", () => {
    expect(isRhymeIndexReady()).toBe(false);
    expect(lookupRhymes("time")).toEqual([]);
  });

  it("returns rhymes excluding self; [] for OOV", () => {
    __setRhymeDataForTests({
      byWord: {
        time: "AY1 M",
        rhyme: "AY1 M",
        lime: "AY1 M",
      },
      byKey: {
        "AY1 M": ["lime", "rhyme", "time"],
      },
    });
    expect(isRhymeIndexReady()).toBe(true);
    expect(lookupRhymes("Time")).toEqual(["lime", "rhyme"]);
    expect(lookupRhymes("xyzzy")).toEqual([]);
  });
});
