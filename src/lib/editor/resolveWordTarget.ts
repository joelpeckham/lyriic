import type { EditorView } from "@codemirror/view";

import { wordAt } from "@/lib/editor/wordAt";

export type WordAnchor = {
  left: number;
  top: number;
  bottom: number;
  right: number;
};

/** Word under caret/selection/coords, with popover anchor box. */
export type WordTarget = {
  from: number;
  to: number;
  raw: string;
  word: string;
  lineIndex: number;
  /** Absolute start of the poetic line (for mapping token offsets). */
  lineFrom: number;
  /** Full poetic line text (for usage / POS heuristics). */
  lineText: string;
  anchor: WordAnchor;
};

/** Padding around the glyph box for hit-testing (sub-pixel / anti-alias). */
export const WORD_HIT_PAD_PX = 3;

/**
 * Vertical gap between word and toolbar — must match WordToolsPopover
 * `sideOffset`. Open-state {@link wordToolbarHitCorridors} cover this gap.
 */
export const WORD_TOOLBAR_SIDE_OFFSET_PX = 12;

/**
 * Minimum horizontal span for the open-state hit corridor. Short words
 * (`I`, `a`) are narrower than the centered actions bar.
 */
export const WORD_TOOLBAR_BRIDGE_MIN_WIDTH_PX = 120;

/** Attribute on the open-state word↔toolbar hit layer (see WordAnchor). */
export const WORD_HIT_ATTR = "data-word-hit";

export type WordHitRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function isDegenerateAnchor(anchor: WordAnchor): boolean {
  return anchor.right <= anchor.left || anchor.bottom <= anchor.top;
}

/**
 * Whether the pointer lies inside the word’s screen box.
 * Returns `null` when geometry is unavailable (jsdom / offscreen).
 */
export function pointerHitsWordAnchor(
  x: number,
  y: number,
  anchor: WordAnchor,
  pad = WORD_HIT_PAD_PX,
): boolean | null {
  if (isDegenerateAnchor(anchor)) return null;
  return (
    x >= anchor.left - pad &&
    x <= anchor.right + pad &&
    y >= anchor.top - pad &&
    y <= anchor.bottom + pad
  );
}

/**
 * Open-state corridor strips between the word pad and the toolbar (below by
 * default, above when collision flips). Does **not** cover the glyph box —
 * that stays click-through so the caret can move; pin-over-word uses geometry.
 */
export function wordToolbarHitCorridors(
  anchor: WordAnchor,
  sideOffset = WORD_TOOLBAR_SIDE_OFFSET_PX,
  pad = WORD_HIT_PAD_PX,
  minWidth = WORD_TOOLBAR_BRIDGE_MIN_WIDTH_PX,
): { above: WordHitRect; below: WordHitRect } | null {
  if (isDegenerateAnchor(anchor)) return null;
  if (sideOffset <= pad) return null;

  const mid = (anchor.left + anchor.right) / 2;
  const half = Math.max((anchor.right - anchor.left) / 2 + pad, minWidth / 2);
  const left = mid - half;
  const width = half * 2;
  const gap = sideOffset - pad;

  return {
    above: {
      left,
      top: anchor.top - sideOffset,
      width,
      height: gap,
    },
    below: {
      left,
      top: anchor.bottom + pad,
      width,
      height: gap,
    },
  };
}

/**
 * Resolve a word at selection (or optional document position) with viewport
 * coords for popover anchoring. Returns null when no single word applies.
 */
export function resolveWordTarget(
  view: EditorView,
  pos?: number,
): WordTarget | null {
  const sel = view.state.selection.main;
  const from = pos !== undefined ? pos : sel.from;
  const to = pos !== undefined ? pos : sel.to;
  const line = view.state.doc.lineAt(from);
  // Selection must stay on one line for word resolution.
  if (pos === undefined && to > line.to) return null;

  const resolved = wordAt(line.text, line.from, line.number - 1, from, to);
  if (!resolved) return null;

  // jsdom / offscreen: coordsAtPos may throw or return null — use a
  // degenerate anchor so open + replace still work in tests.
  let anchor: WordAnchor = { left: 0, right: 0, top: 0, bottom: 0 };
  try {
    const start = view.coordsAtPos(resolved.from);
    const end = view.coordsAtPos(resolved.to);
    if (start && end) {
      anchor = {
        left: Math.min(start.left, end.left),
        right: Math.max(start.right, end.right),
        top: Math.min(start.top, end.top),
        bottom: Math.max(start.bottom, end.bottom),
      };
    }
  } catch {
    // keep degenerate anchor
  }

  return {
    from: resolved.from,
    to: resolved.to,
    raw: resolved.raw,
    word: resolved.word,
    lineIndex: resolved.lineIndex,
    lineFrom: line.from,
    lineText: line.text,
    anchor,
  };
}

/**
 * Resolve the word under a pointer using precise hit-testing.
 *
 * CodeMirror’s `posAtCoords(coords, false)` estimates nearest text, so empty
 * margins before the first word / after the last word falsely hit those
 * words. Default (precise) mode can return null; we also require the pointer
 * to sit inside the word’s glyph box.
 */
export function wordTargetAtPointer(
  view: EditorView,
  x: number,
  y: number,
): WordTarget | null {
  let pos: number | null = null;
  try {
    // Precise is the default; pass `false` only for imprecise/estimated hits.
    pos = view.posAtCoords({ x, y });
  } catch {
    return null;
  }
  if (pos === null) return null;

  const target = resolveWordTarget(view, pos);
  if (!target) return null;
  // When glyph geometry exists, reject empty margins that still map to a
  // document position (common for first/last words on a line).
  if (pointerHitsWordAnchor(x, y, target.anchor) === false) return null;
  return target;
}
