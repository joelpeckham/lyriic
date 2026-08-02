import {
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";

import { COUNT_GUTTER_REM, RHYME_GUTTER_REM } from "@/lib/editor/constants";
import {
  mapSyllableMidpointToOffset,
  mapSyllableToOffset,
  rulerSyllableCount,
} from "@/lib/meters/mapSyllableToOffset";
import {
  flattenTokenStress,
  stressMismatchMask,
  type MeteredLine,
  type MeterStatus,
} from "@/lib/meters";
import {
  rhymeSchemeLineTitle,
  type RhymeSchemeLine,
} from "@/lib/rhyme";

export type MeterOverlayState = {
  showCounts: boolean;
  showRulers: boolean;
  showStress: boolean;
  showMeterBreaks: boolean;
  showRhymeScheme: boolean;
  /** Per-line rhyme-scheme analysis (aligned with textLines). */
  rhymeLines: readonly RhymeSchemeLine[];
  /** Metered lines — tokens used as-is for ruler geometry. */
  lines: readonly MeteredLine[];
  textLines: readonly string[];
};

const EMPTY: MeterOverlayState = {
  showCounts: false,
  showRulers: false,
  showStress: false,
  showMeterBreaks: false,
  showRhymeScheme: false,
  rhymeLines: [],
  lines: [],
  textLines: [],
};

/** Per-view meter data for the syllable overlay plugin. */
const overlayByView = new WeakMap<EditorView, MeterOverlayState>();

export function getMeterOverlay(view: EditorView): MeterOverlayState {
  return overlayByView.get(view) ?? EMPTY;
}

export function setMeterOverlayData(
  view: EditorView,
  state: MeterOverlayState,
): void {
  overlayByView.set(view, state);
}

/** Exported for tests. */
export function statusClass(status: MeterStatus): string {
  if (status === "exact") return "lyriic-count--exact";
  if (status === "over") return "lyriic-count--over";
  if (status === "stress") return "lyriic-count--stress";
  return "lyriic-count--subtle";
}

/** Exported for tests. */
export function tickClass(syllable: number, target: number | null): string {
  if (target !== null && syllable === target) return "lyriic-ruler-tick--target";
  if (target !== null && syllable > target) return "lyriic-ruler-tick--over";
  return "lyriic-ruler-tick";
}

/** Exported for tests. */
export function rhymeDotClass(rhyme: RhymeSchemeLine): string {
  const classes = ["lyriic-rhyme-dot"];
  if (rhyme.status === "match") {
    classes.push("lyriic-rhyme-dot--match");
  } else if (rhyme.status === "endMatch") {
    classes.push("lyriic-rhyme-dot--end");
  } else if (rhyme.status === "slantMatch") {
    classes.push("lyriic-rhyme-dot--slant");
  } else if (rhyme.status === "mismatch") {
    classes.push("lyriic-rhyme-dot--mismatch");
  } else if (rhyme.status === "unknown" || rhyme.status === "open") {
    classes.push("lyriic-rhyme-dot--muted");
    if (rhyme.colorIndex >= 0) {
      classes.push(
        `lyriic-rhyme-dot--${String.fromCharCode(65 + (rhyme.colorIndex % 7))}`,
      );
    }
  }
  return classes.join(" ");
}

/** Keep overlay geometry on this doc line (avoids coords at line.to → next line). */
export function posOnLine(
  lineFrom: number,
  lineTo: number,
  offset: number,
): number {
  if (lineTo <= lineFrom) return lineFrom;
  return Math.min(lineFrom + Math.max(0, offset), lineTo - 1);
}

/**
 * Per-syllable mismatch mask for lines already marked `status === "stress"`.
 * Relies on buildMeteredLine’s status semantics (pack ready, count match, mismatch).
 */
function mismatchMaskForStressLine(line: MeteredLine): boolean[] | null {
  if (line.status !== "stress" || line.expectedStress === null) return null;
  return stressMismatchMask(
    flattenTokenStress(line.tokens),
    line.expectedStress,
  );
}

function coordsAtPosSafe(
  view: EditorView,
  pos: number,
): { left: number; right: number; top: number; bottom: number } | null {
  try {
    return view.coordsAtPos(pos);
  } catch {
    return null;
  }
}

function placeAt(
  el: HTMLElement,
  hostRect: DOMRect,
  x: number,
  y: number,
): void {
  el.style.left = `${x - hostRect.left}px`;
  el.style.top = `${y - hostRect.top}px`;
}

/**
 * Syllable counts + meter rulers + stress marks on the editor host
 * (sibling of `.cm-editor`). Meter data comes from `setMeterOverlayData`;
 * positions use `coordsAtPos`.
 *
 * On `docChanged`, clear overlay DOM immediately so stale ticks/counts do not
 * linger at old geometry. React then pushes fresh meter data and calls
 * `redraw` when live editor text drives counting.
 */
export const syllableOverlay = ViewPlugin.fromClass(
  class {
    readonly dom: HTMLElement;
    private host: HTMLElement | null = null;
    private rafId: number | null = null;
    private pendingView: EditorView | null = null;

    constructor(view: EditorView) {
      this.dom = document.createElement("div");
      this.dom.className = "lyriic-syllable-overlay";
      this.dom.setAttribute("aria-hidden", "true");
      this.mount(view);
      this.scheduleDraw(view);
    }

    private mount(view: EditorView) {
      const host = view.dom.parentElement;
      if (!host) return;
      this.host = host;
      if (getComputedStyle(host).position === "static") {
        host.style.position = "relative";
      }
      if (!this.dom.isConnected) {
        host.appendChild(this.dom);
      }
    }

    private scheduleDraw(view: EditorView) {
      this.pendingView = view;
      if (this.rafId !== null) return;
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        const v = this.pendingView;
        this.pendingView = null;
        if (v) this.draw(v);
      });
    }

    update(update: ViewUpdate) {
      if (!this.dom.isConnected) {
        this.mount(update.view);
      }
      // Clear stale geometry; React redraws with fresh meter data.
      if (update.docChanged) {
        this.dom.replaceChildren();
        return;
      }
      if (update.viewportChanged || update.geometryChanged) {
        this.scheduleDraw(update.view);
      }
    }

    /** Called from React after meter data changes. */
    redraw(view: EditorView) {
      this.scheduleDraw(view);
    }

    draw(view: EditorView) {
      const {
        showCounts,
        showRulers,
        showStress,
        showMeterBreaks,
        showRhymeScheme,
        rhymeLines,
        lines,
        textLines,
      } = getMeterOverlay(view);
      const showMismatchMarks =
        showMeterBreaks && lines.some((l) => l.status === "stress");
      if (
        !showCounts &&
        !showRulers &&
        !showStress &&
        !showMismatchMarks &&
        !showRhymeScheme
      ) {
        this.dom.replaceChildren();
        return;
      }

      const host = this.host ?? view.dom.parentElement;
      if (!host) return;
      const hostRect = host.getBoundingClientRect();
      const contentRect = view.contentDOM.getBoundingClientRect();
      const left = contentRect.left - hostRect.left;
      const width = contentRect.width;

      const frag = document.createDocumentFragment();
      const doc = view.state.doc;
      const { from, to } = view.viewport;

      for (let lineNo = 1; lineNo <= doc.lines; lineNo++) {
        const line = doc.line(lineNo);
        if (line.to < from || line.from > to) continue;

        const overlay = lines[lineNo - 1];
        if (!overlay) continue;

        const total = overlay.total;
        const lineHasText = (textLines[lineNo - 1] ?? "").length > 0;
        if (total <= 0 && !lineHasText) continue;

        // Cull using the full soft-wrapped block — not just line.from coords
        // (which are null/off-screen when only a continuation row is visible).
        const block = view.lineBlockAt(line.from);
        const blockClientTop = view.documentTop + block.top;
        const blockClientBottom = view.documentTop + block.bottom;
        if (
          blockClientBottom < hostRect.top ||
          blockClientTop > hostRect.bottom
        ) {
          continue;
        }

        if (showRulers && overlay.tokens.length > 0) {
          const tickCount = rulerSyllableCount(total, overlay.target);
          for (let s = 1; s <= tickCount; s++) {
            const offset = mapSyllableToOffset(overlay.tokens, s);
            if (offset === null) continue;
            const pos = posOnLine(line.from, line.to, offset);
            const tickCoords = coordsAtPosSafe(view, pos);
            if (!tickCoords) continue;

            const tick = document.createElement("span");
            tick.className = tickClass(s, overlay.target);
            placeAt(tick, hostRect, tickCoords.left, tickCoords.bottom);
            frag.append(tick);
          }
        }

        const mismatchMask = showMeterBreaks
          ? mismatchMaskForStressLine(overlay)
          : null;
        const hasMismatches =
          mismatchMask !== null && mismatchMask.some(Boolean);
        // Full weak/strong contour when stress marks are on, or when this
        // line breaks meter and meter-break highlighting is enabled.
        const showPattern =
          showStress || (showMeterBreaks && hasMismatches);
        if (showPattern && overlay.tokens.length > 0) {
          for (const token of overlay.tokens) {
            for (let i = 0; i < token.stress.length; i++) {
              const syllableIndex = token.syllableStart + i;
              const isMismatch =
                showMeterBreaks && mismatchMask?.[syllableIndex] === true;
              const isStressed = token.stress[i] !== 0;

              const syllable = syllableIndex + 1;
              const offset = mapSyllableMidpointToOffset(
                overlay.tokens,
                syllable,
              );
              if (offset === null) continue;
              const pos = posOnLine(line.from, line.to, offset);
              const markCoords = coordsAtPosSafe(view, pos);
              if (!markCoords) continue;

              const mark = document.createElement("span");
              const classes = ["lyriic-stress-mark"];
              if (!isStressed) classes.push("lyriic-stress-mark--weak");
              if (isMismatch) classes.push("lyriic-stress-mark--off");
              mark.className = classes.join(" ");
              // Match WordToolsPopover: ˈ stressed, ˘ unstressed.
              mark.textContent = isStressed ? "ˈ" : "˘";
              placeAt(mark, hostRect, markCoords.left, markCoords.top);
              frag.append(mark);
            }
          }
        }

        // Prefer the first visible visual row for count / rhyme vertical align.
        let rowTop = blockClientTop - hostRect.top;
        const startCoords = coordsAtPosSafe(view, line.from);
        if (startCoords) {
          rowTop = startCoords.top - hostRect.top;
        } else {
          const visiblePos = Math.max(line.from, from);
          const visibleCoords = coordsAtPosSafe(
            view,
            posOnLine(line.from, line.to, visiblePos - line.from),
          );
          if (visibleCoords) {
            rowTop = visibleCoords.top - hostRect.top;
          }
        }

        const fontSize = parseFloat(
          getComputedStyle(view.contentDOM).fontSize || "16",
        );
        const countGutterPx = COUNT_GUTTER_REM * fontSize;
        const rhymeSlotPx = showRhymeScheme ? RHYME_GUTTER_REM * fontSize : 0;
        // Right gutter: [rhyme dot][syllable count…], both clear of glyphs.
        const gutterPx = countGutterPx + rhymeSlotPx;
        const gutterLeft = left + Math.max(0, width - gutterPx);

        if (showRhymeScheme) {
          const rhyme = rhymeLines[lineNo - 1];
          if (rhyme && rhyme.letter && rhyme.status !== "empty") {
            const dot = document.createElement("span");
            dot.className = rhymeDotClass(rhyme);
            dot.dataset.letter = rhyme.letter;
            // Label for React shadcn Tooltip (see RhymeDotTooltip).
            dot.dataset.tooltip = rhymeSchemeLineTitle(rhyme);
            // Left edge of the right gutter, beside the syllable count.
            dot.style.left = `${gutterLeft + rhymeSlotPx * 0.15}px`;
            dot.style.top = `${rowTop + fontSize * 0.45}px`;
            frag.append(dot);
          }
        }

        if (showCounts) {
          const el = document.createElement("span");
          el.className = `lyriic-count ${statusClass(overlay.status)}`;
          el.style.top = `${rowTop}px`;
          // Sit in the line’s right gutter only — a full-width strip used to
          // cover glyphs and could flicker the cursor at sub-pixel edges.
          el.style.left = `${gutterLeft + rhymeSlotPx}px`;
          el.style.width = `${Math.min(width, countGutterPx)}px`;

          if (overlay.target !== null && total > 0) {
            el.append(document.createTextNode(String(total)));
            const target = document.createElement("span");
            target.className = "lyriic-count__target";
            target.textContent = `/${overlay.target}`;
            el.append(target);
          } else {
            el.textContent = String(total);
          }

          frag.append(el);
        }
      }

      this.dom.replaceChildren(frag);
    }

    destroy() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.pendingView = null;
      this.dom.remove();
      this.host = null;
    }
  },
);

/** Look up the active syllable overlay plugin instance on a view. */
export function getSyllableOverlay(view: EditorView) {
  return view.plugin(syllableOverlay);
}
