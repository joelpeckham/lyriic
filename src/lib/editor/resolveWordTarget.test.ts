import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  pointerHitsWordAnchor,
  wordTargetAtPointer,
} from "./resolveWordTarget";

describe("pointerHitsWordAnchor", () => {
  it("returns null for degenerate anchors", () => {
    expect(
      pointerHitsWordAnchor(10, 10, { left: 0, right: 0, top: 0, bottom: 0 }),
    ).toBeNull();
  });

  it("accepts pointers inside the box and rejects outside", () => {
    const anchor = { left: 100, right: 140, top: 20, bottom: 36 };
    expect(pointerHitsWordAnchor(120, 28, anchor)).toBe(true);
    expect(pointerHitsWordAnchor(50, 28, anchor)).toBe(false);
    expect(pointerHitsWordAnchor(200, 28, anchor)).toBe(false);
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
