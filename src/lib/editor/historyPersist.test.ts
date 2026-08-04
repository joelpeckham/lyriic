import { history, isolateHistory, undo } from "@codemirror/commands";
import { EditorState, Transaction } from "@codemirror/state";
import { describe, expect, it } from "vitest";

import {
  PERSISTED_HISTORY_DEPTH,
  capPersistedHistory,
  createEditorStateWithHistory,
  historyMatchesDoc,
  serializeEditorHistory,
} from "./historyPersist";

function stateWithHistory(doc: string, historyJson?: unknown): EditorState {
  return createEditorStateWithHistory({
    doc,
    extensions: [history()],
    history: historyJson,
  });
}

function edit(
  state: EditorState,
  insert: string,
  from: number,
  time: number,
): EditorState {
  return state.update({
    changes: { from, to: from, insert },
    annotations: [isolateHistory.of("full"), Transaction.time.of(time)],
  }).state;
}

describe("capPersistedHistory", () => {
  it("truncates done/undone to the persisted depth", () => {
    const done = Array.from({ length: PERSISTED_HISTORY_DEPTH + 10 }, (_, i) => i);
    const undone = Array.from({ length: 3 }, (_, i) => i);
    const capped = capPersistedHistory({ done, undone }) as {
      done: number[];
      undone: number[];
    };
    expect(capped.done).toHaveLength(PERSISTED_HISTORY_DEPTH);
    expect(capped.done[0]).toBe(10);
    expect(capped.undone).toEqual(undone);
  });
});

describe("serialize / restore undo", () => {
  it("round-trips edits so undo restores the prior document", () => {
    let state = stateWithHistory("");
    state = edit(state, "hello", 0, 1);
    state = edit(state, " world", 5, 10_000);
    expect(state.doc.toString()).toBe("hello world");

    const serialized = serializeEditorHistory(state);
    expect(serialized).toBeDefined();
    expect(historyMatchesDoc(serialized, "hello world")).toBe(true);

    let restored = stateWithHistory("hello world", serialized);
    expect(restored.doc.toString()).toBe("hello world");

    const undone = undo({
      state: restored,
      dispatch: (tr) => {
        restored = tr.state;
      },
    });
    expect(undone).toBe(true);
    expect(restored.doc.toString()).toBe("hello");
  });

  it("falls back to an empty stack when history JSON is corrupt", () => {
    const state = stateWithHistory("kept text", {
      done: [{ changes: "not-a-changeset" }],
      undone: [],
    });
    expect(state.doc.toString()).toBe("kept text");
    expect(serializeEditorHistory(state)).toBeUndefined();
  });

  it("falls back when history tip length mismatches the document", () => {
    let state = stateWithHistory("");
    state = edit(state, "hello world", 0, 1);
    const serialized = serializeEditorHistory(state);
    expect(serialized).toBeDefined();
    expect(historyMatchesDoc(serialized, "hello")).toBe(false);

    const restored = stateWithHistory("hello", serialized);
    expect(restored.doc.toString()).toBe("hello");
    expect(serializeEditorHistory(restored)).toBeUndefined();

    // Undo must not throw; empty stack → no-op.
    let next = restored;
    expect(() => {
      undo({
        state: next,
        dispatch: (tr) => {
          next = tr.state;
        },
      });
    }).not.toThrow();
    expect(next.doc.toString()).toBe("hello");

    // IME compose must not throw after discarding mismatched history.
    expect(() => {
      restored.update({
        changes: { from: 5, insert: "x" },
        userEvent: "input.type.compose",
      });
    }).not.toThrow();
  });
});

describe("historyMatchesDoc", () => {
  it("accepts empty done/undone stacks", () => {
    expect(historyMatchesDoc({ done: [], undone: [] }, "any")).toBe(true);
  });

  it("rejects shallow shapes that are not CM change-sets", () => {
    expect(
      historyMatchesDoc({ done: [{ x: 1 }], undone: [] }, "text"),
    ).toBe(false);
  });
});
