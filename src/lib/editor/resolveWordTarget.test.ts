import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  pointerHitsWordAnchor,
  WORD_HIT_PAD_PX,
  WORD_TOOLBAR_BRIDGE_MIN_WIDTH_PX,
  WORD_TOOLBAR_SIDE_OFFSET_PX,
  wordTargetAtPointer,
  wordToolbarHitCorridors,
} from "./resolveWordTarget";

const anchor = { left: 100, right: 140, top: 20, bottom: 36 };

describe("pointerHitsWordAnchor", () => {
  it("returns null for degenerate anchors", () => {
    expect(
      pointerHitsWordAnchor(10, 10, { left: 0, right: 0, top: 0, bottom: 0 }),
    ).toBeNull();
  });

  it("accepts pointers inside the box and rejects outside", () => {
    expect(pointerHitsWordAnchor(120, 28, anchor)).toBe(true);
    expect(pointerHitsWordAnchor(50, 28, anchor)).toBe(false);
    expect(pointerHitsWordAnchor(200, 28, anchor)).toBe(false);
  });
});

describe("wordToolbarHitCorridors", () => {
  it("returns null for degenerate anchors", () => {
    expect(
      wordToolbarHitCorridors({ left: 0, right: 0, top: 0, bottom: 0 }),
    ).toBeNull();
  });

  it("covers only the dead zones above and below the word pad", () => {
    const corridors = wordToolbarHitCorridors(anchor);
    expect(corridors).not.toBeNull();

    const { above, below } = corridors!;
    expect(above.top).toBe(anchor.top - WORD_TOOLBAR_SIDE_OFFSET_PX);
    expect(above.top + above.height).toBe(anchor.top - WORD_HIT_PAD_PX);
    expect(below.top).toBe(anchor.bottom + WORD_HIT_PAD_PX);
    expect(below.top + below.height).toBe(
      anchor.bottom + WORD_TOOLBAR_SIDE_OFFSET_PX,
    );

    // Glyph box is not covered — caret clicks must reach the editor.
    const wordMidY = (anchor.top + anchor.bottom) / 2;
    expect(wordMidY).toBeGreaterThan(above.top + above.height);
    expect(wordMidY).toBeLessThan(below.top);
  });

  it("widens short words to the toolbar min width", () => {
    const short = { left: 118, right: 122, top: 20, bottom: 36 };
    const corridors = wordToolbarHitCorridors(short);
    expect(corridors).not.toBeNull();
    expect(corridors!.below.width).toBe(WORD_TOOLBAR_BRIDGE_MIN_WIDTH_PX);
    const mid = (short.left + short.right) / 2;
    expect(corridors!.below.left).toBe(
      mid - WORD_TOOLBAR_BRIDGE_MIN_WIDTH_PX / 2,
    );
  });
});

describe("wordTargetAtPointer", () => {
  let parent: HTMLDivElement;
  let view: EditorView;

  afterEach(() => {
    view.destroy();
    parent.remove();
  });

  function mount(doc: string) {
    parent = document.createElement("div");
    document.body.appendChild(parent);
    view = new EditorView({
      parent,
      state: EditorState.create({ doc }),
    });
  }

  it("returns null when precise posAtCoords misses text", () => {
    mount("soft silent fire");
    vi.spyOn(view, "posAtCoords").mockReturnValue(null);

    expect(wordTargetAtPointer(view, 12, 12)).toBeNull();
    expect(view.posAtCoords).toHaveBeenCalledWith({ x: 12, y: 12 });
  });

  it("resolves a word when precise coords hit a document position", () => {
    mount("soft silent fire");
    vi.spyOn(view, "posAtCoords").mockReturnValue(7);

    const target = wordTargetAtPointer(view, 12, 12);
    expect(target).toMatchObject({
      raw: "silent",
      word: "silent",
      from: 5,
      to: 11,
    });
  });

  it("rejects when glyph geometry exists but pointer is outside the box", () => {
    mount("soft silent fire");
    vi.spyOn(view, "posAtCoords").mockReturnValue(1); // would be "soft"
    vi.spyOn(view, "coordsAtPos").mockImplementation((pos: number) => {
      // "soft" occupies x 10–50; pointer will be at x=200.
      if (pos === 0) return { left: 10, right: 10, top: 20, bottom: 36 };
      if (pos === 4) return { left: 50, right: 50, top: 20, bottom: 36 };
      return { left: 0, right: 0, top: 0, bottom: 0 };
    });

    expect(wordTargetAtPointer(view, 200, 28)).toBeNull();
  });
});
