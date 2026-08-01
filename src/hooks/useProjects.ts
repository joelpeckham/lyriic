import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  createEmptyProject,
  getActiveProject,
  loadProjectsState,
  saveProjectsState,
  STORAGE_KEY,
  type SaveResult,
} from "@/lib/projects/storage";
import type { Project, ProjectsState } from "@/lib/projects/types";
import { normalizeSettings, type EditorSettings } from "@/lib/settings";
import {
  isValidOverrideCount,
  normalizeOverrideKey,
  normalizeOverridesRecord,
} from "@/lib/syllables/overrides";

export const AUTOSAVE_MS = 300;

export type SaveStatus = "ok" | "error" | "idle";

type PendingText = {
  projectId: string;
  text: string;
};

function applyTextToProject(
  prev: ProjectsState,
  projectId: string,
  text: string,
): ProjectsState {
  let changed = false;
  const projects = prev.projects.map((project) => {
    if (project.id !== projectId) return project;
    if (project.text === text) return project;
    changed = true;
    return {
      ...project,
      text,
      updatedAt: Date.now(),
    };
  });
  return changed ? { ...prev, projects } : prev;
}

export function useProjects() {
  const [state, setState] = useState<ProjectsState>(() => {
    const { state: initial } = loadProjectsState();
    return initial;
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const stateRef = useRef(state);
  const structuralFlushRef = useRef(false);
  /** Skip the state-effect debounce when persist already ran for this update. */
  const skipDebouncedPersistRef = useRef(false);
  const pendingTextRef = useRef<PendingText | null>(null);
  const textTimerRef = useRef<number | null>(null);
  const active = getActiveProject(state);

  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  const persist = useCallback((next: ProjectsState): SaveResult => {
    const result = saveProjectsState(next);
    setSaveStatus(result.ok ? "ok" : "error");
    if (!result.ok) {
      console.warn("[lyriic] Project save failed:", result.reason);
    }
    return result;
  }, []);

  const clearTextTimer = useCallback(() => {
    if (textTimerRef.current != null) {
      window.clearTimeout(textTimerRef.current);
      textTimerRef.current = null;
    }
  }, []);

  /**
   * Fold the keystroke buffer into a state snapshot and clear it.
   * Tagged by projectId so a stale buffer never lands on the wrong draft.
   */
  const consumePendingText = useCallback((): ProjectsState | null => {
    const pending = pendingTextRef.current;
    if (!pending) return null;
    pendingTextRef.current = null;
    const next = applyTextToProject(
      stateRef.current,
      pending.projectId,
      pending.text,
    );
    return next === stateRef.current ? null : next;
  }, []);

  /** Materialize buffered text into stateRef (and optionally React). */
  const flushPendingText = useCallback(
    (updateReact: boolean) => {
      clearTextTimer();
      const next = consumePendingText();
      if (!next) return;
      stateRef.current = next;
      if (updateReact) setState(next);
    },
    [clearTextTimer, consumePendingText],
  );

  useEffect(() => {
    if (structuralFlushRef.current) {
      structuralFlushRef.current = false;
      persist(stateRef.current);
      return;
    }

    if (skipDebouncedPersistRef.current) {
      skipDebouncedPersistRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      persist(stateRef.current);
    }, AUTOSAVE_MS);
    return () => window.clearTimeout(timer);
  }, [state, persist]);

  useEffect(() => {
    const flush = () => {
      // beforeunload / pagehide / unmount: never drop keystrokes still in the buffer.
      flushPendingText(false);
      persist(stateRef.current);
    };
    window.addEventListener("beforeunload", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [persist, flushPendingText]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;

      // Cross-tab: if this tab still has unsaved keystrokes, keep local and
      // write back (last-writer with awareness). Otherwise accept remote.
      if (pendingTextRef.current) {
        flushPendingText(true);
        skipDebouncedPersistRef.current = true;
        persist(stateRef.current);
        return;
      }

      clearTextTimer();
      const { state: remote } = loadProjectsState();
      stateRef.current = remote;
      skipDebouncedPersistRef.current = true;
      setState(remote);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [clearTextTimer, flushPendingText, persist]);

  const commit = useCallback(
    (updater: (prev: ProjectsState) => ProjectsState, structural = false) => {
      // Structural / settings / overrides must see the latest buffered text.
      clearTextTimer();
      const withText = consumePendingText();
      if (withText) stateRef.current = withText;

      if (structural) structuralFlushRef.current = true;
      const prev = stateRef.current;
      const next = updater(prev);
      if (next === prev) {
        if (withText) setState(withText);
        return;
      }
      stateRef.current = next;
      setState(next);
    },
    [clearTextTimer, consumePendingText],
  );

  const patchActive = useCallback(
    (
      patch: Partial<Pick<Project, "text" | "settings" | "name" | "overrides">>,
    ) => {
      commit((prev) => {
        let changed = false;
        const projects = prev.projects.map((project) => {
          if (project.id !== prev.activeId) return project;

          const nextSettings = patch.settings
            ? normalizeSettings(patch.settings)
            : project.settings;
          const nextOverrides = patch.overrides
            ? normalizeOverridesRecord(patch.overrides)
            : project.overrides;
          const nextText = patch.text !== undefined ? patch.text : project.text;
          const nextName = patch.name !== undefined ? patch.name : project.name;

          if (
            nextText === project.text &&
            nextName === project.name &&
            nextSettings === project.settings &&
            nextOverrides === project.overrides
          ) {
            return project;
          }

          changed = true;
          return {
            ...project,
            text: nextText,
            name: nextName,
            settings: nextSettings,
            overrides: nextOverrides,
            updatedAt: Date.now(),
          };
        });
        return changed ? { ...prev, projects } : prev;
      });
    },
    [commit],
  );

  const setText = useCallback(
    (text: string) => {
      const projectId = stateRef.current.activeId;
      pendingTextRef.current = { projectId, text };
      clearTextTimer();
      // Same debounce boundary as persistence: one timer updates React + storage.
      textTimerRef.current = window.setTimeout(() => {
        textTimerRef.current = null;
        const next = consumePendingText();
        if (next) {
          stateRef.current = next;
          skipDebouncedPersistRef.current = true;
          setState(next);
        }
        persist(stateRef.current);
      }, AUTOSAVE_MS);
    },
    [clearTextTimer, consumePendingText, persist],
  );

  const setSettings = useCallback(
    (settings: EditorSettings) => {
      patchActive({ settings: normalizeSettings(settings) });
    },
    [patchActive],
  );

  const setOverride = useCallback(
    (word: string, count: number) => {
      const key = normalizeOverrideKey(word);
      if (!key || !isValidOverrideCount(count)) return;
      commit((prev) => ({
        ...prev,
        projects: prev.projects.map((project) => {
          if (project.id !== prev.activeId) return project;
          return {
            ...project,
            overrides: {
              ...project.overrides,
              [key]: Math.floor(count),
            },
            updatedAt: Date.now(),
          };
        }),
      }));
    },
    [commit],
  );

  const clearOverride = useCallback(
    (word: string) => {
      const key = normalizeOverrideKey(word);
      if (!key) return;
      commit((prev) => ({
        ...prev,
        projects: prev.projects.map((project) => {
          if (project.id !== prev.activeId) return project;
          if (!(key in project.overrides)) return project;
          const { [key]: _removed, ...rest } = project.overrides;
          return {
            ...project,
            overrides: rest,
            updatedAt: Date.now(),
          };
        }),
      }));
    },
    [commit],
  );

  const switchProject = useCallback(
    (id: string) => {
      commit((prev) => {
        if (!prev.projects.some((p) => p.id === id) || prev.activeId === id) {
          return prev;
        }
        return { ...prev, activeId: id };
      }, true);
    },
    [commit],
  );

  const createProject = useCallback(
    (name = "Untitled") => {
      commit((prev) => {
        const project = createEmptyProject(name);
        return {
          ...prev,
          activeId: project.id,
          projects: [...prev.projects, project],
        };
      }, true);
    },
    [commit],
  );

  const renameProject = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim() || "Untitled";
      commit(
        (prev) => ({
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === id ? { ...p, name: trimmed, updatedAt: Date.now() } : p,
          ),
        }),
        true,
      );
    },
    [commit],
  );

  const deleteProject = useCallback(
    (id: string) => {
      commit((prev) => {
        if (prev.projects.length <= 1) return prev;
        const remaining = prev.projects.filter((p) => p.id !== id);
        if (remaining.length === prev.projects.length) return prev;

        let activeId = prev.activeId;
        if (activeId === id) {
          const index = prev.projects.findIndex((p) => p.id === id);
          const fallback =
            remaining[Math.max(0, index - 1)] ?? remaining[0]!;
          activeId = fallback.id;
        }

        return { ...prev, activeId, projects: remaining };
      }, true);
    },
    [commit],
  );

  return {
    projects: state.projects,
    active,
    saveStatus,
    setText,
    setSettings,
    setOverride,
    clearOverride,
    switchProject,
    createProject,
    renameProject,
    deleteProject,
  };
}
