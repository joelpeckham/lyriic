import { describe, expect, it } from "vitest";
import {
  CORRUPT_STORAGE_KEY,
  createEmptyProject,
  createInitialState,
  getActiveProject,
  parseProjectsState,
  saveProjectsState,
  loadProjectsState,
  STORAGE_KEY,
} from "./storage";
import { DEFAULT_SETTINGS } from "@/lib/settings";

function memoryStorage(seed?: string): Storage {
  const map = new Map<string, string>();
  if (seed !== undefined) map.set(STORAGE_KEY, seed);
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
    key: (index) => [...map.keys()][index] ?? null,
  };
}

describe("parseProjectsState", () => {
  it("accepts a valid v1 payload", () => {
    const state = createInitialState();
    expect(parseProjectsState(state)).toEqual(state);
  });

  it("soft-migrates missing fontSize to the default", () => {
    const state = createInitialState();
    const legacy = {
      ...state,
      projects: state.projects.map((project) => ({
        ...project,
        settings: {
          meter: "haiku",
          showCounts: true,
          showRulers: false,
          customSyllables: 8,
        },
      })),
    };
    const parsed = parseProjectsState(legacy);
    expect(parsed?.projects[0]?.settings.fontSize).toBe(
      DEFAULT_SETTINGS.fontSize,
    );
    expect(parsed?.projects[0]?.settings.meter).toBe("haiku");
  });

  it("normalizes invalid meter and override values", () => {
    const state = createInitialState();
    const dirty = {
      ...state,
      projects: [
        {
          ...state.projects[0]!,
          settings: {
            meter: "not-a-meter",
            showCounts: true,
            showRulers: false,
            customSyllables: -3,
            fontSize: 99,
          },
          overrides: { fire: 1, bad: 0, worse: Number.NaN, keep: 2 },
        },
      ],
    };
    const parsed = parseProjectsState(dirty);
    expect(parsed?.projects[0]?.settings.meter).toBe("none");
    expect(parsed?.projects[0]?.settings.customSyllables).toBe(1);
    expect(parsed?.projects[0]?.settings.fontSize).toBe(3);
    expect(parsed?.projects[0]?.overrides).toEqual({ fire: 1, keep: 2 });
  });

  it("rejects malformed payloads", () => {
    expect(parseProjectsState(null)).toBeNull();
    expect(parseProjectsState({ version: 2 })).toBeNull();
    expect(
      parseProjectsState({ version: 1, activeId: "x", projects: [] }),
    ).toBeNull();
  });
});

describe("load / save", () => {
  it("round-trips through storage", () => {
    const storage = memoryStorage();
    const state = createInitialState();
    state.projects[0]!.text = "hello meter";
    state.projects[0]!.name = "Draft";
    expect(saveProjectsState(state, storage).ok).toBe(true);
    const { state: loaded, quarantined } = loadProjectsState(storage);
    expect(quarantined).toBe(false);
    expect(getActiveProject(loaded).text).toBe("hello meter");
    expect(getActiveProject(loaded).name).toBe("Draft");
  });

  it("returns a fresh project when storage is empty", () => {
    const { state: loaded, quarantined } = loadProjectsState(memoryStorage());
    expect(quarantined).toBe(false);
    expect(loaded.projects).toHaveLength(1);
    expect(getActiveProject(loaded).text).toBe("");
  });

  it("quarantines corrupt JSON without losing the raw payload", () => {
    const storage = memoryStorage("{not json");
    const { state: loaded, quarantined } = loadProjectsState(storage);
    expect(quarantined).toBe(true);
    expect(loaded.projects).toHaveLength(1);
    expect(storage.getItem(CORRUPT_STORAGE_KEY)).toBe("{not json");
  });

  it("quarantines unparseable versioned payloads", () => {
    const storage = memoryStorage(JSON.stringify({ version: 2, projects: [] }));
    const { quarantined } = loadProjectsState(storage);
    expect(quarantined).toBe(true);
    expect(storage.getItem(CORRUPT_STORAGE_KEY)).toContain('"version":2');
  });

  it("reports save failure when setItem throws", () => {
    const storage = memoryStorage();
    storage.setItem = () => {
      const error = new DOMException("quota", "QuotaExceededError");
      throw error;
    };
    const result = saveProjectsState(createInitialState(), storage);
    expect(result).toEqual({ ok: false, reason: "quota" });
  });
});

describe("createEmptyProject", () => {
  it("starts untitled with default settings", () => {
    const project = createEmptyProject();
    expect(project.name).toBe("Untitled");
    expect(project.settings.showCounts).toBe(true);
    expect(project.settings.fontSize).toBe(DEFAULT_SETTINGS.fontSize);
    expect(project.overrides).toEqual({});
  });
});
