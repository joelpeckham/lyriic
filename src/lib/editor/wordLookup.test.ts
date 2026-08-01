import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  openRhymeCommand,
  openThesaurusCommand,
  replaceWordRange,
  wordLookupExtension,
  type WordLookupRequest,
} from "./wordLookup";

describe("wordLookup", () => {
  let parent: HTMLDivElement;
  let view: EditorView;

  afterEach(() => {
    view.destroy();
    parent.remove();
  });

  function mount(doc: string, onOpen: (req: WordLookupRequest) => void) {
    parent = document.createElement("div");
    document.body.appendChild(parent);
    view = new EditorView({
      parent,
      state: EditorState.create({
        doc,
        extensions: [wordLookupExtension(onOpen)],
      }),
    });
  }

  it("opens thesaurus for the word at the caret via command", () => {
    const onOpen = vi.fn();
    mount("soft silent fire", onOpen);
    // Place caret inside "silent"
    view.dispatch({ selection: { anchor: 7 } });
    expect(openThesaurusCommand(view)).toBe(true);
    expect(onOpen).toHaveBeenCalledOnce();
    const req = onOpen.mock.calls[0]?.[0] as WordLookupRequest;
    expect(req).toMatchObject({
      mode: "thesaurus",
      raw: "silent",
      word: "silent",
      from: 5,
      to: 11,
      lineIndex: 0,
    });
  });

  it("opens rhyme for the word at the caret via command", () => {
    const onOpen = vi.fn();
    mount("soft silent fire", onOpen);
    view.dispatch({ selection: { anchor: 7 } });
    expect(openRhymeCommand(view)).toBe(true);
    expect(onOpen).toHaveBeenCalledOnce();
    const req = onOpen.mock.calls[0]?.[0] as WordLookupRequest;
    expect(req).toMatchObject({
      mode: "rhyme",
      raw: "silent",
      word: "silent",
      from: 5,
      to: 11,
      lineIndex: 0,
    });
  });

  it("replaces a word range in place", () => {
    const onOpen = vi.fn();
    mount("soft silent fire", onOpen);
    replaceWordRange(view, 5, 11, "quiet");
    expect(view.state.doc.toString()).toBe("soft quiet fire");
  });
});
