import {
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";

import {
  mapSyllableMidpointToOffset,
  mapSyllableToOffset,
  rulerSyllableCount,
} from "@/lib/meters/mapSyllableToOffset";
import type { MeteredLine, MeterStatus } from "@/lib/meters";

export type MeterOverlayState = {
  showCounts: boolean;
  showRulers: boolean;
  showStress: boolean;
  /** Metered lines — tokens used as-is for ruler geometry. */
  lines: readonly MeteredLine[];
  textLines: readonly string[];
};

const EMPTY: MeterOverlayState = {
  showCounts: false,
  showRulers: false,
  showStress: false,
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

function statusClass(status: MeterStatus): string {
  if (status === "exact") return "lyriic-count--exact";
  if (status === "over") return "lyriic-count--over";
  if (status === "stress") return "lyriic-count--stress";
  return "lyriic-count--subtle";
}

function tickClass(syllable: number, target: number | null): string {
  if (target !== null && syllable === target) return "lyriic-ruler-tick--target";
  if (target !== null && syllable > target) return "lyriic-ruler-tick--over";
  return "lyriic-ruler-tick";
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
      const { showCounts, showRulers, showStress, lines, textLines } =
        getMeterOverlay(view);
      if (!showCounts && !showRulers && !showStress) {
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

        let lineCoords: { top: number; bottom: number } | null = null;
        try {
          const coords = view.coordsAtPos(line.from);
          if (coords) lineCoords = coords;
        } catch {
          // jsdom lacks Range.getClientRects; skip geometry in tests.
          continue;
        }
        if (!lineCoords) continue;

        const top = lineCoords.top - hostRect.top;
        if (top + 24 < 0 || top > hostRect.height) continue;

        if (showRulers && overlay.tokens.length > 0) {
          const tickCount = rulerSyllableCount(total, overlay.target);
          for (let s = 1; s <= tickCount; s++) {
            const offset = mapSyllableToOffset(overlay.tokens, s);
            if (offset === null) continue;
            const pos = Math.min(line.from + offset, line.to);
            let tickCoords: { left: number; bottom: number } | null = null;
            try {
              tickCoords = view.coordsAtPos(pos);
            } catch {
              continue;
            }
            if (!tickCoords) continue;

            const tick = document.createElement("span");
            tick.className = tickClass(s, overlay.target);
            tick.style.left = `${tickCoords.left - hostRect.left}px`;
            tick.style.top = `${tickCoords.bottom - hostRect.top}px`;
            frag.append(tick);
          }
        }

        if (showStress && overlay.tokens.length > 0) {
          for (const token of overlay.tokens) {
            for (let i = 0; i < token.stress.length; i++) {
              if (token.stress[i] === 0) continue;
              const syllable = token.syllableStart + i + 1;
              const offset = mapSyllableMidpointToOffset(
                overlay.tokens,
                syllable,
              );
              if (offset === null) continue;
              const pos = Math.min(line.from + offset, line.to);
              let markCoords: { left: number; bottom: number } | null = null;
              try {
                markCoords = view.coordsAtPos(pos);
              } catch {
                continue;
              }
              if (!markCoords) continue;

              const mark = document.createElement("span");
              mark.className = "lyriic-stress-mark";
              mark.style.left = `${markCoords.left - hostRect.left}px`;
              mark.style.top = `${markCoords.bottom - hostRect.top}px`;
              frag.append(mark);
            }
          }
        }

        if (showCounts) {
          const el = document.createElement("span");
          el.className = `lyriic-count ${statusClass(overlay.status)}`;
          el.style.top = `${top}px`;
          el.style.left = `${left}px`;
          el.style.width = `${width}px`;

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
