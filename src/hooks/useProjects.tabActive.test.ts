import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEY, saveProjectsState } from "@/lib/projects/storage";
import {
  TAB_ACTIVE_KEY,
  readTabActiveId,
} from "@/lib/projects/tabActive";
import type { ProjectsState } from "@/lib/projects/types";
import { DEFAULT_SETTINGS } from "@/lib/settings";

import { useProjects } from "./useProjects";

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
    removeItem(key: string) {
      map.delete(key);
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
  };
}

function project(id: string, text = "") {
  return {
    id,
    name: id,
    text,
    settings: { ...DEFAULT_SETTINGS },
    overrides: {},
    stressOverrides: {},
    updatedAt: 1,
  };
}

function seedState(activeId: string, ids: string[]): ProjectsState {
  return {
    version: 1,
    activeId,
    projects: ids.map((id) => project(id, id === "p1" ? "one" : "two")),
  };
}

describe("useProjects per-tab active draft", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
    vi.stubGlobal("sessionStorage", memoryStorage());
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("boots from session active when it is still in the project list", () => {
    saveProjectsState(seedState("p1", ["p1", "p2"]));
    sessionStorage.setItem(TAB_ACTIVE_KEY, "p2");

    const { result } = renderHook(() => useProjects());

    expect(result.current.active.id).toBe("p2");
  });

  it("boots from localStorage activeId and seeds session when session is empty", () => {
    saveProjectsState(seedState("p2", ["p1", "p2"]));

    const { result } = renderHook(() => useProjects());

    expect(result.current.active.id).toBe("p2");
    expect(readTabActiveId()).toBe("p2");
  });

  it("updates sessionStorage when switching or creating a project", () => {
    saveProjectsState(seedState("p1", ["p1", "p2"]));
    const { result } = renderHook(() => useProjects());

    act(() => {
      result.current.switchProject("p2");
    });
    expect(result.current.active.id).toBe("p2");
    expect(readTabActiveId()).toBe("p2");

    act(() => {
      result.current.createProject("Fresh");
    });
    expect(result.current.active.name).toBe("Fresh");
    expect(readTabActiveId()).toBe(result.current.active.id);
  });

  it("merges remote projects on storage without adopting remote activeId", () => {
    saveProjectsState(seedState("p1", ["p1", "p2"]));
    sessionStorage.setItem(TAB_ACTIVE_KEY, "p1");
    const { result } = renderHook(() => useProjects());
    expect(result.current.active.id).toBe("p1");
    expect(sessionStorage.getItem(TAB_ACTIVE_KEY)).toBe("p1");

    const remote: ProjectsState = {
      version: 1,
      activeId: "p2",
      projects: [
        project("p1", "updated-from-other-tab"),
        project("p2", "two"),
        project("p3", ""),
      ],
    };
    saveProjectsState(remote);

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: localStorage.getItem(STORAGE_KEY),
        }),
      );
    });

    expect(result.current.active.id).toBe("p1");
    expect(result.current.active.text).toBe("updated-from-other-tab");
    expect(result.current.projects).toHaveLength(3);
    // Selection unchanged → session key stays put (not rewritten to remote p2).
    expect(sessionStorage.getItem(TAB_ACTIVE_KEY)).toBe("p1");
    expect(readTabActiveId(sessionStorage)).toBe("p1");
  });

  it("falls back when remote deletes this tab's active draft", () => {
    saveProjectsState(seedState("p2", ["p1", "p2", "p3"]));
    sessionStorage.setItem(TAB_ACTIVE_KEY, "p2");
    const { result } = renderHook(() => useProjects());
    expect(result.current.active.id).toBe("p2");

    const remote: ProjectsState = {
      version: 1,
      activeId: "p3",
      projects: [project("p1", "one"), project("p3", "three")],
    };
    saveProjectsState(remote);

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: localStorage.getItem(STORAGE_KEY),
        }),
      );
    });

    expect(result.current.active.id).toBe("p1");
    expect(readTabActiveId()).toBe("p1");
  });

  it("keeps pending edit and accepts remote sibling draft updates", () => {
    vi.useFakeTimers();
    saveProjectsState(seedState("p1", ["p1", "p2"]));
    sessionStorage.setItem(TAB_ACTIVE_KEY, "p1");
    const { result } = renderHook(() => useProjects());

    act(() => {
      result.current.setText("pending-on-p1", { done: [], undone: [] });
    });

    const remote: ProjectsState = {
      version: 1,
      activeId: "p2",
      projects: [
        project("p1", "one"),
        project("p2", "updated-from-other-tab"),
      ],
    };
    saveProjectsState(remote);

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: localStorage.getItem(STORAGE_KEY),
        }),
      );
    });

    expect(result.current.active.id).toBe("p1");
    expect(result.current.active.text).toBe("pending-on-p1");
    expect(result.current.projects.find((p) => p.id === "p2")!.text).toBe(
      "updated-from-other-tab",
    );
  });

  it("drops pending edit when remote deletes the active draft", () => {
    vi.useFakeTimers();
    saveProjectsState(seedState("p2", ["p1", "p2", "p3"]));
    sessionStorage.setItem(TAB_ACTIVE_KEY, "p2");
    const { result } = renderHook(() => useProjects());

    act(() => {
      result.current.setText("pending-on-p2", { done: [], undone: [] });
    });

    const remote: ProjectsState = {
      version: 1,
      activeId: "p3",
      projects: [project("p1", "one"), project("p3", "three")],
    };
    saveProjectsState(remote);

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: localStorage.getItem(STORAGE_KEY),
        }),
      );
    });

    expect(result.current.active.id).toBe("p1");
    expect(result.current.projects.some((p) => p.id === "p2")).toBe(false);
    expect(readTabActiveId()).toBe("p1");
  });
});
