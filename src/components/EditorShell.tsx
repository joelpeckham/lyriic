import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { SettingsSheet } from "@/components/SettingsSheet";
import { TextCanvas } from "@/components/TextCanvas";
import { useProjects } from "@/lib/projects/useProjects";

export function EditorShell() {
  const {
    projects,
    active,
    setText,
    setSettings,
    switchProject,
    createProject,
    renameProject,
    deleteProject,
  } = useProjects();

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4">
        <p className="font-[family-name:var(--font-brand)] text-lg tracking-[0.18em] text-foreground/80 uppercase">
          lyriic
        </p>
        <div className="pointer-events-auto flex shrink-0 items-center gap-1">
          <ProjectSwitcher
            projects={projects}
            activeId={active.id}
            onSwitch={switchProject}
            onCreate={() => createProject()}
            onRename={renameProject}
            onDelete={deleteProject}
          />
          <SettingsSheet settings={active.settings} onChange={setSettings} />
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col">
        <TextCanvas
          value={active.text}
          onChange={setText}
          settings={active.settings}
          overrides={active.overrides}
          documentKey={active.id}
        />
      </main>
    </div>
  );
}
