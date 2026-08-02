import { describe, expect, it } from "vitest";
import { literaryCandidates } from "./literaryAllowances";

describe("literaryCandidates", () => {
  it("always includes the ideal contour", () => {
    const ideal = [0, 1, 0, 1] as const;
    expect(literaryCandidates(ideal, null)).toEqual([
      { pattern: ideal, fit: "ideal" },
    ]);
  });

  it("adds first-foot inversion for iamb and trochee", () => {
    const iamb = [0, 1, 0, 1] as const;
    const trochee = [1, 0, 1, 0] as const;
    expect(literaryCandidates(iamb, "iamb").map((c) => c.fit)).toEqual([
      "ideal",
      "inversion",
      "feminine",
      "feminine",
    ]);
    expect(literaryCandidates(iamb, "iamb")[1]).toEqual({
      pattern: [1, 0, 0, 1],
      fit: "inversion",
    });
    expect(literaryCandidates(trochee, "trochee").map((c) => c.fit)).toEqual([
      "ideal",
      "inversion",
      "catalexis",
      "catalexis",
    ]);
  });

  it("adds feminine ending for iamb (+ trailing weak)", () => {
    const iamb = [0, 1, 0, 1] as const;
    const feminine = literaryCandidates(iamb, "iamb").filter(
      (c) => c.fit === "feminine",
    );
    expect(feminine).toContainEqual({
      pattern: [0, 1, 0, 1, 0],
      fit: "feminine",
    });
    expect(feminine).toContainEqual({
      pattern: [1, 0, 0, 1, 0],
      fit: "feminine",
    });
  });

  it("adds feminine ending for amphibrach without a 2-slot head flip", () => {
    const amphibrach = [0, 1, 0, 0, 1, 0] as const;
    const candidates = literaryCandidates(amphibrach, "amphibrach");
    expect(candidates.map((c) => c.fit)).toEqual(["ideal", "feminine"]);
    expect(candidates[1]).toEqual({
      pattern: [0, 1, 0, 0, 1, 0, 0],
      fit: "feminine",
    });
    // Must not invent a dactylic opening labeled feminine.
    expect(
      candidates.some(
        (c) =>
          c.fit === "feminine" &&
          c.pattern[0] === 1 &&
          c.pattern[1] === 0 &&
          c.pattern[2] === 0,
      ),
    ).toBe(false);
  });

  it("adds catalexis for trochee (− trailing weak)", () => {
    const trochee = [1, 0, 1, 0, 1, 0, 1, 0] as const;
    const cats = literaryCandidates(trochee, "trochee").filter(
      (c) => c.fit === "catalexis",
    );
    expect(cats).toContainEqual({
      pattern: [1, 0, 1, 0, 1, 0, 1],
      fit: "catalexis",
    });
  });

  it("adds dactyl catalexis truncations", () => {
    const dactyl = [1, 0, 0, 1, 0, 0] as const;
    const fits = literaryCandidates(dactyl, "dactyl").map((c) => c.fit);
    expect(fits).toEqual(["ideal", "catalexis", "catalexis"]);
    expect(literaryCandidates(dactyl, "dactyl")[2]?.pattern).toEqual([
      1, 0, 0, 1,
    ]);
  });
});
