import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useParams } from "react-router-dom";
import { Settings } from "lucide-react";
import { toast } from "sonner";

import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import type { SettingsFocusSection } from "@/components/SettingsSheet";
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
import { saveProjectsState } from "@/lib/projects/storage";
import type { EditorSettings } from "@/lib/settings";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";
import { handleAppShortcut } from "@/lib/shortcuts";
import { cn } from "@/lib/utils";

const SettingsSheet = lazy(() =>
  import("@/components/SettingsSheet").then((m) => ({
    default: m.SettingsSheet,
  })),
);

const METER_CHIP_LONG_PRESS_MS = 450;

function focusPoem(): void {
  const poem = document.getElementById("poem");
  poem?.focus();
}

function SettingsSheetGate({
  settings,
  onChange,
  open,
  onOpenChange,
  focusSection,
}: {
  settings: EditorSettings;
  onChange: (next: EditorSettings) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  focusSection: SettingsFocusSection;
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
        focusSection={focusSection}
      />
    </Suspense>
  );
}

function ActiveMeterChip({
  meterId,
  customPattern,
  writtenLines,
  firstRunCta,
  onOpenSettings,
  onOpenOverlays,
  onCycleCounts,
}: {
  meterId: string;
  customPattern: readonly number[];
  writtenLines: number;
  firstRunCta: boolean;
  onOpenSettings: () => void;
  onOpenOverlays: () => void;
  onCycleCounts: () => void;
}) {
  const { label, ariaLabel } = formatActiveMeterChip(
    meterId,
    customPattern,
    writtenLines,
  );
  const muted = meterId === "none";
  const longPressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);

  const clearLongPress = () => {
    if (longPressTimer.current != null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    longPressed.current = false;
    clearLongPress();
    longPressTimer.current = window.setTimeout(() => {
      longPressTimer.current = null;
      longPressed.current = true;
      onOpenOverlays();
    }, METER_CHIP_LONG_PRESS_MS);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "max-w-56 truncate tabular-nums",
        firstRunCta
          ? "text-foreground/75 hover:text-foreground"
          : muted
            ? "text-muted-foreground/70 hover:text-foreground"
            : "text-muted-foreground hover:text-foreground",
      )}
      onClick={(event) => {
        if (longPressed.current) {
          longPressed.current = false;
          return;
        }
        if (event.altKey) {
          onCycleCounts();
          return;
        }
        onOpenSettings();
      }}
      onPointerDown={onPointerDown}
      onPointerUp={clearLongPress}
      onPointerLeave={clearLongPress}
      onPointerCancel={clearLongPress}
      onContextMenu={(event) => {
        event.preventDefault();
        onCycleCounts();
      }}
      aria-label={`${ariaLabel} Long-press for overlays.`}
      title="Click for meter · hold for overlays · right-click toggles counts"
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
  const [settingsFocus, setSettingsFocus] =
    useState<SettingsFocusSection>(null);
  const [saveFailReason, setSaveFailReason] = useState<
    "quota" | "unavailable" | null
  >(null);
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

  useEffect(() => {
    if (saveStatus !== "error") {
      const clear = window.setTimeout(() => setSaveFailReason(null), 0);
      return () => window.clearTimeout(clear);
    }
    // Diagnose once per error episode (avoid re-writing on every keystroke).
    const result = saveProjectsState({
      version: 1,
      activeId: active.id,
      projects,
    });
    if (!result.ok) {
      const set = window.setTimeout(() => setSaveFailReason(result.reason), 0);
      return () => window.clearTimeout(set);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reason only when status flips
  }, [saveStatus]);

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
      toast("Downloaded raw backup");
    } else {
      toast("No backup found");
    }
  };

  const handleRetrySave = () => {
    const result = saveProjectsState({
      version: 1,
      activeId: active.id,
      projects,
    });
    if (result.ok) {
      // Re-enter the projects autosave path so saveStatus clears.
      setText(active.text);
      setSaveFailReason(null);
      toast("Draft saved");
      return;
    }
    setSaveFailReason(result.reason);
    toast(
      result.reason === "quota"
        ? "Storage is full"
        : "Storage unavailable",
    );
  };

  const openSettings = (section: SettingsFocusSection = null) => {
    setSettingsFocus(section);
    setSettingsOpen(true);
  };

  const writtenLines = countPoemLines(active.text);
  const firstRunCta =
    active.settings.meter === "none" && active.text.trim().length < 80;

  const saveErrorMessage =
    saveFailReason === "quota"
      ? "Couldn’t save — storage is full."
      : saveFailReason === "unavailable"
        ? "Couldn’t save — storage unavailable."
        : "Couldn’t save draft. Storage may be full or unavailable.";

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
              writtenLines={writtenLines}
              firstRunCta={firstRunCta}
              onOpenSettings={() => openSettings(null)}
              onOpenOverlays={() => openSettings("overlays")}
              onCycleCounts={() =>
                setSettings({
                  ...active.settings,
                  showCounts: !active.settings.showCounts,
                })
              }
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
              onOpenChange={(open) => {
                setSettingsOpen(open);
                if (!open) setSettingsFocus(null);
              }}
              focusSection={settingsFocus}
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
          <span>
            Couldn’t read saved drafts — you’re on a fresh draft. Download keeps
            a raw backup; lyriic can’t re-import it.
          </span>
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
          <span>{saveErrorMessage}</span>
          <span className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="border-[var(--lyriic-over)]/40 text-[var(--lyriic-over)] hover:bg-[var(--lyriic-over)]/10 hover:text-[var(--lyriic-over)]"
              onClick={handleRetrySave}
            >
              Try again
            </Button>
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
