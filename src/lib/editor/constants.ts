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

/**
 * Right padding reserved for syllable count overlays.
 * Applied as `.cm-line` padding-right in **em** (scales with editor font-size).
 * Overlay width uses the same constant × contentDOM.fontSize (px).
 */
export const COUNT_GUTTER_REM = 3;

/**
 * Extra right-gutter slot for rhyme-scheme dots (beside counts).
 * Same em/px contract as {@link COUNT_GUTTER_REM}.
 */
export const RHYME_GUTTER_REM = 0.9;

/**
 * Syllable-count overlay typography — keep in sync with `.lyriic-count` in
 * index.css. Root rem (not editor em) so gutter chrome stays stable across
 * text-size prefs while verse scales.
 */
export const COUNT_FONT_REM = 0.875;
export const COUNT_PAD_TOP_REM = 0.3;

/**
 * Painted rhyme-dot size and gap to the count column — keep in sync with
 * `.lyriic-rhyme-dot` width/height in index.css. Root rem so spacing does not
 * balloon with editor font-size.
 */
export const RHYME_DOT_SIZE_REM = 0.55;
export const RHYME_DOT_TO_COUNT_GAP_REM = 0.35;
