import { describe, expect, it } from "vitest";

import {
  mapSyllableToOffset,
  rulerSyllableCount,
  type SyllableOffsetToken,
} from "./mapSyllableToOffset";

function tok(
  partial: SyllableOffsetToken,
): SyllableOffsetToken {
  return partial;
}

describe("mapSyllableToOffset", () => {
  it("returns null for empty tokens or invalid syllable", () => {
    expect(mapSyllableToOffset([], 1)).toBeNull();
    expect(
      mapSyllableToOffset(
        [tok({ start: 0, end: 3, syllables: 1, syllableStart: 0, syllableEnd: 1 })],
        0,
      ),
    ).toBeNull();
  });

  it("places single-syllable words at the token end", () => {
    const tokens = [
      tok({ start: 0, end: 3, syllables: 1, syllableStart: 0, syllableEnd: 1 }),
      tok({ start: 4, end: 6, syllables: 1, syllableStart: 1, syllableEnd: 2 }),
    ];
    expect(mapSyllableToOffset(tokens, 1)).toBe(3);
    expect(mapSyllableToOffset(tokens, 2)).toBe(6);
  });

  it("interpolates inside multi-syllable words", () => {
    // "poem" at 0..4 with 2 syllables → s=1 at floor(0+4*1/2)=2, s=2 at floor(0+4*2/2)=4
    const tokens = [
      tok({ start: 0, end: 4, syllables: 2, syllableStart: 0, syllableEnd: 2 }),
    ];
    expect(mapSyllableToOffset(tokens, 1)).toBe(2);
    expect(mapSyllableToOffset(tokens, 2)).toBe(4);
  });

  it("skips zero-syllable tokens and maps later syllables", () => {
    const tokens = [
      tok({ start: 0, end: 1, syllables: 0, syllableStart: 0, syllableEnd: 0 }),
      tok({ start: 2, end: 7, syllables: 2, syllableStart: 0, syllableEnd: 2 }),
    ];
    expect(mapSyllableToOffset(tokens, 1)).toBe(4);
    expect(mapSyllableToOffset(tokens, 2)).toBe(7);
  });

  it("returns null when syllable is past the line", () => {
    const tokens = [
      tok({ start: 0, end: 3, syllables: 1, syllableStart: 0, syllableEnd: 1 }),
    ];
    expect(mapSyllableToOffset(tokens, 2)).toBeNull();
  });
});

describe("rulerSyllableCount", () => {
  it("uses total when there is no target or target is not greater", () => {
    expect(rulerSyllableCount(6, null)).toBe(6);
    expect(rulerSyllableCount(6, 5)).toBe(6);
    expect(rulerSyllableCount(6, 6)).toBe(6);
  });

  it("extends to target when under meter", () => {
    expect(rulerSyllableCount(4, 10)).toBe(10);
  });
});
