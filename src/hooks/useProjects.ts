import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { isReusableEmptyDraft } from "@/lib/meters/seed";
import {
  defaultDraftName,
  downloadTextFile,
  isPlaceholderDraftName,
  softDraftNameFromText,
} from "@/lib/projects/exportDraft";
import { historyJsonEqual } from "@/lib/editor/historyPersist";
import {
  createEmptyProject,
  getActiveProject,
  loadProjectsState,
  readQuarantinedBackup,
  saveProjectsState,
  stripProjectsHistory,
  STORAGE_KEY,
  type SaveResult,
} from "@/lib/projects/storage";
import type { Project, ProjectsState } from "@/lib/projects/types";
import { normalizeSettings, type EditorSettings } from "@/lib/settings";
import {
  isValidStressOverride,
} from "@/lib/stress/overrides";
import {
  isValidOverrideCount,
  normalizeOverrideKey,
} from "@/lib/syllables/overrides";

export const AUTOSAVE_MS = 300;

export type SaveStatus = "ok" | "error" | "idle";

type PendingEdit = {
  projectId: string;
  text: string;
  /** Serialized CM history; undefined means empty stack (omit on project). */
  history: unknown | undefined;
};

type HistoryMode = "set" | "clear" | "keep";

function applyTextToProject(
  prev: ProjectsState,
  projectId: string,
  text: string,
  historyMode: HistoryMode = "keep",
  history?: unknown,
): ProjectsState {
  let changed = false;
  const projects = prev.projects.map((project) => {
    if (project.id !== projectId) return project;

    const nextHistory =
      historyMode === "keep"
        ? project.history
        : historyMode === "clear"
          ? undefined
          : history;

    const textSame = project.text === text;
    const historySame = historyJsonEqual(project.history, nextHistory);
    if (textSame && historySame) return project;

    changed = true;
    const softName = softDraftNameFromText(project.name, text, {
      autoNamed: project.autoNamed,
    });
    const { history: _prevHistory, ...rest } = project;
    return {
      ...rest,
      text,
      ...(nextHistory !== undefined ? { history: nextHistory } : {}),
      ...(softName ? { name: softName, autoNamed: true } : {}),
      updatedAt: Date.now(),
    };
  });
  return changed ? { ...prev, projects } : prev;
}

function settingsEqual(a: EditorSettings, b: EditorSettings): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useProjects() {
  // Lazy once: capture quarantine flag with the same load as initial state.
  const [boot] = useState(loadProjectsState);
  const [state, setState] = useState<ProjectsState>(boot.state);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [storageQuarantined, setStorageQuarantined] = useState(
    boot.quarantined,
  );
  /** Increments when a save drops undo stacks to fit quota (UI toast). */
  const [historyStripEpoch, setHistoryStripEpoch] = useState(0);

  const stateRef = useRef(state);
  const pendingTextRef = useRef<PendingEdit | null>(null);
  const textTimerRef = useRef<number | null>(null);
  const quarantineBootstrapped = useRef(false);
  const active = getActiveProject(state);

  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  function persist(next: ProjectsState): SaveResult {
    const result = saveProjectsState(next);
    if (result.ok && result.strippedHistory) {
      const stripped = stripProjectsHistory(next);
      stateRef.current = stripped;
      setState(stripped);
      setHistoryStripEpoch((epoch) => epoch + 1);
    }
    setSaveStatus(result.ok ? "ok" : "error");
    if (!result.ok) {
      console.warn("[lyriic] Project save failed:", result.reason);
    }
    return result;
  }

  /** Flush pending edits and persist — strip-aware path for diagnose/retry. */
  function persistActive(): SaveResult {
    flushPendingText(true);
    return persist(stateRef.current);
  }

  // After a quarantine reset, persist the fresh empty state so the next load
  // does not re-read the corrupt payload (backup stays under CORRUPT_STORAGE_KEY).
  useEffect(() => {
    if (!boot.quarantined || quarantineBootstrapped.current) return;
    quarantineBootstrapped.current = true;
    persist(stateRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot boot recovery
  }, []);

  function clearTextTimer() {
    if (textTimerRef.current != null) {
      window.clearTimeout(textTimerRef.current);
      textTimerRef.current = null;
    }
  }

  /**
   * Fold the keystroke buffer into a state snapshot and clear it.
   * Tagged by projectId so a stale buffer never lands on the wrong draft.
   */
  function consumePendingText(): ProjectsState | null {
    const pending = pendingTextRef.current;
    if (!pending) return null;
    pendingTextRef.current = null;
    const next = applyTextToProject(
      stateRef.current,
      pending.projectId,
      pending.text,
      "set",
      pending.history,
    );
    return next === stateRef.current ? null : next;
  }

  /** Materialize buffered text into stateRef (and optionally React). */
  function flushPendingText(updateReact: boolean) {
    clearTextTimer();
    const next = consumePendingText();
    if (!next) return;
    stateRef.current = next;
    if (updateReact) setState(next);
  }

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
    // Intentional mount/unmount-only: helpers close over stable setState and refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lifetime flush
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;

      // Cross-tab: if this tab still has unsaved keystrokes, keep local and
      // write back (last-writer with awareness). Otherwise accept remote.
      if (pendingTextRef.current) {
        flushPendingText(true);
        persist(stateRef.current);
        return;
      }

      clearTextTimer();
      const { state: remote } = loadProjectsState();
      stateRef.current = remote;
      setState(remote);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- storage sync
  }, []);

  /** Apply a state update and persist immediately (after folding pending text). */
  function commit(updater: (prev: ProjectsState) => ProjectsState) {
    clearTextTimer();
    const withText = consumePendingText();
    if (withText) stateRef.current = withText;

    const prev = stateRef.current;
    const next = updater(prev);
    if (next === prev) {
      if (withText) {
        setState(withText);
        persist(withText);
      }
      return;
    }
    stateRef.current = next;
    setState(next);
    persist(next);
  }

  function setText(text: string, history?: unknown) {
    const projectId = stateRef.current.activeId;
    // Second arg omitted (e.g. retry-save): keep undo only when text is unchanged.
    if (arguments.length < 2) {
      clearTextTimer();
      const withPending = consumePendingText();
      if (withPending) stateRef.current = withPending;
      const current = getActiveProject(stateRef.current);
      const historyMode: HistoryMode =
        current.text === text ? "keep" : "clear";
      const next = applyTextToProject(
        stateRef.current,
        projectId,
        text,
        historyMode,
      );
      if (next !== stateRef.current) {
        stateRef.current = next;
        setState(next);
      } else if (withPending) {
        setState(withPending);
      }
      persist(stateRef.current);
      return;
    }

    pendingTextRef.current = { projectId, text, history };
    clearTextTimer();
    // Same debounce boundary as persistence: one timer updates React + storage.
    textTimerRef.current = window.setTimeout(() => {
      textTimerRef.current = null;
      const next = consumePendingText();
      if (next) {
        stateRef.current = next;
        setState(next);
      }
      persist(stateRef.current);
    }, AUTOSAVE_MS);
  }

  function setSettings(settings: EditorSettings) {
    const normalized = normalizeSettings(settings);
    commit((prev) => {
      let changed = false;
      const projects = prev.projects.map((project) => {
        if (project.id !== prev.activeId) return project;
        if (settingsEqual(normalized, project.settings)) return project;
        changed = true;
        return {
          ...project,
          settings: normalized,
          updatedAt: Date.now(),
        };
      });
      return changed ? { ...prev, projects } : prev;
    });
  }

  function setOverride(word: string, count: number) {
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
  }

  function clearOverride(word: string) {
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
  }

  function setStressOverride(word: string, primaryIndex: number) {
    const key = normalizeOverrideKey(word);
    if (!key || !isValidStressOverride(primaryIndex)) return;
    commit((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== prev.activeId) return project;
        return {
          ...project,
          stressOverrides: {
            ...project.stressOverrides,
            [key]: Math.floor(primaryIndex),
          },
          updatedAt: Date.now(),
        };
      }),
    }));
  }

  function clearStressOverride(word: string) {
    const key = normalizeOverrideKey(word);
    if (!key) return;
    commit((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (project.id !== prev.activeId) return project;
        if (!(key in project.stressOverrides)) return project;
        const { [key]: _removed, ...rest } = project.stressOverrides;
        return {
          ...project,
          stressOverrides: rest,
          updatedAt: Date.now(),
        };
      }),
    }));
  }

  function switchProject(id: string) {
    commit((prev) => {
      if (!prev.projects.some((p) => p.id === id) || prev.activeId === id) {
        return prev;
      }
      return { ...prev, activeId: id };
    });
  }

  function createProject(name?: string, settings?: EditorSettings) {
    const draftName = name ?? defaultDraftName();
    commit((prev) => {
      const project = createEmptyProject(draftName, settings);
      return {
        ...prev,
        activeId: project.id,
        projects: [...prev.projects, project],
      };
    });
  }

  function dismissStorageQuarantine() {
    setStorageQuarantined(false);
  }

  function downloadQuarantineBackup(): boolean {
    const raw = readQuarantinedBackup();
    if (!raw) return false;
    downloadTextFile("lyriic-drafts-backup.json", raw);
    return true;
  }

  /**
   * Immediately seed text from a tool handoff.
   * Fills the active empty draft; otherwise opens a new draft so existing work
   * is not overwritten.
   */
  function applyToolDraft(text: string) {
    if (!text.trim()) return;
    commit((prev) => {
      const current = getActiveProject(prev);
      if (current.text.trim().length === 0) {
        // External replace: poem text changes, undo stack must not predate it.
        return applyTextToProject(prev, current.id, text, "clear");
      }
      const softName = softDraftNameFromText("Untitled", text);
      const project = {
        ...createEmptyProject(
          softName ?? defaultDraftName(),
          current.settings,
        ),
        text,
        autoNamed: true,
        updatedAt: Date.now(),
      };
      return {
        ...prev,
        activeId: project.id,
        projects: [...prev.projects, project],
      };
    });
  }

  /** Apply settings to the active draft, or create a new draft when needed. */
  function applyMeterSeed(
    settings: EditorSettings,
    options?: { name?: string; reuseEmpty?: boolean },
  ) {
    const name = options?.name ?? defaultDraftName();
    const reuseEmpty = options?.reuseEmpty ?? true;
    commit((prev) => {
      const current = getActiveProject(prev);
      const targetMeter = settings.meter;

      const reuseCandidate = (project: Project): boolean =>
        reuseEmpty && isReusableEmptyDraft(project, targetMeter);

      // Prefer active empty draft, else any empty draft already on this meter.
      let reuseId: string | null = null;
      if (reuseCandidate(current)) {
        reuseId = current.id;
      } else if (reuseEmpty) {
        const existing = prev.projects.find(
          (p) =>
            p.id !== current.id &&
            p.text.trim().length === 0 &&
            p.settings.meter === targetMeter,
        );
        if (existing) reuseId = existing.id;
      }

      if (reuseId) {
        const reused = prev.projects.find((p) => p.id === reuseId)!;
        const nextName = isPlaceholderDraftName(reused.name)
          ? name
          : reused.name;
        const nextSettings = normalizeSettings(settings);
        const overridesCleared =
          Object.keys(reused.overrides).length > 0 ||
          Object.keys(reused.stressOverrides).length > 0;
        if (
          settingsEqual(reused.settings, nextSettings) &&
          reused.name === nextName &&
          !overridesCleared &&
          prev.activeId === reuseId
        ) {
          return prev;
        }
        return {
          ...prev,
          activeId: reuseId,
          projects: prev.projects.map((project) =>
            project.id === reuseId
              ? {
                  ...project,
                  name: nextName,
                  settings: nextSettings,
                  overrides: {},
                  stressOverrides: {},
                  updatedAt: Date.now(),
                }
              : project,
          ),
        };
      }

      const project = createEmptyProject(name, settings);
      return {
        ...prev,
        activeId: project.id,
        projects: [...prev.projects, project],
      };
    });
  }

  function renameProject(id: string, name: string) {
    const trimmed = name.trim() || defaultDraftName();
    commit((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id
          ? {
              ...p,
              name: trimmed,
              autoNamed: false,
              updatedAt: Date.now(),
            }
          : p,
      ),
    }));
  }

  function deleteProject(id: string) {
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
    });
  }

  return {
    projects: state.projects,
    active,
    saveStatus,
    historyStripEpoch,
    storageQuarantined,
    setText,
    setSettings,
    setOverride,
    clearOverride,
    setStressOverride,
    clearStressOverride,
    switchProject,
    createProject,
    applyToolDraft,
    applyMeterSeed,
    renameProject,
    deleteProject,
    persistActive,
    dismissStorageQuarantine,
    downloadQuarantineBackup,
  };
}
