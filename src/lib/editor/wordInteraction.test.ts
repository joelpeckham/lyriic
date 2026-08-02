import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { WORD_HIT_ATTR } from "./resolveWordTarget";
import {
  dismissWordToolbar,
  HOVER_HIDE_MS,
  HOVER_SHOW_MS,
  LONG_PRESS_MS,
  setWordToolbarSticky,
  WORD_TOOLBAR_ATTR,
  wordInteractionExtension,
  type WordLookupRequest,
  type WordTarget,
} from "./wordInteraction";

function pointerEvent(type: string, init: PointerEventInit): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerType: "mouse",
    button: 0,
    buttons: type === "pointerdown" ? 1 : 0,
    ...init,
  });
}

describe("wordInteraction plugin", () => {
  let parent: HTMLDivElement;
  let view: EditorView;
  let toolbar: WordTarget | null;
  let lookups: WordLookupRequest[];

  beforeEach(() => {
    vi.useFakeTimers();
    toolbar = null;
    lookups = [];
    parent = document.createElement("div");
    document.body.appendChild(parent);
    view = new EditorView({
      parent,
      state: EditorState.create({
        doc: "soft silent fire",
        extensions: [
          wordInteractionExtension({
            onToolbarChange: (target) => {
              toolbar = target;
            },
            onOpenLookup: (request) => {
              lookups.push(request);
            },
          }),
        ],
      }),
    });

    // Glyph boxes: "soft" 10–50, "silent" 60–120, "fire" 130–170 at y 20–36.
    vi.spyOn(view, "coordsAtPos").mockImplementation((pos: number) => {
      if (pos <= 0) return { left: 10, right: 10, top: 20, bottom: 36 };
      if (pos <= 4) return { left: 10 + pos * 10, right: 10 + pos * 10, top: 20, bottom: 36 };
      if (pos <= 5) return { left: 60, right: 60, top: 20, bottom: 36 };
      if (pos <= 11) {
        const t = (pos - 5) / 6;
        const x = 60 + t * 60;
        return { left: x, right: x, top: 20, bottom: 36 };
      }
      if (pos <= 12) return { left: 130, right: 130, top: 20, bottom: 36 };
      if (pos <= 16) {
        const t = (pos - 12) / 4;
        const x = 130 + t * 40;
        return { left: x, right: x, top: 20, bottom: 36 };
      }
      return { left: 170, right: 170, top: 20, bottom: 36 };
    });

    vi.spyOn(view, "posAtCoords").mockImplementation((coords) => {
      const x = coords.x;
      if (x >= 10 && x <= 50) return 2; // soft
      if (x >= 60 && x <= 120) return 7; // silent
      if (x >= 130 && x <= 170) return 14; // fire
      return null;
    });
  });

  afterEach(() => {
    view.destroy();
    parent.remove();
    vi.useRealTimers();
  });

  function moveOnEditor(x: number, y: number) {
    view.dom.dispatchEvent(
      pointerEvent("pointermove", { clientX: x, clientY: y }),
    );
  }

  /** Dispatch on `from` so capture listeners see the correct event.target. */
  function moveFrom(from: EventTarget, x: number, y: number) {
    from.dispatchEvent(
      pointerEvent("pointermove", { clientX: x, clientY: y }),
    );
  }

  it("shows the toolbar after hover delay over a word", () => {
    moveOnEditor(80, 28);
    expect(toolbar).toBeNull();
    vi.advanceTimersByTime(HOVER_SHOW_MS);
    expect(toolbar).toMatchObject({ word: "silent", from: 5, to: 11 });
  });

  it("keeps the pin when the pointer moves onto the hit layer", () => {
    moveOnEditor(80, 28);
    vi.advanceTimersByTime(HOVER_SHOW_MS);
    expect(toolbar?.word).toBe("silent");

    const hit = document.createElement("span");
    hit.setAttribute(WORD_HIT_ATTR, "");
    document.body.appendChild(hit);

    moveFrom(hit, 80, 48);
    vi.advanceTimersByTime(HOVER_HIDE_MS);
    expect(toolbar?.word).toBe("silent");

    hit.remove();
  });

  it("keeps the pin when the pointer is over the toolbar", () => {
    moveOnEditor(80, 28);
    vi.advanceTimersByTime(HOVER_SHOW_MS);

    const bar = document.createElement("div");
    bar.setAttribute(WORD_TOOLBAR_ATTR, "");
    document.body.appendChild(bar);

    moveFrom(bar, 200, 200);
    vi.advanceTimersByTime(HOVER_HIDE_MS);
    expect(toolbar?.word).toBe("silent");

    bar.remove();
  });

  it("hides after leaving the word, hit layer, and toolbar", () => {
    moveOnEditor(80, 28);
    vi.advanceTimersByTime(HOVER_SHOW_MS);
    expect(toolbar?.word).toBe("silent");

    moveFrom(document.body, 400, 400);
    vi.advanceTimersByTime(HOVER_HIDE_MS);
    expect(toolbar).toBeNull();
  });

  it("sticky blocks leave hide", () => {
    moveOnEditor(80, 28);
    vi.advanceTimersByTime(HOVER_SHOW_MS);
    setWordToolbarSticky(view, true);

    moveFrom(document.body, 400, 400);
    vi.advanceTimersByTime(HOVER_HIDE_MS);
    expect(toolbar?.word).toBe("silent");

    setWordToolbarSticky(view, false);
    moveFrom(document.body, 400, 400);
    vi.advanceTimersByTime(HOVER_HIDE_MS);
    expect(toolbar).toBeNull();
  });

  it("opens on tap without waiting for hover", () => {
    view.dom.dispatchEvent(
      pointerEvent("pointerdown", { clientX: 80, clientY: 28 }),
    );
    view.dom.dispatchEvent(
      pointerEvent("pointerup", { clientX: 80, clientY: 28 }),
    );
    expect(toolbar).toMatchObject({ word: "silent" });
  });

  it("opens thesaurus on long-press and suppresses tap", () => {
    view.dom.dispatchEvent(
      pointerEvent("pointerdown", { clientX: 80, clientY: 28 }),
    );
    vi.advanceTimersByTime(LONG_PRESS_MS);
    expect(lookups).toHaveLength(1);
    expect(lookups[0]).toMatchObject({ mode: "thesaurus", word: "silent" });

    view.dom.dispatchEvent(
      pointerEvent("pointerup", { clientX: 80, clientY: 28 }),
    );
    // Long-press dismisses hover toolbar via openWordLookup; no tap open.
    expect(toolbar).toBeNull();
  });

  it("dismissWordToolbar clears the open target", () => {
    moveOnEditor(80, 28);
    vi.advanceTimersByTime(HOVER_SHOW_MS);
    dismissWordToolbar(view);
    expect(toolbar).toBeNull();
  });
});
