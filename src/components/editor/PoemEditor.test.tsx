import {
  cleanup,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PoemEditor } from "@/components/editor/PoemEditor";
import { useSyllableLineCounts } from "@/components/editor/useSyllableLineCounts";
import { createPoemExtensions } from "@/lib/editor/createPoemExtensions";
import { openThesaurusCommand } from "@/lib/editor/wordLookup";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { clearAllOverrides, setOverride } from "@/lib/syllables";
import { __setThesaurusDataForTests } from "@/lib/thesaurus/lookup";

afterEach(() => {
  cleanup();
  clearAllOverrides();
  __setThesaurusDataForTests(null);
});

const editorProps = {
  settings: DEFAULT_SETTINGS,
  overrides: {},
  onSetOverride: () => {},
  onClearOverride: () => {},
  documentKey: "draft-1",
} as const;

describe("PoemEditor", () => {
  it("renders a single poem textbox with a11y attributes", async () => {
    const { container } = render(
      <PoemEditor value="hello" onChange={() => {}} {...editorProps} />,
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

  it("does not re-fire onChange when syncing an external value", async () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <PoemEditor value="hello" onChange={onChange} {...editorProps} />,
    );

    await waitFor(() => {
      expect(container.querySelector(".cm-content")).toBeTruthy();
    });
    onChange.mockClear();

    rerender(
      <PoemEditor value="world" onChange={onChange} {...editorProps} />,
    );

    await waitFor(() => {
      const view = EditorView.findFromDOM(
        container.querySelector(".cm-content") as HTMLElement,
      );
      expect(view?.state.doc.toString()).toBe("world");
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("closes word lookup when the document changes", async () => {
    __setThesaurusDataForTests({ hello: ["hi"] });
    const { container } = render(
      <PoemEditor value="hello world" onChange={() => {}} {...editorProps} />,
    );

    const content = await waitFor(() => {
      const el = container.querySelector(".cm-content");
      expect(el).toBeTruthy();
      return el as HTMLElement;
    });
    const view = EditorView.findFromDOM(content);
    expect(view).toBeTruthy();

    view!.dispatch({ selection: { anchor: 1 } });
    expect(openThesaurusCommand(view!)).toBe(true);

    await waitFor(() => {
      expect(screen.getByText("Synonyms for hello")).toBeTruthy();
    });

    view!.dispatch({ changes: { from: 11, insert: "!" } });

    await waitFor(() => {
      expect(screen.queryByText("Synonyms for hello")).toBeNull();
    });
  });

  it("counts with threaded overrides on first render despite stale module Map", () => {
    // Prior project left fire=1 in the module Map; layout sync has not run.
    setOverride("fire", 1);

    const { result } = renderHook(() =>
      useSyllableLineCounts("a fire", "project-b", "", {}),
    );

    // Empty project overrides must win over the stale Map immediately.
    expect(result.current.counts[0]?.total).toBe(1 + 2);
  });

  it("applies project overrides on first render without module Map sync", () => {
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
