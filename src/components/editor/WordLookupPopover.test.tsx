import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WordLookupPopover } from "@/components/editor/WordLookupPopover";
import {
  replaceWordRange,
  type WordLookupRequest,
} from "@/lib/editor/wordLookup";
import type { MeteredLine } from "@/lib/meters/types";
import { __setRhymeDataForTests } from "@/lib/rhyme/lookup";
import { __setThesaurusDataForTests } from "@/lib/thesaurus/lookup";
import { clearRankedCache } from "@/lib/wordLookup";

describe("WordLookupPopover", () => {
  let parent: HTMLDivElement;
  let view: EditorView;

  beforeEach(() => {
    clearRankedCache();
    __setThesaurusDataForTests({
      silent: ["quiet", "mute", "hushed"],
    });
    __setRhymeDataForTests({
      byWord: {
        silent: "AY1 L AH0 N T",
        violent: "AY1 L AH0 N T",
      },
      byKey: {
        "AY1 L AH0 N T": ["silent", "violent"],
      },
    });
    parent = document.createElement("div");
    document.body.appendChild(parent);
    view = new EditorView({
      parent,
      state: EditorState.create({ doc: "soft silent fire" }),
    });
  });

  afterEach(() => {
    cleanup();
    __setThesaurusDataForTests(null);
    __setRhymeDataForTests(null);
    clearRankedCache();
    view.destroy();
    parent.remove();
  });

  const meteredLine: MeteredLine = {
    total: 4,
    target: 5,
    status: "under",
    tokens: [
      {
        raw: "soft",
        word: "soft",
        start: 0,
        end: 4,
        syllables: 1,
        syllableStart: 0,
        syllableEnd: 1,
        source: "dict",
      },
      {
        raw: "silent",
        word: "silent",
        start: 5,
        end: 11,
        syllables: 2,
        syllableStart: 1,
        syllableEnd: 3,
        source: "dict",
      },
      {
        raw: "fire",
        word: "fire",
        start: 12,
        end: 16,
        syllables: 1,
        syllableStart: 3,
        syllableEnd: 4,
        source: "dict",
      },
    ],
  };

  const request: WordLookupRequest = {
    mode: "thesaurus",
    from: 5,
    to: 11,
    raw: "silent",
    word: "silent",
    lineIndex: 0,
    lineFrom: 0,
    anchor: { left: 10, right: 40, top: 10, bottom: 28 },
  };

  it("lists synonyms and replaces the word in the editor", async () => {
    const onClose = vi.fn();
    render(
      <WordLookupPopover
        request={request}
        onClose={onClose}
        onReplace={(from, to, insert) => {
          replaceWordRange(view, from, to, insert);
        }}
        onRestoreFocus={() => view.focus()}
        meteredLine={meteredLine}
        overrides={{}}
        overrideRevision=""
      />,
    );

    const quiet = await waitFor(() =>
      screen.getByRole("option", { name: /quiet/i }),
    );
    expect(screen.getByRole("option", { name: /mute/i })).toBeTruthy();

    fireEvent.click(quiet);

    expect(view.state.doc.toString()).toBe("soft quiet fire");
    expect(onClose).toHaveBeenCalled();
  });

  it("lists rhymes and replaces the word in the editor", async () => {
    const onClose = vi.fn();
    const rhymeRequest: WordLookupRequest = {
      ...request,
      mode: "rhyme",
    };
    render(
      <WordLookupPopover
        request={rhymeRequest}
        onClose={onClose}
        onReplace={(from, to, insert) => {
          replaceWordRange(view, from, to, insert);
        }}
        onRestoreFocus={() => view.focus()}
        meteredLine={meteredLine}
        overrides={{}}
        overrideRevision=""
      />,
    );

    const violent = await waitFor(() =>
      screen.getByRole("option", { name: /violent/i }),
    );
    expect(screen.getByText("Rhymes for silent")).toBeTruthy();

    fireEvent.click(violent);

    expect(view.state.doc.toString()).toBe("soft violent fire");
    expect(onClose).toHaveBeenCalled();
  });
});
