import type { EditorSettings } from "@/lib/settings";

export type Project = {
  id: string;
  name: string;
  text: string;
  settings: EditorSettings;
  overrides: Record<string, number>;
  /** 0-based primary stress index per normalized word key. */
  stressOverrides: Record<string, number>;
  /**
   * When true, keep syncing `name` from poem text until the user renames.
   * Absent/false for legacy drafts so existing titles stay locked.
   */
  autoNamed?: boolean;
  updatedAt: number;
};

export type ProjectsState = {
  version: 1;
  activeId: string;
  projects: Project[];
};
