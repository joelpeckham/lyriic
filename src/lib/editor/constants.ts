/**
 * Soft-wrap text leading (unitless, scales with font-size).
 * Descenders (y, g, p) need > 1; mark bands stack on top of this.
 */
export const TEXT_LEADING = 1.2;

/**
 * Stress mark glyph size (editor em — scales with verse font-size).
 * Keep in sync with `.lyriic-stress-mark` in index.css.
 */
export const STRESS_MARK_EM = 0.55;
/** Mismatch stress marks read slightly larger. */
export const STRESS_MARK_OFF_EM = 0.6;
/**
 * Lift of the stress glyph above the line-box top / into the top mark band
 * so marks sit clear of ascenders (editor em).
 *
 * CSS `transform` on `.lyriic-stress-mark` resolves `em` against the mark’s
 * own font-size (`STRESS_MARK_EM`), so the stylesheet uses
 * {@link STRESS_CLEARANCE_MARK_EM} instead of this value directly.
 */
export const STRESS_CLEARANCE_EM = 0.12;
/** Clearance as a fraction of the stress glyph size — CSS transform Y. */
export const STRESS_CLEARANCE_MARK_EM = STRESS_CLEARANCE_EM / STRESS_MARK_EM;

/**
 * Ruler tick sizes (editor em). Keep in sync with `.lyriic-ruler-tick*` CSS.
 */
export const TICK_HEIGHT_EM = 0.3;
export const TICK_TARGET_HEIGHT_EM = 0.5;
export const TICK_OVER_HEIGHT_EM = 0.45;
/**
 * Hang below the line-box bottom so ticks clear descenders.
 * Keep in sync with overlay / PoemLines tick transform.
 */
export const TICK_HANG_EM = 0.35;

/**
 * Vertical bands reserved for marks inside each soft-wrap row.
 * Top band holds stress (glyph + upward clearance); bottom band holds
 * hung ruler ticks so soft-wrap rows do not collide.
 */
export const MARK_BAND_TOP_EM = STRESS_MARK_EM + STRESS_CLEARANCE_EM;
export const MARK_BAND_BOTTOM_EM = TICK_HANG_EM + TICK_TARGET_HEIGHT_EM;

/**
 * Soft-wrap leading within a poetic line (unitless, scales with font-size).
 * Text leading + mark bands so stress (top) and ticks (bottom) stay clear
 * across wraps.
 */
export const WRAP_LEADING =
  TEXT_LEADING + MARK_BAND_TOP_EM + MARK_BAND_BOTTOM_EM;

/**
 * Extra space after each hard-newline poetic line (editor em).
 * Applied as `.cm-line` paddingBottom in zenTheme — not margin (CM height map).
 * Sized so hung syllable ticks clear the next line, plus a little air.
 */
export const LINE_GAP_EM = MARK_BAND_BOTTOM_EM + 0.35;

/** Tighter poetic gap when rulers, stress, and meter-break marks are off. */
export const LINE_GAP_COMPACT_EM = 0.75;

/**
 * @deprecated Prefer {@link LINE_GAP_EM}. Alias for callers that still import
 * the old name (value is editor-em, not root rem).
 */
export const LINE_GAP_REM = LINE_GAP_EM;

/** Content padding floors so first/last-line marks are not clipped (editor em). */
export const CONTENT_PAD_TOP_MARKS_EM = MARK_BAND_TOP_EM;
export const CONTENT_PAD_BOTTOM_MARKS_EM = MARK_BAND_BOTTOM_EM;

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
