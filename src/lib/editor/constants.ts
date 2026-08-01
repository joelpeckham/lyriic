/**
 * Soft-wrap leading within a poetic line (unitless, scales with font-size).
 * Must stay > 1 so descenders (y, g, p) are not clipped.
 */
export const WRAP_LEADING = 1.35;

/** Extra space between hard-newline poetic lines (Tailwind gap-4 = 1rem). */
export const LINE_GAP_REM = 1;

/** Right padding reserved for syllable count overlays. */
export const COUNT_GUTTER_REM = 3;
