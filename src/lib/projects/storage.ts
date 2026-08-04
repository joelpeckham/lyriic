import {
  clampFontSize,
  DEFAULT_PREFS,
  normalizePrefs,
  prefsHasFontSize,
  PREFS_STORAGE_KEY,
  savePrefs,
} from "@/lib/prefs";
import {
  DEFAULT_SETTINGS,
  normalizeSettings,
  type EditorSettings,
} from "@/lib/settings";
import { normalizeHistory } from "@/lib/editor/historyPersist";
import { readJson, writeJson } from "@/lib/storageJson";
import { normalizeStressOverridesRecord } from "@/lib/stress/overrides";
import { normalizeOverridesRecord } from "@/lib/syllables/overrides";
import { defaultDraftName } from "./exportDraft";
import type { Project, ProjectsState } from "./types";

export const STORAGE_KEY = "lyriic.projects.v1";
export const CORRUPT_STORAGE_KEY = "lyriic.projects.v1.corrupt";

/**
 * True when EditorShell has written projects at least once.
 * Key presence is enough — do not require a parseable payload.
 */
export function hasPersistedDraft(
  storage: Pick<Storage, "getItem"> | null =
    typeof localStorage !== "undefined" ? localStorage : null,
): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(STORAGE_KEY) != null;
  } catch {
    return false;
  }
}

export type SaveResult =
  | { ok: true; strippedHistory?: boolean }
  | { ok: false; reason: "quota" | "unavailable" };

export type LoadResult = {
  state: ProjectsState;
  /** True when prior payload was unreadable and moved to the quarantine key. */
  quarantined: boolean;
};

export function createProjectId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyProject(
  name?: string,
  settings: EditorSettings = DEFAULT_SETTINGS,
): Project {
  const now = Date.now();
  return {
    id: createProjectId(),
    name: name ?? defaultDraftName(now),
    text: "",
    settings: normalizeSettings(settings),
    overrides: {},
    stressOverrides: {},
    updatedAt: now,
  };
}

export function createInitialState(): ProjectsState {
  const project = createEmptyProject();
  return {
    version: 1,
    activeId: project.id,
    projects: [project],
  };
}

/** Drop persisted undo stacks (quota fallback — keep poem text). */
export function stripProjectsHistory(state: ProjectsState): ProjectsState {
  let changed = false;
  const projects = state.projects.map((project) => {
    if (project.history === undefined) return project;
    changed = true;
    const { history: _removed, ...rest } = project;
    return rest;
  });
  return changed ? { ...state, projects } : state;
}

function normalizeProject(raw: unknown): Project | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.id !== "string" || !p.id) return null;
  if (typeof p.name !== "string") return null;
  if (typeof p.text !== "string") return null;
  if (typeof p.updatedAt !== "number" || !Number.isFinite(p.updatedAt)) {
    return null;
  }

  const history = normalizeHistory(p.history);

  return {
    id: p.id,
    name: p.name.trim() || defaultDraftName(p.updatedAt),
    text: p.text,
    settings: normalizeSettings(p.settings),
    overrides: normalizeOverridesRecord(p.overrides),
    stressOverrides: normalizeStressOverridesRecord(p.stressOverrides),
    ...(typeof p.autoNamed === "boolean" ? { autoNamed: p.autoNamed } : {}),
    ...(history !== undefined ? { history } : {}),
    updatedAt: p.updatedAt,
  };
}

/**
 * Read fontSize from a legacy project.settings payload (pre–prefs migration).
 */
function fontSizeFromProjectSettings(settings: unknown): number | null {
  if (!settings || typeof settings !== "object") return null;
  const fontSize = (settings as Record<string, unknown>).fontSize;
  if (typeof fontSize !== "number" || !Number.isFinite(fontSize)) return null;
  return clampFontSize(fontSize);
}

/**
 * Peek active project's legacy settings.fontSize from a raw projects payload.
 */
function activeProjectFontSize(raw: unknown): number | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (!Array.isArray(data.projects) || typeof data.activeId !== "string") {
    return null;
  }
  const active = data.projects.find(
    (item) =>
      item &&
      typeof item === "object" &&
      (item as Record<string, unknown>).id === data.activeId,
  );
  if (!active || typeof active !== "object") return null;
  return fontSizeFromProjectSettings(
    (active as Record<string, unknown>).settings,
  );
}

/**
 * One-time: if prefs lack fontSize, copy it from the active project's
 * legacy settings.fontSize (when present). Idempotent once prefs store fontSize.
 */
export function migrateFontSizeToPrefsIfNeeded(
  rawProjects?: unknown,
  storage: Pick<Storage, "getItem" | "setItem"> | null =
    typeof localStorage !== "undefined" ? localStorage : null,
): void {
  if (!storage) return;

  const prefsResult = readJson(storage, PREFS_STORAGE_KEY);
  if (prefsResult.status === "ok" && prefsHasFontSize(prefsResult.value)) {
    return;
  }

  const projectsRaw =
    rawProjects ??
    (() => {
      const result = readJson(storage, STORAGE_KEY);
      return result.status === "ok" ? result.value : null;
    })();

  const fromProject = activeProjectFontSize(projectsRaw);
  if (fromProject === null) return;

  const base =
    prefsResult.status === "ok"
      ? normalizePrefs(prefsResult.value)
      : { ...DEFAULT_PREFS };
  savePrefs({ ...base, fontSize: fromProject });
}

/**
 * Parse and soft-migrate a v1 projects payload.
 * Unknown / legacy fields (e.g. fontSize) are dropped via normalizeSettings.
 */
export function parseProjectsState(raw: unknown): ProjectsState | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (data.version !== 1) return null;
  if (typeof data.activeId !== "string") return null;
  if (!Array.isArray(data.projects) || data.projects.length === 0) return null;

  const projects: Project[] = [];
  for (const item of data.projects) {
    const project = normalizeProject(item);
    if (!project) return null;
    projects.push(project);
  }

  if (!projects.some((p) => p.id === data.activeId)) return null;

  return {
    version: 1,
    activeId: data.activeId,
    projects,
  };
}

function quarantineRaw(
  raw: string,
  storage: Pick<Storage, "setItem">,
): void {
  try {
    storage.setItem(CORRUPT_STORAGE_KEY, raw);
  } catch {
    // Best-effort backup; ignore quota failures here.
  }
}

export function loadProjectsState(
  storage: Pick<Storage, "getItem" | "setItem"> | null =
    typeof localStorage !== "undefined" ? localStorage : null,
): LoadResult {
  const result = readJson(storage, STORAGE_KEY);
  if (result.status === "ok") {
    migrateFontSizeToPrefsIfNeeded(result.value, storage);
    const parsed = parseProjectsState(result.value);
    if (parsed) {
      return { state: parsed, quarantined: false };
    }
    if (storage) quarantineRaw(result.raw, storage);
    return { state: createInitialState(), quarantined: true };
  }
  if (result.status === "corrupt") {
    if (storage) quarantineRaw(result.raw, storage);
    return { state: createInitialState(), quarantined: true };
  }
  return { state: createInitialState(), quarantined: false };
}

/** Raw payload moved aside when drafts could not be parsed. */
export function readQuarantinedBackup(
  storage: Pick<Storage, "getItem"> | null =
    typeof localStorage !== "undefined" ? localStorage : null,
): string | null {
  if (!storage) return null;
  try {
    return storage.getItem(CORRUPT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveProjectsState(
  state: ProjectsState,
  storage: Pick<Storage, "setItem"> | null = typeof localStorage !== "undefined"
    ? localStorage
    : null,
): SaveResult {
  const result = writeJson(storage, STORAGE_KEY, state);
  if (result.ok) return { ok: true };

  // Quota: retry once without undo stacks so poem text still saves.
  if (result.reason === "quota") {
    const stripped = stripProjectsHistory(state);
    if (stripped !== state) {
      const retry = writeJson(storage, STORAGE_KEY, stripped);
      if (retry.ok) {
        console.warn(
          "[lyriic] Persisted projects without undo history (quota)",
        );
        return { ok: true, strippedHistory: true };
      }
    }
  }

  console.warn(
    "[lyriic] Failed to persist projects",
    result.reason === "quota" ? "(quota exceeded)" : result.error,
  );
  return { ok: false, reason: result.reason };
}

export function getActiveProject(state: ProjectsState): Project {
  return (
    state.projects.find((p) => p.id === state.activeId) ?? state.projects[0]!
  );
}
