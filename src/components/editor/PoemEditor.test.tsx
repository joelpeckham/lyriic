import { cleanup, render, renderHook, waitFor } from "@testing-library/react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PoemEditor } from "@/components/editor/PoemEditor";
import { useSyllableLineCounts } from "@/components/editor/useSyllableLineCounts";
import { createPoemExtensions } from "@/lib/editor/createPoemExtensions";
import { DEFAULT_SETTINGS } from "@/lib/settings";

afterEach(() => {
  cleanup();
});

describe("PoemEditor", () => {
  it("renders a single poem textbox with a11y attributes", async () => {
    const { container } = render(
      <PoemEditor
        value="hello"
        onChange={() => {}}
        settings={DEFAULT_SETTINGS}
        overrides={{}}
        onSetOverride={() => {}}
        onClearOverride={() => {}}
        documentKey="draft-1"
      />,
    );

    const content = await waitFor(() => {
      const el = container.querySelector(".cm-content");
      expect(el).toBeTruthy();
      return el as HTMLElement;
    });

    expect(content.getAttribute("aria-label")).toBe("Poem");
    expect(content.getAttribute("aria-multiline")).toBe("true");
    expect(container.querySelector("#poem")).toBeTruthy();
    // One contenteditable surface — not one field per line.
    expect(container.querySelectorAll(".cm-content").length).toBe(1);
    // Overlay host mounts even when geometry is unavailable (jsdom).
    await waitFor(() => {
      expect(container.querySelector(".lyriic-syllable-overlay")).toBeTruthy();
    });
  });

  it("counts with threaded empty overrides on first render", () => {
    const { result } = renderHook(() =>
      useSyllableLineCounts("a fire", "project-b", "", {}),
    );

    expect(result.current.counts[0]?.total).toBe(1 + 2);
  });

  it("applies project overrides on first render", () => {
    const { result } = renderHook(() =>
      useSyllableLineCounts("a fire", "project-a", "fire:1", { fire: 1 }),
    );

    expect(result.current.counts[0]?.total).toBe(2);
  });
});

describe("createPoemExtensions", () => {
  it("reports document and active-line changes", () => {
    const onDocChange = vi.fn();
    const onActiveLineChange = vi.fn();
    const parent = document.createElement("div");
    document.body.appendChild(parent);

    const view = new EditorView({
      parent,
      state: EditorState.create({
        doc: "hello",
        extensions: createPoemExtensions({
          onDocChange,
          onActiveLineChange,
        }),
      }),
    });

    view.dispatch({
      changes: { from: 5, insert: "\nworld" },
      selection: { anchor: 11 },
    });

    expect(onDocChange).toHaveBeenCalledWith("hello\nworld");
    expect(onActiveLineChange).toHaveBeenCalledWith(1);

    view.destroy();
    parent.remove();
  });
});
