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

function dispatchStorageEvent(state: ProjectsState) {
  const value = JSON.stringify(state);
  // jsdom does not mirror StorageEvent into localStorage; seed storage first.
  localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: STORAGE_KEY,
      newValue: value,
      storageArea: localStorage,
    }),
  );
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

  it("buffers text in a ref and flushes React state with persistence at AUTOSAVE_MS", () => {
    const { result } = renderHook(() => useProjects());
    const initialText = result.current.active.text;

    act(() => {
      vi.advanceTimersByTime(AUTOSAVE_MS);
    });
    const before = localStorage.getItem(STORAGE_KEY);

    act(() => {
      result.current.setText("debounced draft");
    });
    // Keystroke-rate React updates are skipped; CM owns the live doc.
    expect(result.current.active.text).toBe(initialText);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);

    act(() => {
      vi.advanceTimersByTime(AUTOSAVE_MS - 1);
    });
    expect(result.current.active.text).toBe(initialText);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.active.text).toBe("debounced draft");
    expect(readStored().projects[0]?.text).toBe("debounced draft");
  });

  it("reuses sibling project object identities on text flush", () => {
    const seeded = seedProjects(["A", "B"]);
    const { result } = renderHook(() => useProjects());
    const siblingBefore = result.current.projects.find(
      (p) => p.id === seeded.projects[1]!.id,
    );

    act(() => {
      result.current.setText("only-active-changes");
      vi.advanceTimersByTime(AUTOSAVE_MS);
    });

    const siblingAfter = result.current.projects.find(
      (p) => p.id === seeded.projects[1]!.id,
    );
    expect(siblingAfter).toBe(siblingBefore);
    expect(result.current.active.text).toBe("only-active-changes");
  });

  it("flushes buffered text before project switch and persists immediately", () => {
    const seeded = seedProjects(["A", "B"]);
    const { result } = renderHook(() => useProjects());
    const firstId = seeded.projects[0]!.id;
    const secondId = seeded.projects[1]!.id;

    act(() => {
      result.current.setText("typed-before-switch");
    });
    expect(result.current.active.text).toBe("text:A");

    act(() => {
      result.current.switchProject(secondId);
    });
    expect(result.current.active.id).toBe(secondId);
    expect(
      result.current.projects.find((p) => p.id === firstId)?.text,
    ).toBe("typed-before-switch");
    expect(readStored().projects.find((p) => p.id === firstId)?.text).toBe(
      "typed-before-switch",
    );
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

  it.each(["beforeunload", "pagehide"] as const)(
    "flushes buffered text on %s before debounce",
    (eventName) => {
      const { result } = renderHook(() => useProjects());
      const latest = `${eventName}-latest`;

      act(() => {
        vi.advanceTimersByTime(AUTOSAVE_MS);
      });

      act(() => {
        result.current.setText(latest);
      });
      expect(result.current.active.text).not.toBe(latest);
      expect(readStored().projects[0]?.text).not.toBe(latest);

      act(() => {
        window.dispatchEvent(new Event(eventName));
      });
      expect(readStored().projects[0]?.text).toBe(latest);
    },
  );

  describe("cross-tab storage events", () => {
    it("reloads remote state when there is no pending local text buffer", () => {
      const local = seedProjects(["Local"]);
      const { result } = renderHook(() => useProjects());
      expect(result.current.active.name).toBe("Local");

      const remoteProject = createEmptyProject("Remote");
      remoteProject.text = "from-other-tab";
      const remote: ProjectsState = {
        version: 1,
        activeId: remoteProject.id,
        projects: [remoteProject],
      };

      act(() => {
        dispatchStorageEvent(remote);
      });

      expect(result.current.active.id).toBe(remoteProject.id);
      expect(result.current.active.name).toBe("Remote");
      expect(result.current.active.text).toBe("from-other-tab");
      // Accepting remote should not clobber storage with stale local.
      expect(readStored().activeId).toBe(remoteProject.id);
      expect(local.activeId).not.toBe(remoteProject.id);
    });

    it("keeps local buffered edits and re-persists when a foreign write arrives", () => {
      seedProjects(["Local"]);
      const { result } = renderHook(() => useProjects());
      const localId = result.current.active.id;

      act(() => {
        result.current.setText("local-unsaved");
      });
      expect(result.current.active.text).toBe("text:Local");

      const remoteProject = createEmptyProject("Remote");
      remoteProject.text = "remote-clobber";
      const remote: ProjectsState = {
        version: 1,
        activeId: remoteProject.id,
        projects: [remoteProject],
      };

      act(() => {
        dispatchStorageEvent(remote);
      });

      // Pending keystrokes win: stay on local project with buffered text applied.
      expect(result.current.active.id).toBe(localId);
      expect(result.current.active.text).toBe("local-unsaved");
      expect(readStored().projects.find((p) => p.id === localId)?.text).toBe(
        "local-unsaved",
      );
    });
  });
});
