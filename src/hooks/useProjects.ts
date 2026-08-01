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

export function useProjects() {
  const [state, setState] = useState<ProjectsState>(() => {
    const { state: initial } = loadProjectsState();
    return initial;
  });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const stateRef = useRef(state);
  const structuralFlushRef = useRef(false);
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

  useEffect(() => {
    if (structuralFlushRef.current) {
      structuralFlushRef.current = false;
      persist(stateRef.current);
      return;
    }

    const timer = window.setTimeout(() => {
      persist(stateRef.current);
    }, AUTOSAVE_MS);
    return () => window.clearTimeout(timer);
  }, [state, persist]);

  useEffect(() => {
    const flush = () => {
      persist(stateRef.current);
    };
    window.addEventListener("beforeunload", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [persist]);

  const commit = useCallback(
    (updater: (prev: ProjectsState) => ProjectsState, structural = false) => {
      if (structural) structuralFlushRef.current = true;
      const prev = stateRef.current;
      const next = updater(prev);
      if (next === prev) return;
      // Keep stateRef current for autosave / beforeunload before paint.
      stateRef.current = next;
      setState(next);
    },
    [],
  );

  const patchActive = useCallback(
    (
      patch: Partial<Pick<Project, "text" | "settings" | "name" | "overrides">>,
    ) => {
      commit((prev) => ({
        ...prev,
        projects: prev.projects.map((project) =>
          project.id === prev.activeId
            ? {
                ...project,
                ...patch,
                settings: patch.settings
                  ? normalizeSettings(patch.settings)
                  : project.settings,
                overrides: patch.overrides
                  ? normalizeOverridesRecord(patch.overrides)
                  : project.overrides,
                updatedAt: Date.now(),
              }
            : project,
        ),
      }));
    },
    [commit],
  );

  const setText = useCallback(
    (text: string) => {
      patchActive({ text });
    },
    [patchActive],
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
