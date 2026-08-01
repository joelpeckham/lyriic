import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createEmptyProject,
  loadProjectsState,
  saveProjectsState,
  STORAGE_KEY,
} from "@/lib/projects/storage";
import type { ProjectsState } from "@/lib/projects/types";

import { AUTOSAVE_MS, useProjects } from "./useProjects";

function readStored(): ProjectsState {
  return loadProjectsState().state;
}

function seedProjects(names: string[]): ProjectsState {
  const projects = names.map((name) => {
    const project = createEmptyProject(name);
    project.text = `text:${name}`;
    return project;
  });
  const state: ProjectsState = {
    version: 1,
    activeId: projects[0]!.id,
    projects,
  };
  expect(saveProjectsState(state).ok).toBe(true);
  return state;
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});

describe("useProjects", () => {
  it("creates, renames, switches, and deletes projects", () => {
    const { result } = renderHook(() => useProjects());
    const firstId = result.current.active.id;

    act(() => {
      result.current.createProject("Song");
    });
    expect(result.current.projects).toHaveLength(2);
    expect(result.current.active.name).toBe("Song");
    const secondId = result.current.active.id;
    expect(secondId).not.toBe(firstId);

    act(() => {
      result.current.renameProject(secondId, "  Chorus  ");
    });
    expect(result.current.projects.find((p) => p.id === secondId)?.name).toBe(
      "Chorus",
    );

    act(() => {
      result.current.switchProject(firstId);
    });
    expect(result.current.active.id).toBe(firstId);

    act(() => {
      result.current.deleteProject(secondId);
    });
    expect(result.current.projects).toHaveLength(1);
    expect(result.current.projects[0]?.id).toBe(firstId);
    expect(result.current.active.id).toBe(firstId);
  });

  it("debounces text autosave until AUTOSAVE_MS elapses", () => {
    const { result } = renderHook(() => useProjects());

    act(() => {
      vi.advanceTimersByTime(AUTOSAVE_MS);
    });
    const before = localStorage.getItem(STORAGE_KEY);

    act(() => {
      result.current.setText("debounced draft");
    });
    expect(result.current.active.text).toBe("debounced draft");
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);

    act(() => {
      vi.advanceTimersByTime(AUTOSAVE_MS - 1);
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(readStored().projects[0]?.text).toBe("debounced draft");
  });

  it("flushes create/rename/switch/delete to storage immediately", () => {
    const { result } = renderHook(() => useProjects());
    const firstId = result.current.active.id;

    act(() => {
      result.current.createProject("Immediate");
    });
    expect(readStored().projects).toHaveLength(2);
    expect(readStored().projects.some((p) => p.name === "Immediate")).toBe(
      true,
    );
    const secondId = result.current.active.id;

    act(() => {
      result.current.renameProject(secondId, "Renamed");
    });
    expect(
      readStored().projects.find((p) => p.id === secondId)?.name,
    ).toBe("Renamed");

    act(() => {
      result.current.switchProject(firstId);
    });
    expect(readStored().activeId).toBe(firstId);

    act(() => {
      result.current.deleteProject(secondId);
    });
    expect(readStored().projects).toHaveLength(1);
    expect(readStored().activeId).toBe(firstId);
  });

  describe("delete-of-active fallback", () => {
    it("selects the previous project when deleting the middle active item", () => {
      const seeded = seedProjects(["A", "B", "C"]);
      const [a, b] = seeded.projects;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...seeded, activeId: b!.id }),
      );

      const { result } = renderHook(() => useProjects());
      expect(result.current.active.id).toBe(b!.id);

      act(() => {
        result.current.deleteProject(b!.id);
      });
      expect(result.current.projects.map((p) => p.name)).toEqual(["A", "C"]);
      expect(result.current.active.id).toBe(a!.id);
      expect(readStored().activeId).toBe(a!.id);
    });

    it("selects the next project when deleting the first active item", () => {
      const seeded = seedProjects(["A", "B", "C"]);
      const [, b] = seeded.projects;

      const { result } = renderHook(() => useProjects());
      expect(result.current.active.id).toBe(seeded.projects[0]!.id);

      act(() => {
        result.current.deleteProject(seeded.projects[0]!.id);
      });
      expect(result.current.projects.map((p) => p.name)).toEqual(["B", "C"]);
      expect(result.current.active.id).toBe(b!.id);
      expect(readStored().activeId).toBe(b!.id);
    });

    it("selects the previous project when deleting the last active item", () => {
      const seeded = seedProjects(["A", "B", "C"]);
      const [, b, c] = seeded.projects;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...seeded, activeId: c!.id }),
      );

      const { result } = renderHook(() => useProjects());
      expect(result.current.active.id).toBe(c!.id);

      act(() => {
        result.current.deleteProject(c!.id);
      });
      expect(result.current.projects.map((p) => p.name)).toEqual(["A", "B"]);
      expect(result.current.active.id).toBe(b!.id);
      expect(readStored().activeId).toBe(b!.id);
    });
  });

  it("flushes latest stateRef on beforeunload before debounce", () => {
    const { result } = renderHook(() => useProjects());

    act(() => {
      vi.advanceTimersByTime(AUTOSAVE_MS);
    });

    act(() => {
      result.current.setText("unload-latest");
    });
    expect(readStored().projects[0]?.text).not.toBe("unload-latest");

    act(() => {
      window.dispatchEvent(new Event("beforeunload"));
    });
    expect(readStored().projects[0]?.text).toBe("unload-latest");
  });

  it("flushes latest stateRef on pagehide before debounce", () => {
    const { result } = renderHook(() => useProjects());

    act(() => {
      vi.advanceTimersByTime(AUTOSAVE_MS);
    });

    act(() => {
      result.current.setText("pagehide-latest");
    });
    expect(readStored().projects[0]?.text).not.toBe("pagehide-latest");

    act(() => {
      window.dispatchEvent(new Event("pagehide"));
    });
    expect(readStored().projects[0]?.text).toBe("pagehide-latest");
  });
});
