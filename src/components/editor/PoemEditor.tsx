import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Annotation, Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { useSyllableLineCounts } from "@/components/editor/useSyllableLineCounts";
import { WordLookupPopover } from "@/components/editor/WordLookupPopover";
import { WordToolbarPopover } from "@/components/editor/WordToolbarPopover";
import { useDictRevision } from "@/hooks/useDictRevision";
import { createPoemExtensions } from "@/lib/editor/createPoemExtensions";
import {
  setMeterOverlayData,
  toOverlayLines,
} from "@/lib/editor/meterOverlay";
import { getSyllableOverlay } from "@/lib/editor/syllableOverlay";
import {
  lookupRequestFromTarget,
  replaceWordRange,
  type WordLookupRequest,
} from "@/lib/editor/wordLookup";
import {
  dismissWordToolbar,
  setWordToolbarPopoverHovered,
  setWordToolbarSticky,
  type WordToolbarTarget,
} from "@/lib/editor/wordToolbar";
import { zenEditorTheme } from "@/lib/editor/zenTheme";
import {
  buildMeteredLines,
  formatMeterLabel,
  getMeterPreset,
} from "@/lib/meters";
import type { EditorSettings } from "@/lib/settings";

type PoemEditorProps = {
  value: string;
  onChange: (value: string) => void;
  settings: EditorSettings;
  /** Active project overrides — threaded into counting + cache invalidation. */
  overrides: Record<string, number>;
  onSetOverride: (word: string, count: number) => void;
  onClearOverride: (word: string) => void;
  /** Stable document identity (e.g. project id) for full remount. */
  documentKey: string;
  /** Empty-doc placeholder (first-run hint vs short prompt). */
  placeholderText?: string;
};

const LIVE_COUNT_DEBOUNCE_MS = 500;

/** Marks a full-doc replace driven by the React `value` prop (not user typing). */
const externalValueSync = Annotation.define<boolean>();

function overridesKey(overrides: Record<string, number>): string {
  return Object.keys(overrides)
    .sort()
    .map((key) => `${key}:${overrides[key]}`)
    .join("|");
}

export function PoemEditor({
  value,
  onChange,
  settings,
  overrides,
  onSetOverride,
  onClearOverride,
  documentKey,
  placeholderText,
}: PoemEditorProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const onOpenWordLookupRef = useRef<(request: WordLookupRequest) => void>(
    () => {},
  );
  const onWordToolbarChangeRef = useRef<
    (target: WordToolbarTarget | null) => void
  >(() => {});
  /** Live CM document — counts stay in sync even when parent text is debounced. */
  const [liveText, setLiveText] = useState(value);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [liveCountText, setLiveCountText] = useState("");
  const [lookupRequest, setLookupRequest] = useState<WordLookupRequest | null>(
    null,
  );
  const [toolbarTarget, setToolbarTarget] =
    useState<WordToolbarTarget | null>(null);

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useLayoutEffect(() => {
    onOpenWordLookupRef.current = (request) => {
      setToolbarTarget(null);
      setLookupRequest(request);
    };
    onWordToolbarChangeRef.current = (target) => {
      setToolbarTarget(target);
    };
  }, []);

  const overrideRevision = useMemo(
    () => overridesKey(overrides),
    [overrides],
  );
  const dictRevision = useDictRevision();

  const lineCounts = useSyllableLineCounts(
    liveText,
    documentKey,
    overrideRevision,
    overrides,
    dictRevision,
  );

  const pattern = useMemo((): readonly number[] => {
    if (settings.meter === "custom") return [settings.customSyllables];
    return getMeterPreset(settings.meter).pattern;
  }, [settings.meter, settings.customSyllables]);

  const meteredLines = useMemo(
    () => buildMeteredLines(lineCounts.counts, pattern),
    [lineCounts.counts, pattern],
  );

  // Create / destroy the editor once per mount (parent remounts on documentKey).
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const themeComp = themeCompartment.current;
    const state = EditorState.create({
      doc: value,
      extensions: [
        themeComp.of(zenEditorTheme(settings.fontSize)),
        ...createPoemExtensions({
          onDocChange: (text) => {
            setLiveText(text);
            // Toolbar dismisses itself; lookup holds stale replace ranges.
            setLookupRequest(null);
          },
          onActiveLineChange: setActiveLineIndex,
          onOpenWordLookup: (request) => {
            onOpenWordLookupRef.current(request);
          },
          onWordToolbarChange: (target) => {
            onWordToolbarChangeRef.current(target);
          },
          placeholderText,
        }),
        // Parent onChange separately so external value sync can suppress it.
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          if (
            update.transactions.some((tr) => tr.annotation(externalValueSync))
          ) {
            return;
          }
          onChangeRef.current(update.state.doc.toString());
        }),
      ],
    });

    const view = new EditorView({ state, parent });
    viewRef.current = view;
    view.focus();

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Mount once per documentKey (parent remounts). Value/theme sync separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only
  }, []);

  // Sync external document changes (project switch uses remount; this covers
  // rare external sets without remounting).
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current === value) {
      setLiveText((prev) => (prev === value ? prev : value));
      return;
    }
    view.dispatch({
      changes: { from: 0, to: current.length, insert: value },
      annotations: externalValueSync.of(true),
    });
    setLiveText(value);
  }, [value]);

  // Font size → theme compartment.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: themeCompartment.current.reconfigure(
        zenEditorTheme(settings.fontSize),
      ),
    });
  }, [settings.fontSize]);

  // Push meter overlay data into the editor plugin.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    setMeterOverlayData(view, {
      showCounts: settings.showCounts,
      showRulers: settings.showRulers,
      lines: toOverlayLines(meteredLines, lineCounts.lines),
    });
    getSyllableOverlay(view)?.redraw(view);
  }, [
    meteredLines,
    lineCounts.lines,
    settings.showCounts,
    settings.showRulers,
  ]);

  const safeActiveLineIndex = Math.min(
    activeLineIndex,
    Math.max(0, lineCounts.lines.length - 1),
  );

  // Debounced polite announcement for the focused line's meter status.
  useEffect(() => {
    if (!settings.showCounts) return;
    const metered = meteredLines[safeActiveLineIndex];
    if (!metered) return;
    const line = lineCounts.lines[safeActiveLineIndex] ?? "";
    const next = formatMeterLabel(
      metered.total,
      metered.target,
      metered.status,
      line.length > 0,
    );
    const timer = window.setTimeout(() => {
      setLiveCountText(next);
    }, LIVE_COUNT_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [
    safeActiveLineIndex,
    meteredLines,
    lineCounts.lines,
    settings.showCounts,
  ]);

  return (
    <div
      id="poem"
      tabIndex={-1}
      className="relative mx-auto h-full w-full max-w-none outline-none focus-visible:outline-none"
      onFocus={(event) => {
        // Skip link focuses #poem; move into the single CM textbox tab stop.
        if (event.target === event.currentTarget) {
          viewRef.current?.focus();
        }
      }}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {settings.showCounts ? liveCountText : ""}
      </div>
      <div ref={parentRef} className="h-full w-full" />
      <WordToolbarPopover
        target={toolbarTarget}
        onClose={() => {
          const view = viewRef.current;
          if (view) dismissWordToolbar(view);
          setToolbarTarget(null);
        }}
        onPopoverHoverChange={(hovered) => {
          const view = viewRef.current;
          if (view) setWordToolbarPopoverHovered(view, hovered);
        }}
        onStickyChange={(sticky) => {
          const view = viewRef.current;
          if (view) setWordToolbarSticky(view, sticky);
        }}
        onOpenLookup={(mode) => {
          if (!toolbarTarget) return;
          const request = lookupRequestFromTarget(toolbarTarget, mode);
          const view = viewRef.current;
          if (view) dismissWordToolbar(view);
          setToolbarTarget(null);
          setLookupRequest(request);
        }}
        onSetOverride={onSetOverride}
        onClearOverride={onClearOverride}
        overrides={overrides}
      />
      <WordLookupPopover
        request={lookupRequest}
        onClose={() => setLookupRequest(null)}
        onReplace={(from, to, insert) => {
          const view = viewRef.current;
          if (!view) return;
          replaceWordRange(view, from, to, insert);
        }}
        onRestoreFocus={() => {
          viewRef.current?.focus();
        }}
        meteredLine={
          lookupRequest
            ? meteredLines[lookupRequest.lineIndex]
            : undefined
        }
        overrides={overrides}
        overrideRevision={overrideRevision}
      />
    </div>
  );
}
