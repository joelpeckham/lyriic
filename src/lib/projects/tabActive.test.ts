import { describe, expect, it } from "vitest";

import { DEFAULT_SETTINGS } from "@/lib/settings";

import {
  TAB_ACTIVE_KEY,
  mergeRemotePreservingLocalEdit,
  mergeRemoteProjectsState,
  readTabActiveId,
  resolveTabActiveId,
  writeTabActiveId,
} from "./tabActive";
import type { Project, ProjectsState } from "./types";

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
    removeItem(key: string) {
      map.delete(key);
    },
  };
}

function project(id: string, text = ""): Project {
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

function state(
  projects: Project[],
  activeId: string,
): ProjectsState {
  return { version: 1, activeId, projects };
}

describe("tabActive helpers", () => {
  it("reads and writes session active id", () => {
    const session = memoryStorage();
    expect(readTabActiveId(session)).toBeNull();
    writeTabActiveId("p2", session);
    expect(readTabActiveId(session)).toBe("p2");
    expect(session.getItem(TAB_ACTIVE_KEY)).toBe("p2");
  });

  it("prefers a valid session active over persisted activeId", () => {
    const session = memoryStorage();
    session.setItem(TAB_ACTIVE_KEY, "p2");
    const projects = [project("p1"), project("p2")];
    expect(resolveTabActiveId(projects, "p1", session)).toBe("p2");
  });

  it("falls back to persisted activeId and seeds session", () => {
    const session = memoryStorage();
    const projects = [project("p1"), project("p2")];
    expect(resolveTabActiveId(projects, "p2", session)).toBe("p2");
    expect(readTabActiveId(session)).toBe("p2");
  });

  it("ignores invalid session ids", () => {
    const session = memoryStorage();
    session.setItem(TAB_ACTIVE_KEY, "gone");
    const projects = [project("p1"), project("p2")];
    expect(resolveTabActiveId(projects, "p1", session)).toBe("p1");
    expect(readTabActiveId(session)).toBe("p1");
  });

  it("merges remote projects while keeping local activeId", () => {
    const previous = [project("p1", "a"), project("p2", "b")];
    const remote = state(
      [project("p1", "a-remote"), project("p2", "b"), project("p3", "")],
      "p3",
    );
    const merged = mergeRemoteProjectsState(remote, "p2", previous);
    expect(merged.activeId).toBe("p2");
    expect(merged.projects).toHaveLength(3);
    expect(merged.projects[0]!.text).toBe("a-remote");
  });

  it("falls back when remote deleted the local active draft", () => {
    const previous = [project("p1"), project("p2"), project("p3")];
    const remote = state([project("p1"), project("p3")], "p3");
    const merged = mergeRemoteProjectsState(remote, "p2", previous);
    // Neighbor before deleted index (same as deleteProject).
    expect(merged.activeId).toBe("p1");
  });

  it("overlays local edit onto remote while keeping other remote drafts", () => {
    const local = state(
      [project("p1", "local-pending"), project("p2", "stale-b")],
      "p1",
    );
    const remote = state(
      [project("p1", "remote-a"), project("p2", "remote-b"), project("p3", "")],
      "p3",
    );
    const merged = mergeRemotePreservingLocalEdit(remote, local, "p1");
    expect(merged.activeId).toBe("p1");
    expect(merged.projects.find((p) => p.id === "p1")!.text).toBe(
      "local-pending",
    );
    expect(merged.projects.find((p) => p.id === "p2")!.text).toBe("remote-b");
    expect(merged.projects).toHaveLength(3);
  });

  it("does not resurrect a remotely deleted edited draft", () => {
    const local = state(
      [project("p1", "one"), project("p2", "local-pending"), project("p3", "three")],
      "p2",
    );
    const remote = state(
      [project("p1", "one"), project("p3", "three")],
      "p3",
    );
    const merged = mergeRemotePreservingLocalEdit(remote, local, "p2");
    expect(merged.projects.some((p) => p.id === "p2")).toBe(false);
    expect(merged.activeId).toBe("p1");
  });
});
