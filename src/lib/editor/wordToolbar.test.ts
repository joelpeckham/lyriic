import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  HOVER_HIDE_MS,
  HOVER_SHOW_MS,
  dismissWordToolbar,
  setWordToolbarPopoverHovered,
  setWordToolbarSticky,
  wordToolbarExtension,
  type WordToolbarTarget,
} from "./wordToolbar";

describe("wordToolbar", () => {
  let parent: HTMLDivElement;
  let view: EditorView;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    view.destroy();
    parent.remove();
    vi.useRealTimers();
  });

  function mount(doc: string, onChange: (t: WordToolbarTarget | null) => void) {
    parent = document.createElement("div");
    document.body.appendChild(parent);
    view = new EditorView({
      parent,
      state: EditorState.create({
        doc,
        extensions: [wordToolbarExtension(onChange)],
      }),
    });
  }

  function openViaTap(pos: number) {
    vi.spyOn(view, "posAtCoords").mockReturnValue(pos);
    view.dom.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        clientX: 12,
        clientY: 12,
      }),
    );
    view.dom.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        button: 0,
        clientX: 12,
        clientY: 12,
      }),
    );
  }

  it("shows the toolbar after a hover debounce on a word", () => {
    const onChange = vi.fn();
    mount("soft silent fire", onChange);
    vi.spyOn(view, "posAtCoords").mockReturnValue(7);

    view.dom.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 12,
        clientY: 12,
        pointerType: "mouse",
      }),
    );

    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(HOVER_SHOW_MS - 1);
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);

    expect(onChange).toHaveBeenCalledOnce();
    const target = onChange.mock.calls[0]?.[0] as WordToolbarTarget;
    expect(target).toMatchObject({
      raw: "silent",
      word: "silent",
      from: 5,
      to: 11,
    });
    expect(HOVER_HIDE_MS).toBe(120);
  });

  it("does not show for empty line margins (precise miss)", () => {
    const onChange = vi.fn();
    mount("soft silent fire", onChange);
    // CodeMirror snaps imprecise coords to first/last word; precise must win.
    vi.spyOn(view, "posAtCoords").mockReturnValue(null);

    view.dom.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 400,
        clientY: 12,
        pointerType: "mouse",
      }),
    );
    vi.advanceTimersByTime(HOVER_SHOW_MS);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("opens the toolbar on a short tap without drag", () => {
    const onChange = vi.fn();
    mount("soft silent fire", onChange);
    openViaTap(7);

    expect(onChange).toHaveBeenCalledOnce();
    const target = onChange.mock.calls[0]?.[0] as WordToolbarTarget;
    expect(target).toMatchObject({
      raw: "silent",
      word: "silent",
      from: 5,
      to: 11,
    });
  });

  it("dismisses on document change", () => {
    const onChange = vi.fn();
    mount("soft silent fire", onChange);
    openViaTap(7);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ word: "silent" }),
    );

    onChange.mockClear();
    view.dispatch({
      changes: { from: 0, insert: "x" },
    });
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("does not retarget on hover while open; hides after leave delay", () => {
    const onChange = vi.fn();
    mount("soft silent fire", onChange);
    openViaTap(7);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ word: "silent" }),
    );
    onChange.mockClear();

    // Hover a different word — must not emit a new target while pinned.
    vi.spyOn(view, "posAtCoords").mockReturnValue(14); // "fire"
    view.dom.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 40,
        clientY: 12,
        pointerType: "mouse",
      }),
    );
    expect(onChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ word: "fire" }),
    );

    vi.advanceTimersByTime(HOVER_HIDE_MS);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("does not hide on mouse leave while sticky", () => {
    const onChange = vi.fn();
    mount("soft silent fire", onChange);
    openViaTap(7);
    onChange.mockClear();

    setWordToolbarSticky(view, true);
    vi.spyOn(view, "posAtCoords").mockReturnValue(null as unknown as number);
    document.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 200,
        clientY: 200,
        pointerType: "mouse",
      }),
    );
    vi.advanceTimersByTime(HOVER_HIDE_MS * 3);
    expect(onChange).not.toHaveBeenCalled();

    setWordToolbarSticky(view, false);
    document.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 200,
        clientY: 200,
        pointerType: "mouse",
      }),
    );
    vi.advanceTimersByTime(HOVER_HIDE_MS);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("cancels hide when the popover is hovered", () => {
    const onChange = vi.fn();
    mount("soft silent fire", onChange);
    openViaTap(7);
    onChange.mockClear();

    // Leave the pinned word.
    vi.spyOn(view, "posAtCoords").mockReturnValue(null as unknown as number);
    document.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 200,
        clientY: 200,
        pointerType: "mouse",
      }),
    );

    vi.advanceTimersByTime(HOVER_HIDE_MS - 1);
    expect(onChange).not.toHaveBeenCalled();

    setWordToolbarPopoverHovered(view, true);
    vi.advanceTimersByTime(HOVER_HIDE_MS);
    expect(onChange).not.toHaveBeenCalled();

    setWordToolbarPopoverHovered(view, false);
    vi.advanceTimersByTime(HOVER_HIDE_MS);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("dismissWordToolbar clears open state without a second null emit race", () => {
    const onChange = vi.fn();
    mount("soft silent fire", onChange);
    openViaTap(7);
    onChange.mockClear();

    dismissWordToolbar(view);
    expect(onChange).toHaveBeenCalledWith(null);

    // Hover same word again should be able to reopen after dismiss.
    onChange.mockClear();
    vi.spyOn(view, "posAtCoords").mockReturnValue(7);
    view.dom.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 12,
        clientY: 12,
        pointerType: "mouse",
      }),
    );
    vi.advanceTimersByTime(HOVER_SHOW_MS);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ word: "silent" }),
    );
  });
});
