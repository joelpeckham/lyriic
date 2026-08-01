import { Suspense, lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Settings } from "lucide-react";

import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { EditorErrorBoundary } from "@/components/editor/EditorErrorBoundary";
import { PoemEditor } from "@/components/editor/PoemEditor";
import { Button } from "@/components/ui/button";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useMeterSeed } from "@/hooks/useMeterSeed";
import { useProjects } from "@/hooks/useProjects";
import { getMeterCatalogEntry } from "@/lib/meters/presets";
import { writerDocumentMeta } from "@/lib/meters/seed";
import type { EditorSettings } from "@/lib/settings";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";
import { handleAppShortcut } from "@/lib/shortcuts";

const SettingsSheet = lazy(() =>
  import("@/components/SettingsSheet").then((m) => ({
    default: m.SettingsSheet,
  })),
);

function focusPoem(): void {
  const poem = document.getElementById("poem");
  poem?.focus();
}

function SettingsSheetGate({
  settings,
  onChange,
  open,
  onOpenChange,
}: {
  settings: EditorSettings;
  onChange: (next: EditorSettings) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) {
    setMounted(true);
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-10 text-muted-foreground hover:text-foreground"
        aria-label="Open settings"
        onClick={() => {
          setMounted(true);
          onOpenChange(true);
        }}
      >
        <Settings className="size-5" />
      </Button>
    );
  }

  return (
    <Suspense
      fallback={
        <Button
          variant="ghost"
          size="icon"
          className="size-10 text-muted-foreground hover:text-foreground"
          aria-label="Open settings"
          aria-busy="true"
          disabled
        >
          <Settings className="size-5" />
        </Button>
      }
    >
      <SettingsSheet
        settings={settings}
        onChange={onChange}
        open={open}
        onOpenChange={onOpenChange}
      />
    </Suspense>
  );
}

function countWrittenLines(text: string): number {
  if (!text.trim()) return 0;
  return text.split("\n").filter((line) => line.trim().length > 0).length;
}

function ActiveMeterChip({
  meterId,
  writtenLines,
  onOpenSettings,
}: {
  meterId: string;
  writtenLines: number;
  onOpenSettings: () => void;
}) {
  if (meterId === "none") return null;
  const entry = getMeterCatalogEntry(meterId);
  const stanzaLines = entry.stanzaLines ?? null;
  const showLineCount = stanzaLines !== null && stanzaLines > 0;
  const label = showLineCount
    ? `${entry.label} · ${writtenLines} / ${stanzaLines}`
    : entry.label;
  const ariaLabel = showLineCount
    ? `${entry.label}, ${writtenLines} of ${stanzaLines} lines. Open settings to change.`
    : `Meter: ${entry.label}. Open settings to change.`;
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="max-w-56 truncate tabular-nums text-muted-foreground hover:text-foreground"
      onClick={onOpenSettings}
      aria-label={ariaLabel}
    >
      {label}
    </Button>
  );
}

export function EditorShell() {
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const {
    projects,
    active,
    setText,
    setSettings,
    setOverride,
    clearOverride,
    setStressOverride,
    clearStressOverride,
    switchProject,
    createProject,
    applyMeterSeed,
    renameProject,
    deleteProject,
    saveStatus,
  } = useProjects();

  const [settingsOpen, setSettingsOpen] = useState(false);

  useMeterSeed(routeSlug, applyMeterSeed);

  const seededMeta = routeSlug ? writerDocumentMeta(routeSlug) : null;
  // Drop writer SEO meta once the active draft leaves the seeded meter.
  const writerMeta =
    seededMeta && active.settings.meter === routeSlug ? seededMeta : null;

  // Keep the brand title on first paint / sharing; only rename after the draft
  // has content so empty Untitled sessions do not pollute bookmarks.
  const namedDraft =
    active.name.trim() &&
    active.name.trim() !== "Untitled" &&
    active.text.trim().length > 0;
  const pageTitle = writerMeta
    ? writerMeta.title
    : namedDraft
      ? `${active.name.trim()} · lyriic`
      : SITE_TITLE;
  const pageDescription = writerMeta?.description ?? SITE_DESCRIPTION;
  const pagePath = writerMeta?.path ?? "/";

  useDocumentMeta({
    title: pageTitle,
    description: pageDescription,
    path: pagePath,
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      handleAppShortcut(event, {
        settingsOpen,
        setSettingsOpen,
        focusPoem,
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [settingsOpen]);

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col">
      <a
        href="#poem"
        className="bg-background text-foreground ring-ring sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/80 focus:outline-none"
      >
        Skip to poem
      </a>

      <AppHeader
        variant="overlay"
        brandAs="heading"
        actions={
          <nav aria-label="Draft and settings" className="contents">
            <ActiveMeterChip
              meterId={active.settings.meter}
              writtenLines={countWrittenLines(active.text)}
              onOpenSettings={() => setSettingsOpen(true)}
            />
            <ProjectSwitcher
              projects={projects}
              activeId={active.id}
              onSwitch={switchProject}
              onCreate={() => createProject()}
              onRename={renameProject}
              onDelete={deleteProject}
            />
            <SettingsSheetGate
              settings={active.settings}
              onChange={setSettings}
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
            />
          </nav>
        }
      />

      <main className="relative z-10 flex min-h-0 flex-1 flex-col">
        <EditorErrorBoundary key={active.id}>
          <PoemEditor
            value={active.text}
            onChange={setText}
            settings={active.settings}
            overrides={active.overrides}
            onSetOverride={setOverride}
            onClearOverride={clearOverride}
            stressOverrides={active.stressOverrides}
            onSetStressOverride={setStressOverride}
            onClearStressOverride={clearStressOverride}
            documentKey={active.id}
          />
        </EditorErrorBoundary>
      </main>

      {saveStatus === "error" ? (
        <output
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 block px-4 py-3 text-center font-[family-name:var(--font-ui)] text-sm text-[var(--lyriic-over)]"
        >
          Couldn’t save draft. Storage may be full or unavailable.
        </output>
      ) : null}

      <AppFooter variant="overlay" />
    </div>
  );
}
