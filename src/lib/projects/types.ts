import type { EditorSettings } from "@/lib/settings";

export type Project = {
  id: string;
  name: string;
  text: string;
  settings: EditorSettings;
  overrides: Record<string, number>;
  /** 0-based primary stress index per normalized word key. */
  stressOverrides: Record<string, number>;
  updatedAt: number;
};

export type ProjectsState = {
  version: 1;
  activeId: string;
  projects: Project[];
};
