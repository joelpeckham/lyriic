import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { afterEach, describe, expect, it } from "vitest";

import { getSyllableOverlay, syllableOverlay } from "./syllableOverlay";

describe("syllableOverlay", () => {
  let parent: HTMLDivElement;
  let view: EditorView;

  afterEach(() => {
    view.destroy();
    parent.remove();
  });

  it("clears overlay DOM on docChanged", () => {
    parent = document.createElement("div");
    document.body.appendChild(parent);
    view = new EditorView({
      parent,
      state: EditorState.create({
        doc: "hello",
        extensions: [syllableOverlay],
      }),
    });

    const plugin = getSyllableOverlay(view);
    expect(plugin).toBeTruthy();

    const stale = document.createElement("span");
    stale.className = "stale-tick";
    plugin!.dom.append(stale);
    expect(plugin!.dom.querySelector(".stale-tick")).toBeTruthy();

    view.dispatch({ changes: { from: 5, insert: "!" } });

    expect(plugin!.dom.children.length).toBe(0);
  });
});
