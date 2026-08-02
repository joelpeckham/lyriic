import {
  Suspense,
  lazy,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { useParams } from "react-router-dom";
import { Settings } from "lucide-react";
import { toast } from "sonner";

import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { EditorErrorBoundary } from "@/components/editor/EditorErrorBoundary";
import { PoemEditor } from "@/components/editor/PoemEditor";
import { Button } from "@/components/ui/button";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useMeterSeed } from "@/hooks/useMeterSeed";
import { useProjects } from "@/hooks/useProjects";
import { useToolHandoff } from "@/hooks/useToolHandoff";
import {
  SOFT_KEYBOARD_INSET_PX,
  useVisualViewportBottomInset,
} from "@/hooks/useVisualViewportBottomInset";
import { formatActiveMeterChip } from "@/lib/meters/chipLabel";
import { writerDocumentMeta } from "@/lib/meters/seed";
import {
  copyText,
  countPoemLines,
  downloadTextFile,
  draftFilename,
} from "@/lib/projects/exportDraft";
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

function ActiveMeterChip({
  meterId,
  customPattern,
  writtenLines,
  onOpenSettings,
}: {
  meterId: string;
  customPattern: readonly number[];
  writtenLines: number;
  onOpenSettings: () => void;
}) {
  const { label, ariaLabel } = formatActiveMeterChip(
    meterId,
    customPattern,
    writtenLines,
  );
  const muted = meterId === "none";
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={
        muted
          ? "max-w-56 truncate text-muted-foreground/70 hover:text-foreground"
          : "max-w-56 truncate tabular-nums text-muted-foreground hover:text-foreground"
      }
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
    applyToolDraft,
    applyMeterSeed,
    renameProject,
    deleteProject,
    saveStatus,
    storageQuarantined,
    dismissStorageQuarantine,
    downloadQuarantineBackup,
  } = useProjects();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const vvBottomInset = useVisualViewportBottomInset();
  const softKeyboardUp = vvBottomInset >= SOFT_KEYBOARD_INSET_PX;

  useMeterSeed(routeSlug, applyMeterSeed);
  // Phase 4: one-shot sessionStorage draft from SEO tools (after meter seed).
  useToolHandoff(applyToolDraft);

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

  const handleCopyPoem = () => {
    void copyText(active.text).then((ok) => {
      if (ok) toast("Poem copied");
      else toast("Couldn’t copy — try selecting the text");
    });
  };

  const handleDownloadPoem = () => {
    downloadTextFile(draftFilename(active.name), active.text);
    toast("Downloaded .txt");
  };

  const handleDownloadQuarantine = () => {
    if (downloadQuarantineBackup()) {
      toast("Downloaded backup");
    } else {
      toast("No backup found");
    }
  };

  return (
    <div
      className="relative flex min-h-dvh flex-1 flex-col"
      style={
        {
          ["--lyriic-vv-bottom" as string]: softKeyboardUp
            ? `${vvBottomInset}px`
            : "0px",
        } as CSSProperties
      }
    >
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
              customPattern={active.settings.customPattern}
              writtenLines={countPoemLines(active.text)}
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

      {storageQuarantined ? (
        <output
          aria-live="polite"
          className="pointer-events-auto absolute inset-x-0 top-14 z-20 mx-auto flex max-w-lg flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-2 text-center font-[family-name:var(--font-ui)] text-sm text-foreground"
          style={{
            top: "max(3.5rem, calc(env(safe-area-inset-top, 0px) + 2.5rem))",
          }}
        >
          <span>Couldn’t read saved drafts. A backup was kept.</span>
          <span className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleDownloadQuarantine}
            >
              Download backup
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={dismissStorageQuarantine}
            >
              Dismiss
            </Button>
          </span>
        </output>
      ) : null}

      {saveStatus === "error" ? (
        <output
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-auto absolute inset-x-0 z-20 mx-auto flex max-w-md flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-3 text-center font-[family-name:var(--font-ui)] text-sm text-[var(--lyriic-over)]"
          style={{
            bottom: softKeyboardUp
              ? `calc(${vvBottomInset}px + 0.75rem)`
              : "max(2rem, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <span>Couldn’t save draft. Storage may be full or unavailable.</span>
          <span className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="border-[var(--lyriic-over)]/40 text-[var(--lyriic-over)] hover:bg-[var(--lyriic-over)]/10 hover:text-[var(--lyriic-over)]"
              onClick={handleCopyPoem}
            >
              Copy poem
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="border-[var(--lyriic-over)]/40 text-[var(--lyriic-over)] hover:bg-[var(--lyriic-over)]/10 hover:text-[var(--lyriic-over)]"
              onClick={handleDownloadPoem}
            >
              Download .txt
            </Button>
          </span>
        </output>
      ) : null}

      {!softKeyboardUp ? <AppFooter variant="overlay" /> : null}
    </div>
  );
}
