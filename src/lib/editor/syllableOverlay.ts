import {
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";

import { getMeterOverlay } from "@/lib/editor/meterOverlay";
import type { MeterStatus } from "@/lib/meters";

function statusClass(status: MeterStatus): string {
  if (status === "exact") return "lyriic-count--exact";
  if (status === "over") return "lyriic-count--over";
  return "lyriic-count--subtle";
}

/**
 * Syllable totals on the editor host (sibling of `.cm-editor`).
 * Meter data comes from `setMeterOverlayData`; positions use `coordsAtPos`.
 */
export const syllableOverlay = ViewPlugin.fromClass(
  class {
    readonly dom: HTMLElement;
    private host: HTMLElement | null = null;
    private rafId: number | null = null;

    constructor(view: EditorView) {
      this.dom = document.createElement("div");
      this.dom.className = "lyriic-syllable-overlay";
      this.dom.setAttribute("aria-hidden", "true");
      this.mount(view);
      // Defer first paint until layout exists.
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.draw(view);
      });
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

    update(update: ViewUpdate) {
      if (!this.dom.isConnected) {
        this.mount(update.view);
      }
      if (
        update.docChanged ||
        update.viewportChanged ||
        update.geometryChanged
      ) {
        this.draw(update.view);
      }
    }

    /** Called from React after meter data changes. */
    redraw(view: EditorView) {
      this.draw(view);
    }

    draw(view: EditorView) {
      const { showCounts, lines } = getMeterOverlay(view);
      if (!showCounts) {
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
        if (total <= 0 && !overlay.lineHasText) continue;

        let coords: { top: number } | null = null;
        try {
          coords = view.coordsAtPos(line.from);
        } catch {
          // jsdom lacks Range.getClientRects; skip geometry in tests.
          continue;
        }
        if (!coords) continue;

        const top = coords.top - hostRect.top;
        if (top + 24 < 0 || top > hostRect.height) continue;

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

      this.dom.replaceChildren(frag);
    }

    destroy() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.dom.remove();
      this.host = null;
    }
  },
);

/** Look up the active syllable overlay plugin instance on a view. */
export function getSyllableOverlay(view: EditorView) {
  return view.plugin(syllableOverlay);
}
