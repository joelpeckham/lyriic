/**
 * Soft-wrap leading within a poetic line (unitless, scales with font-size).
 * Must stay > 1 so descenders (y, g, p) are not clipped. Extra room holds
 * stress marks (top) and syllable ticks (bottom) inside each visual row so
 * they do not collide across wraps.
 */
export const WRAP_LEADING = 1.85;

/**
 * Extra space after each hard-newline poetic line.
 * Applied as `.cm-line` paddingBottom in zenTheme — not margin (CM height map).
 */
export const LINE_GAP_REM = 1.25;

/** Right padding reserved for syllable count overlays. */
export const COUNT_GUTTER_REM = 3;
