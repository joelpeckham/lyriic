import { useEffect, useMemo, useRef, useState } from "react";

import { LineCountOverlay } from "@/components/editor/LineCountOverlay";
import { useLineAutosize } from "@/hooks/useLineAutosize";
import { useLineDocument } from "@/hooks/useLineDocument";
import { highlightForLine, type LineRange } from "@/lib/editor/lineSelection";
import {
  buildMeteredLines,
  formatMeterLabel,
  getMeterPreset,
} from "@/lib/meters";
import type { EditorSettings } from "@/lib/settings";
import {
  countLinesIncremental,
  type LineSyllableCount,
} from "@/lib/syllables";
import { cn } from "@/lib/utils";

type TextCanvasProps = {
  value: string;
  onChange: (value: string) => void;
  settings: EditorSettings;
  /** Active project overrides — used only to invalidate count cache. */
  overrides: Record<string, number>;
  /** Stable document identity (e.g. project id) for full remount sizing. */
  documentKey: string;
};

/**
 * Soft-wrap leading within a poetic line (unitless, scales with font-size).
 * Must stay > 1 so descenders (y, g, p) are not clipped by overflow:hidden.
 */
const WRAP_LEADING = 1.35;
/** Extra space between hard-newline poetic lines. */
const LINE_GAP_CLASS = "gap-4";
const LIVE_COUNT_DEBOUNCE_MS = 500;

function overridesKey(overrides: Record<string, number>): string {
  return Object.keys(overrides)
    .sort()
    .map((key) => `${key}:${overrides[key]}`)
    .join("|");
}

function SelectionHighlight({
  line,
  lineIndex,
  selectAll,
  lineRange,
  fontSizeRem,
}: {
  line: string;
  lineIndex: number;
  selectAll: boolean;
  lineRange: LineRange | null;
  fontSizeRem: string;
}) {
  const highlight = selectAll
    ? line.length > 0
      ? {
          before: "",
          selected: line,
          after: "",
          emptyMarker: false,
        }
      : null
    : lineRange
      ? highlightForLine(line, lineIndex, lineRange)
      : null;

  if (!highlight) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 pr-12 whitespace-pre-wrap break-words font-[family-name:var(--font-editor)] tracking-[0.01em] text-transparent"
      style={{
        fontSize: fontSizeRem,
        lineHeight: WRAP_LEADING,
      }}
    >
      {highlight.before}
      {highlight.emptyMarker ? (
        <span className="inline-block min-w-[0.35em] rounded-[0.12em] bg-[var(--lyriic-selection)]">
          &nbsp;
        </span>
      ) : (
        <span className="rounded-[0.12em] bg-[var(--lyriic-selection)] box-decoration-clone">
          {highlight.selected}
        </span>
      )}
      {highlight.after}
    </div>
  );
}

export function TextCanvas({
  value,
  onChange,
  settings,
  overrides,
  documentKey,
}: TextCanvasProps) {
  const lineRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [liveCountText, setLiveCountText] = useState("");
  /** Previous count snapshot — updated during render (derived-state pattern). */
  const [countSnapshot, setCountSnapshot] = useState<{
    value: string;
    lines: string[];
    counts: LineSyllableCount[];
    documentKey: string;
    overrideRevision: string;
  } | null>(null);

  const lines = useMemo(() => value.split("\n"), [value]);
  const overrideRevision = useMemo(
    () => overridesKey(overrides),
    [overrides],
  );

  let lineCounts: { lines: string[]; counts: LineSyllableCount[] };
  if (
    countSnapshot &&
    countSnapshot.value === value &&
    countSnapshot.documentKey === documentKey &&
    countSnapshot.overrideRevision === overrideRevision
  ) {
    lineCounts = {
      lines: countSnapshot.lines,
      counts: countSnapshot.counts,
    };
  } else {
    const policyChanged =
      !countSnapshot ||
      countSnapshot.documentKey !== documentKey ||
      countSnapshot.overrideRevision !== overrideRevision;
    lineCounts = countLinesIncremental(
      value,
      policyChanged ? null : (countSnapshot?.lines ?? null),
      policyChanged ? null : (countSnapshot?.counts ?? null),
    );
    setCountSnapshot({
      value,
      lines: lineCounts.lines,
      counts: lineCounts.counts,
      documentKey,
      overrideRevision,
    });
  }

  const pattern = useMemo((): readonly number[] => {
    if (settings.meter === "custom") return [settings.customSyllables];
    return getMeterPreset(settings.meter).pattern;
  }, [settings.meter, settings.customSyllables]);

  const meteredLines = useMemo(
    () => buildMeteredLines(lineCounts.counts, pattern),
    [lineCounts.counts, pattern],
  );

  const { markDirty, markAllDirty } = useLineAutosize({
    value,
    linesLength: lines.length,
    fontSize: settings.fontSize,
    documentKey,
    containerRef,
    lineRefs,
  });

  const {
    selectAll,
    lineRange,
    hasCustomSelection,
    onLinePointerDown,
    onLineChange,
    onLineKeyDown,
    onLinePaste,
    onLineCopy,
    onLineCut,
  } = useLineDocument({
    value,
    lines,
    onChange,
    lineRefs,
    markDirty,
    markAllDirty,
    setActiveLineIndex,
  });

  // Focus the poem on first paint (draft switches remount via key={documentKey}).
  useEffect(() => {
    const el = lineRefs.current[0];
    if (!el) return;
    el.focus();
    el.setSelectionRange(0, 0);
  }, []);

  const safeActiveLineIndex = Math.min(
    activeLineIndex,
    Math.max(0, lines.length - 1),
  );

  // Debounced polite announcement for the focused line's meter status.
  // When counts are hidden, the live region renders "" — no need to clear state.
  useEffect(() => {
    if (!settings.showCounts) return;
    const metered = meteredLines[safeActiveLineIndex];
    if (!metered) return;
    const line = lines[safeActiveLineIndex] ?? "";
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
  }, [safeActiveLineIndex, meteredLines, lines, settings.showCounts]);

  const isEmptyDoc = lines.length === 1 && lines[0] === "";
  const fontSizeRem = `${settings.fontSize}rem`;
  const minLineHeightRem = `${settings.fontSize * WRAP_LEADING}rem`;
  const tabStopIndex = safeActiveLineIndex;

  return (
    <div
      ref={containerRef}
      id="poem"
      tabIndex={-1}
      className="mx-auto h-full w-full max-w-3xl overflow-auto py-16 pr-4 pl-6 outline-none [scrollbar-gutter:stable] focus-visible:outline-none"
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {settings.showCounts ? liveCountText : ""}
      </div>
      <div className={cn("flex flex-col", LINE_GAP_CLASS)}>
        {lines.map((line, index) => {
          const metered = meteredLines[index]!;
          const lineId = `lyriic-line-${index}`;
          const statusId = `${lineId}-status`;

          return (
            <div
              key={index}
              className="relative flex items-start select-none"
            >
              <label className="sr-only select-none" htmlFor={lineId}>
                {`Line ${index + 1}`}
              </label>
              <div className="relative min-w-0 w-full">
                <SelectionHighlight
                  line={line}
                  lineIndex={index}
                  selectAll={selectAll}
                  lineRange={lineRange}
                  fontSizeRem={fontSizeRem}
                />
                <textarea
                  ref={(el) => {
                    lineRefs.current[index] = el;
                  }}
                  id={lineId}
                  value={line}
                  rows={1}
                  spellCheck
                  tabIndex={index === tabStopIndex ? 0 : -1}
                  placeholder={
                    isEmptyDoc && index === 0 ? "Write a line…" : undefined
                  }
                  aria-describedby={
                    settings.showCounts ? statusId : undefined
                  }
                  onFocus={() => setActiveLineIndex(index)}
                  onPointerDown={(event) => onLinePointerDown(index, event)}
                  onChange={(event) => onLineChange(index, event.target.value)}
                  onKeyDown={(event) => onLineKeyDown(index, event)}
                  onPaste={(event) => onLinePaste(index, event)}
                  onCopy={onLineCopy}
                  onCut={onLineCut}
                  className={cn(
                    "relative w-full resize-none overflow-hidden bg-transparent pr-12 select-text",
                    "whitespace-pre-wrap break-words font-[family-name:var(--font-editor)] tracking-[0.01em]",
                    "text-foreground caret-[var(--lyriic-ink)] placeholder:text-[var(--lyriic-subtle-faint)]",
                    "outline-none",
                    // Custom selection uses a text-shaped overlay; suppress native ::selection.
                    hasCustomSelection
                      ? "selection:bg-transparent"
                      : "selection:bg-[var(--lyriic-selection)]",
                  )}
                  style={{
                    fontSize: fontSizeRem,
                    lineHeight: WRAP_LEADING,
                    minHeight: minLineHeightRem,
                  }}
                />
              </div>

              {settings.showCounts && (
                <LineCountOverlay
                  total={metered.total}
                  target={metered.target}
                  status={metered.status}
                  lineHasText={line.length > 0}
                  statusId={statusId}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
