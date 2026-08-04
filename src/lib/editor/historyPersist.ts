import { historyField } from "@codemirror/commands";
import { ChangeSet, EditorState, type Extension } from "@codemirror/state";

/** Named field map for EditorState.toJSON / fromJSON. */
export const HISTORY_JSON_FIELDS = { history: historyField };

/** Max undo/redo events kept in localStorage (in-session CM depth stays default). */
export const PERSISTED_HISTORY_DEPTH = 50;

type HistoryJson = {
  done: unknown[];
  undone: unknown[];
};

/** Keep only a shallow CM history shape; never reject a draft for bad history. */
export function normalizeHistory(raw: unknown): HistoryJson | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const h = raw as Record<string, unknown>;
  if (!Array.isArray(h.done) || !Array.isArray(h.undone)) return undefined;
  return { done: h.done, undone: h.undone };
}

/** Structural equality for persisted history JSON (order-sensitive). */
export function historyJsonEqual(
  a: unknown | undefined,
  b: unknown | undefined,
): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function tipChangeSetLength(stack: unknown[]): number | null {
  if (stack.length === 0) return null;
  const tip = stack[stack.length - 1];
  if (!tip || typeof tip !== "object") return null;
  const changes = (tip as Record<string, unknown>).changes;
  if (changes === undefined) return null;
  try {
    return ChangeSet.fromJSON(changes).length;
  } catch {
    return null;
  }
}

/**
 * True when tip change-sets in done/undone match `doc.length`.
 * Empty stacks are valid. Mismatched tips break undo and IME compose.
 */
export function historyMatchesDoc(history: unknown, doc: string): boolean {
  const normalized = normalizeHistory(history);
  if (normalized === undefined) return false;

  const docLen = doc.length;
  for (const stack of [normalized.done, normalized.undone]) {
    if (stack.length === 0) continue;
    const tipLen = tipChangeSetLength(stack);
    if (tipLen === null || tipLen !== docLen) return false;
  }
  return true;
}

/** Cap done/undone arrays before writing to localStorage. */
export function capPersistedHistory(raw: unknown): unknown | undefined {
  const normalized = normalizeHistory(raw);
  if (normalized === undefined) return undefined;
  return {
    done: normalized.done.slice(-PERSISTED_HISTORY_DEPTH),
    undone: normalized.undone.slice(-PERSISTED_HISTORY_DEPTH),
  };
}

/** Serialize CM history for draft persistence. Undefined when empty/unavailable. */
export function serializeEditorHistory(
  state: EditorState,
): unknown | undefined {
  try {
    const json = state.toJSON(HISTORY_JSON_FIELDS) as {
      history?: unknown;
    };
    const capped = capPersistedHistory(json.history);
    if (capped === undefined) return undefined;
    const { done, undone } = capped as HistoryJson;
    if (done.length === 0 && undone.length === 0) return undefined;
    return capped;
  } catch {
    return undefined;
  }
}

export type CreateEditorStateOptions = {
  doc: string;
  extensions: Extension[];
  history?: unknown;
};

/**
 * Build editor state, restoring persisted history when valid.
 * Falls back to a fresh empty stack on any deserialize failure.
 */
export function createEditorStateWithHistory({
  doc,
  extensions,
  history,
}: CreateEditorStateOptions): EditorState {
  const normalized = normalizeHistory(history);
  if (normalized === undefined || !historyMatchesDoc(normalized, doc)) {
    return EditorState.create({ doc, extensions });
  }

  try {
    const cursor = doc.length;
    return EditorState.fromJSON(
      {
        doc,
        selection: { ranges: [{ anchor: cursor, head: cursor }], main: 0 },
        history: normalized,
      },
      { extensions },
      HISTORY_JSON_FIELDS,
    );
  } catch {
    return EditorState.create({ doc, extensions });
  }
}
