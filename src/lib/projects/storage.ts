import {
  DEFAULT_SETTINGS,
  normalizeSettings,
} from "@/lib/settings";
import { normalizeOverridesRecord } from "@/lib/syllables/overrides";
import type { Project, ProjectsState } from "./types";

export const STORAGE_KEY = "lyriic.projects.v1";
export const CORRUPT_STORAGE_KEY = "lyriic.projects.v1.corrupt";

export type SaveResult =
  | { ok: true }
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

export function createEmptyProject(name = "Untitled"): Project {
  const now = Date.now();
  return {
    id: createProjectId(),
    name,
    text: "",
    settings: { ...DEFAULT_SETTINGS },
    overrides: {},
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

function normalizeProject(raw: unknown): Project | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.id !== "string" || !p.id) return null;
  if (typeof p.name !== "string") return null;
  if (typeof p.text !== "string") return null;
  if (typeof p.updatedAt !== "number" || !Number.isFinite(p.updatedAt)) {
    return null;
  }

  return {
    id: p.id,
    name: p.name.trim() || "Untitled",
    text: p.text,
    settings: normalizeSettings(p.settings),
    overrides: normalizeOverridesRecord(p.overrides),
    updatedAt: p.updatedAt,
  };
}

/**
 * Parse and soft-migrate a v1 projects payload.
 * Missing Phase-3 fields (e.g. fontSize) receive defaults via normalizeSettings.
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
  if (!storage) {
    return { state: createInitialState(), quarantined: false };
  }

  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: createInitialState(), quarantined: false };
  }

  if (!raw) {
    return { state: createInitialState(), quarantined: false };
  }

  try {
    const parsed = parseProjectsState(JSON.parse(raw) as unknown);
    if (parsed) {
      return { state: parsed, quarantined: false };
    }
  } catch {
    // fall through to quarantine
  }

  quarantineRaw(raw, storage);
  return { state: createInitialState(), quarantined: true };
}

export function saveProjectsState(
  state: ProjectsState,
  storage: Pick<Storage, "setItem"> | null = typeof localStorage !== "undefined"
    ? localStorage
    : null,
): SaveResult {
  if (!storage) return { ok: false, reason: "unavailable" };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch (error) {
    const quota =
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED");
    console.warn(
      "[lyriic] Failed to persist projects",
      quota ? "(quota exceeded)" : error,
    );
    return { ok: false, reason: quota ? "quota" : "unavailable" };
  }
}

export function getActiveProject(state: ProjectsState): Project {
  return (
    state.projects.find((p) => p.id === state.activeId) ?? state.projects[0]!
  );
}
