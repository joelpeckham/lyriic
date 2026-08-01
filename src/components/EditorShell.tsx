import { useEffect } from "react";

import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { SettingsSheet } from "@/components/SettingsSheet";
import { EditorErrorBoundary } from "@/components/editor/EditorErrorBoundary";
import { PoemEditor } from "@/components/editor/PoemEditor";
import { useProjects } from "@/hooks/useProjects";
import { useSyllableOverrides } from "@/hooks/useSyllableOverrides";

export function EditorShell() {
  const {
    projects,
    active,
    setText,
    setSettings,
    setOverride,
    clearOverride,
    switchProject,
    createProject,
    renameProject,
    deleteProject,
    saveStatus,
  } = useProjects();

  useSyllableOverrides(active.overrides);

  useEffect(() => {
    document.title = `${active.name} · lyriic`;
  }, [active.name]);

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col">
      <a
        href="#poem"
        className="bg-background text-foreground ring-ring sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/80 focus:outline-none"
      >
        Skip to poem
      </a>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4">
        <h1 className="font-[family-name:var(--font-brand)] text-lg tracking-[0.18em] text-foreground/80 uppercase">
          lyriic
        </h1>
        <nav
          aria-label="Draft and settings"
          className="pointer-events-auto flex shrink-0 items-center gap-1"
        >
          <ProjectSwitcher
            projects={projects}
            activeId={active.id}
            onSwitch={switchProject}
            onCreate={() => createProject()}
            onRename={renameProject}
            onDelete={deleteProject}
          />
          <SettingsSheet
            settings={active.settings}
            onChange={setSettings}
            overrides={active.overrides}
            onSetOverride={setOverride}
            onClearOverride={clearOverride}
          />
        </nav>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col">
        <EditorErrorBoundary key={active.id}>
          <PoemEditor
            value={active.text}
            onChange={setText}
            settings={active.settings}
            overrides={active.overrides}
            documentKey={active.id}
          />
        </EditorErrorBoundary>
      </main>

      {saveStatus === "error" ? (
        <output
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 block px-4 py-3 text-center font-[family-name:var(--font-ui)] text-sm text-[var(--lyriic-over)]"
        >
          Couldn’t save draft. Storage may be full or unavailable.
        </output>
      ) : null}
    </div>
  );
}
