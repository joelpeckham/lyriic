import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";

import { useDictRevision } from "@/hooks/useDictRevision";
import { COUNT_GUTTER_REM, LINE_GAP_REM } from "@/lib/editor/constants";
import { statusClass, tickClass } from "@/lib/editor/syllableOverlay";
import {
  getStressRevision,
  subscribeStressReady,
} from "@/lib/data/stress";
import {
  buildMeteredLine,
  mapSyllableMidpointToOffset,
  mapSyllableToOffset,
  rulerSyllableCount,
  type MeteredLine,
  type MeteredToken,
} from "@/lib/meters";
import { DEFAULT_FONT_SIZE } from "@/lib/prefs";
import { countLine } from "@/lib/syllables";
import { cn } from "@/lib/utils";

export type PoemLine = {
  text: string;
  /**
   * Optional meter target for `total/target` gutter display.
   * When omitted, the live total is used so counts read as exact.
   */
  target?: number;
};

type PoemLinesProps = {
  lines: readonly PoemLine[];
  /** Editor font size in rem. Defaults to the app default. */
  fontSizeRem?: number;
  /** Show ˈ / ˘ stress marks above syllables (editor stress overlay). */
  showStress?: boolean;
  /** Show per-syllable ruler ticks under the line. */
  showRulers?: boolean;
  className?: string;
};

type MarkPoint = {
  left: number;
  top: number;
  key: string;
  stressed?: boolean;
};

function useStressRevision(): number {
  return useSyncExternalStore(
    subscribeStressReady,
    getStressRevision,
    getStressRevision,
  );
}

function meteredForLine(line: PoemLine): MeteredLine {
  const count = countLine(line.text);
  const target = line.target ?? count.total;
  return buildMeteredLine(count, 0, {
    pattern: [target],
  });
}

function measureOffset(
  textEl: HTMLElement,
  offset: number,
  host: HTMLElement,
): { left: number; top: number; bottom: number } | null {
  const textNode = textEl.firstChild;
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return null;
  const length = textNode.textContent?.length ?? 0;
  if (length === 0) return null;

  const clamped = Math.max(0, Math.min(offset, length - 1));
  const range = document.createRange();
  range.setStart(textNode, clamped);
  range.setEnd(textNode, clamped + 1);
  const rect = range.getBoundingClientRect();
  const hostRect = host.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  return {
    left: rect.left + rect.width / 2 - hostRect.left,
    top: rect.top - hostRect.top,
    bottom: rect.bottom - hostRect.top,
  };
}

function collectStressMarks(
  tokens: readonly MeteredToken[],
  textEl: HTMLElement,
  host: HTMLElement,
): MarkPoint[] {
  const marks: MarkPoint[] = [];
  for (const token of tokens) {
    for (let i = 0; i < token.stress.length; i++) {
      const syllableIndex = token.syllableStart + i;
      const offset = mapSyllableMidpointToOffset(tokens, syllableIndex + 1);
      if (offset === null) continue;
      const point = measureOffset(textEl, offset, host);
      if (!point) continue;
      marks.push({
        left: point.left,
        top: point.top,
        key: `s-${syllableIndex}`,
        stressed: token.stress[i] !== 0,
      });
    }
  }
  return marks;
}

function collectRulerTicks(
  metered: MeteredLine,
  textEl: HTMLElement,
  host: HTMLElement,
): MarkPoint[] {
  const ticks: MarkPoint[] = [];
  const tickCount = rulerSyllableCount(metered.total, metered.target);
  for (let s = 1; s <= tickCount; s++) {
    const offset = mapSyllableToOffset(metered.tokens, s);
    if (offset === null) continue;
    const point = measureOffset(textEl, offset, host);
    if (!point) continue;
    ticks.push({
      left: point.left,
      top: point.bottom,
      key: `t-${s}`,
    });
  }
  return ticks;
}

function PoemLineRow({
  line,
  isLast,
  showStress,
  showRulers,
  lineGapRem,
}: {
  line: PoemLine;
  isLast: boolean;
  showStress: boolean;
  showRulers: boolean;
  lineGapRem: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [stressMarks, setStressMarks] = useState<MarkPoint[]>([]);
  const [rulerTicks, setRulerTicks] = useState<MarkPoint[]>([]);

  const dictRev = useDictRevision();
  const stressRev = useStressRevision();
  const { text, target } = line;
  const metered = meteredForLine(line);

  useLayoutEffect(() => {
    const host = hostRef.current;
    const textEl = textRef.current;
    if (!host || !textEl) return;

    const next = meteredForLine({ text, target });

    if (showStress && next.tokens.length > 0) {
      setStressMarks(collectStressMarks(next.tokens, textEl, host));
    } else {
      setStressMarks([]);
    }

    if (showRulers && next.tokens.length > 0) {
      setRulerTicks(collectRulerTicks(next, textEl, host));
    } else {
      setRulerTicks([]);
    }
  }, [text, target, showStress, showRulers, dictRev, stressRev]);

  return (
    <div
      ref={hostRef}
      className="relative"
      style={{
        paddingRight: `${COUNT_GUTTER_REM}em`,
        paddingTop: showStress ? "0.85em" : 0,
        paddingBottom: isLast
          ? showRulers
            ? "0.85em"
            : 0
          : `${lineGapRem}rem`,
      }}
    >
      <span ref={textRef} className="whitespace-pre-wrap">
        {line.text}
      </span>

      {stressMarks.map((mark) => (
        <span
          key={mark.key}
          className={cn(
            "lyriic-stress-mark",
            !mark.stressed && "lyriic-stress-mark--weak",
          )}
          style={{ left: mark.left, top: mark.top }}
          aria-hidden
        >
          {mark.stressed ? "ˈ" : "˘"}
        </span>
      ))}

      {rulerTicks.map((tick, tickIndex) => (
        <span
          key={tick.key}
          className={tickClass(tickIndex + 1, metered.target)}
          style={{ left: tick.left, top: tick.top }}
          aria-hidden
        />
      ))}

      <span
        className={cn("lyriic-count", statusClass(metered.status))}
        style={{
          position: "absolute",
          top: showStress ? "0.85em" : 0,
          right: 0,
          width: `${COUNT_GUTTER_REM}em`,
          paddingRight: "0.25rem",
          paddingTop: "0.35em",
        }}
        aria-hidden
      >
        {metered.total}
        {metered.target != null ? (
          <span className="lyriic-count__target">/{metered.target}</span>
        ) : null}
      </span>
    </div>
  );
}

/**
 * Static poem surface that mirrors editor Literata lines + syllable gutters
 * (and optional stress / ruler overlays) without mounting CodeMirror.
 */
export function PoemLines({
  lines,
  fontSizeRem = DEFAULT_FONT_SIZE,
  showStress = false,
  showRulers = false,
  className,
}: PoemLinesProps) {
  const lineGapRem =
    showStress || showRulers ? LINE_GAP_REM + 0.35 : LINE_GAP_REM;

  const style: CSSProperties = {
    fontSize: `${fontSizeRem}rem`,
    letterSpacing: "0.01em",
    lineHeight: showStress || showRulers ? 1.55 : 1.35,
  };

  return (
    <div
      className={cn(
        "font-[family-name:var(--font-editor)] text-foreground",
        className,
      )}
      style={style}
    >
      {lines.map((line, index) => (
        <PoemLineRow
          key={`${index}-${line.text}`}
          line={line}
          isLast={index === lines.length - 1}
          showStress={showStress}
          showRulers={showRulers}
          lineGapRem={lineGapRem}
        />
      ))}
    </div>
  );
}
