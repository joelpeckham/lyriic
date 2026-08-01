/**
 * Soft-wrap leading within a poetic line (unitless, scales with font-size).
 * Must stay > 1 so descenders (y, g, p) are not clipped. Extra room holds
 * stress marks (top) and syllable ticks (bottom) inside each visual row so
 * they do not collide across wraps.
 */
export const WRAP_LEADING = 2.3;

/**
 * Extra space after each hard-newline poetic line.
 * Applied as `.cm-line` paddingBottom in zenTheme — not margin (CM height map).
 * Sized so syllable ticks (hung below the glyph box) clear the next line.
 */
export const LINE_GAP_REM = 1.75;

/** Right padding reserved for syllable count overlays. */
export const COUNT_GUTTER_REM = 3;

/** Extra right-gutter slot for rhyme-scheme dots (beside counts). */
export const RHYME_GUTTER_REM = 0.9;
