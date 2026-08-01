import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { useSyllableLineCounts } from "@/components/editor/useSyllableLineCounts";
import { createPoemExtensions } from "@/lib/editor/createPoemExtensions";
import {
  setMeterOverlayData,
  toOverlayLines,
} from "@/lib/editor/meterOverlay";
import { getSyllableOverlay } from "@/lib/editor/syllableOverlay";
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
  /** Stable document identity (e.g. project id) for full remount. */
  documentKey: string;
};

const LIVE_COUNT_DEBOUNCE_MS = 500;

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
  documentKey,
}: PoemEditorProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [liveCountText, setLiveCountText] = useState("");

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const overrideRevision = useMemo(
    () => overridesKey(overrides),
    [overrides],
  );

  const lineCounts = useSyllableLineCounts(
    value,
    documentKey,
    overrideRevision,
    overrides,
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
          onDocChange: (text) => onChangeRef.current(text),
          onActiveLineChange: setActiveLineIndex,
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
    if (current === value) return;
    view.dispatch({
      changes: { from: 0, to: current.length, insert: value },
    });
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
      lines: toOverlayLines(meteredLines, lineCounts.lines),
    });
    getSyllableOverlay(view)?.redraw(view);
  }, [meteredLines, lineCounts.lines, settings.showCounts]);

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
    </div>
  );
}
