import type { EditorView } from "@codemirror/view";

import type { MeteredLine } from "@/lib/meters";
import type { SyllableOffsetToken } from "@/lib/meters/mapSyllableToOffset";

export type MeterOverlayToken = SyllableOffsetToken;

export type MeterOverlayLine = {
  total: number;
  target: number | null;
  status: MeteredLine["status"];
  lineHasText: boolean;
  tokens: MeterOverlayToken[];
};

export type MeterOverlayState = {
  showCounts: boolean;
  showRulers: boolean;
  lines: MeterOverlayLine[];
};

const EMPTY: MeterOverlayState = {
  showCounts: false,
  showRulers: false,
  lines: [],
};

/** Per-view meter data for the syllable overlay plugin. */
const overlayByView = new WeakMap<EditorView, MeterOverlayState>();

export function getMeterOverlay(view: EditorView): MeterOverlayState {
  return overlayByView.get(view) ?? EMPTY;
}

export function setMeterOverlayData(
  view: EditorView,
  state: MeterOverlayState,
): void {
  overlayByView.set(view, state);
}

export function toOverlayLines(
  metered: readonly MeteredLine[],
  textLines: readonly string[],
): MeterOverlayLine[] {
  return metered.map((line, index) => ({
    total: line.total,
    target: line.target,
    status: line.status,
    lineHasText: (textLines[index] ?? "").length > 0,
    tokens: line.tokens.map((token) => ({
      start: token.start,
      end: token.end,
      syllables: token.syllables,
      syllableStart: token.syllableStart,
      syllableEnd: token.syllableEnd,
    })),
  }));
}
