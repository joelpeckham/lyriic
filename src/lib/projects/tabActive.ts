import type { Project, ProjectsState } from "@/lib/projects/types";

/** Per-tab open draft — sessionStorage so tabs can diverge while content syncs. */
export const TAB_ACTIVE_KEY = "lyriic.activeProjectId.v1";

function defaultSessionStorage(): Storage | null {
  try {
    if (typeof globalThis.sessionStorage === "undefined") return null;
    return globalThis.sessionStorage;
  } catch {
    return null;
  }
}

export function readTabActiveId(
  storage: Pick<Storage, "getItem"> | null = defaultSessionStorage(),
): string | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(TAB_ACTIVE_KEY);
    if (!raw) return null;
    return raw;
  } catch {
    return null;
  }
}

export function writeTabActiveId(
  id: string,
  storage: Pick<Storage, "setItem"> | null = defaultSessionStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(TAB_ACTIVE_KEY, id);
  } catch {
    // Quota / private mode — best-effort.
  }
}

/**
 * Prefer a valid session active id; otherwise use persisted localStorage
 * activeId and seed session so refresh keeps this tab's selection.
 */
export function resolveTabActiveId(
  projects: readonly { id: string }[],
  persistedActiveId: string,
  session: Pick<Storage, "getItem" | "setItem"> | null =
    defaultSessionStorage(),
): string {
  const sessionId = readTabActiveId(session);
  if (sessionId && projects.some((p) => p.id === sessionId)) {
    return sessionId;
  }

  const fallback = projects.some((p) => p.id === persistedActiveId)
    ? persistedActiveId
    : (projects[0]?.id ?? persistedActiveId);

  writeTabActiveId(fallback, session);
  return fallback;
}

/**
 * Apply a remote projects snapshot while keeping this tab's open draft.
 * If that draft was deleted remotely, fall back like `deleteProject`.
 */
export function mergeRemoteProjectsState(
  remote: ProjectsState,
  localActiveId: string,
  previousProjects: readonly Project[],
): ProjectsState {
  if (remote.projects.some((p) => p.id === localActiveId)) {
    return { ...remote, activeId: localActiveId };
  }

  const index = previousProjects.findIndex((p) => p.id === localActiveId);
  const fallback =
    remote.projects[Math.max(0, index - 1)] ?? remote.projects[0];
  if (!fallback) {
    return remote;
  }
  return { ...remote, activeId: fallback.id };
}

/**
 * Merge a remote snapshot after flushing local keystrokes: accept remote
 * projects, overlay the draft that was being edited when it still exists,
 * and keep this tab's open draft (no resurrection of remote deletes).
 */
export function mergeRemotePreservingLocalEdit(
  remote: ProjectsState,
  localAfterFlush: ProjectsState,
  editedProjectId: string,
): ProjectsState {
  const localEdit = localAfterFlush.projects.find(
    (p) => p.id === editedProjectId,
  );
  const projects =
    localEdit && remote.projects.some((p) => p.id === editedProjectId)
      ? remote.projects.map((p) =>
          p.id === editedProjectId ? localEdit : p,
        )
      : remote.projects;

  return mergeRemoteProjectsState(
    { ...remote, projects },
    localAfterFlush.activeId,
    localAfterFlush.projects,
  );
}
