import { history, isolateHistory } from "@codemirror/commands";
import { Transaction } from "@codemirror/state";
import { describe, expect, it } from "vitest";

import {
  createEditorStateWithHistory,
  normalizeHistory,
  serializeEditorHistory,
} from "@/lib/editor/historyPersist";

import {
  parseProjectsState,
  saveProjectsState,
  stripProjectsHistory,
} from "./storage";
import type { ProjectsState } from "./types";

const baseProject = {
  id: "p1",
  name: "Draft",
  text: "soft rain",
  settings: {
    meter: "none",
    showCounts: true,
    showRulers: false,
    showStress: false,
    showMeterBreaks: false,
    showRhymeScheme: false,
    rhymeSchemeId: null,
    customPattern: [],
    customFoot: "iamb" as const,
    customRhymePattern: "",
  },
  overrides: {},
  stressOverrides: {},
  updatedAt: 1_700_000_000_000,
};

function v1State(
  projects: unknown[],
  activeId = "p1",
): Record<string, unknown> {
  return { version: 1, activeId, projects };
}

function realHistoryFor(doc: string): unknown {
  let state = createEditorStateWithHistory({
    doc: "",
    extensions: [history()],
  });
  state = state.update({
    changes: { from: 0, insert: doc },
    annotations: [isolateHistory.of("full"), Transaction.time.of(1)],
  }).state;
  expect(state.doc.toString()).toBe(doc);
  return serializeEditorHistory(state);
}

describe("normalizeHistory", () => {
  it("accepts a shallow done/undone shape", () => {
    const historyJson = { done: [{ changes: [] }], undone: [] };
    expect(normalizeHistory(historyJson)).toEqual(historyJson);
  });

  it("drops invalid shapes without throwing", () => {
    expect(normalizeHistory(null)).toBeUndefined();
    expect(normalizeHistory("x")).toBeUndefined();
    expect(normalizeHistory({ done: [] })).toBeUndefined();
    expect(normalizeHistory({ done: "nope", undone: [] })).toBeUndefined();
  });
});

describe("parseProjectsState history soft-migrate", () => {
  it("parses legacy drafts with no history field", () => {
    const parsed = parseProjectsState(v1State([baseProject]));
    expect(parsed).not.toBeNull();
    expect(parsed!.projects[0]!.text).toBe("soft rain");
    expect(parsed!.projects[0]!.history).toBeUndefined();
    expect(parsed!.projects[0]!.settings.meter).toBe("none");
  });

  it("keeps real CM history on round-trip parse", () => {
    const historyJson = realHistoryFor("soft rain");
    expect(historyJson).toBeDefined();
    const parsed = parseProjectsState(
      v1State([{ ...baseProject, history: historyJson }]),
    );
    expect(parsed!.projects[0]!.history).toEqual(historyJson);
  });

  it("keeps shallow done/undone shapes in project state (validated at restore)", () => {
    // Soft-migrate retains array-shaped history; restore-time checks tip length.
    const historyJson = { done: [{ x: 1 }], undone: [{ y: 2 }] };
    const parsed = parseProjectsState(
      v1State([{ ...baseProject, history: historyJson }]),
    );
    expect(parsed!.projects[0]!.history).toEqual(historyJson);
  });

  it("drops invalid history without failing the project", () => {
    const parsed = parseProjectsState(
      v1State([{ ...baseProject, history: { done: "bad" } }]),
    );
    expect(parsed).not.toBeNull();
    expect(parsed!.projects[0]!.text).toBe("soft rain");
    expect(parsed!.projects[0]!.history).toBeUndefined();
  });
});

describe("stripProjectsHistory / quota fallback", () => {
  it("removes history from all projects", () => {
    const state: ProjectsState = {
      version: 1,
      activeId: "p1",
      projects: [
        { ...baseProject, history: { done: [], undone: [] } },
        { ...baseProject, id: "p2", name: "Other" },
      ],
    };
    const stripped = stripProjectsHistory(state);
    expect(stripped.projects[0]!.history).toBeUndefined();
    expect(stripped.projects[0]!.text).toBe("soft rain");
    expect(stripped).not.toBe(state);
  });

  it("retries save without history when quota is exceeded", () => {
    let writes = 0;
    let lastPayload: string | undefined;
    const storage = {
      setItem(_key: string, value: string) {
        writes += 1;
        if (writes === 1) {
          const err = new DOMException(
            "Quota exceeded",
            "QuotaExceededError",
          );
          throw err;
        }
        lastPayload = value;
      },
    };
    const state: ProjectsState = {
      version: 1,
      activeId: "p1",
      projects: [{ ...baseProject, history: { done: [1], undone: [] } }],
    };
    const result = saveProjectsState(state, storage);
    expect(result).toEqual({ ok: true, strippedHistory: true });
    expect(writes).toBe(2);
    expect(lastPayload).toBeDefined();
    const parsed = JSON.parse(lastPayload!) as {
      projects: Array<{ history?: unknown; text: string }>;
    };
    expect(parsed.projects[0]!.history).toBeUndefined();
    expect(parsed.projects[0]!.text).toBe("soft rain");
  });
});
