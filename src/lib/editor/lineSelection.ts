/** Document caret within the multi-textarea poem model. */
export type CaretPos = {
  line: number;
  offset: number;
};

/** Anchor/focus range produced by drag or keyboard (may be reversed). */
export type LineRange = {
  anchor: CaretPos;
  focus: CaretPos;
};

/** Document-ordered range (start ≤ end). */
export type NormalizedRange = {
  start: CaretPos;
  end: CaretPos;
};

export function compareCaret(a: CaretPos, b: CaretPos): number {
  if (a.line !== b.line) return a.line - b.line;
  return a.offset - b.offset;
}

export function normalizeRange(range: LineRange): NormalizedRange {
  if (compareCaret(range.anchor, range.focus) <= 0) {
    return { start: range.anchor, end: range.focus };
  }
  return { start: range.focus, end: range.anchor };
}

export function isRangeCollapsed(range: LineRange): boolean {
  return compareCaret(range.anchor, range.focus) === 0;
}

export function isFullDocumentRange(
  range: LineRange,
  lines: readonly string[],
): boolean {
  const { start, end } = normalizeRange(range);
  if (lines.length === 0) return true;
  const last = lines.length - 1;
  return (
    start.line === 0 &&
    start.offset === 0 &&
    end.line === last &&
    end.offset === (lines[last]?.length ?? 0)
  );
}

export function extractRangeText(
  lines: readonly string[],
  range: LineRange,
): string {
  const { start, end } = normalizeRange(range);
  if (start.line === end.line) {
    return (lines[start.line] ?? "").slice(start.offset, end.offset);
  }
  const parts: string[] = [(lines[start.line] ?? "").slice(start.offset)];
  for (let i = start.line + 1; i < end.line; i++) {
    parts.push(lines[i] ?? "");
  }
  parts.push((lines[end.line] ?? "").slice(0, end.offset));
  return parts.join("\n");
}

/** Replace a range with `insert` (may contain newlines). Returns next lines + caret. */
export function replaceRange(
  lines: readonly string[],
  range: LineRange,
  insert: string,
): { lines: string[]; caret: CaretPos } {
  const { start, end } = normalizeRange(range);
  const before = (lines[start.line] ?? "").slice(0, start.offset);
  const after = (lines[end.line] ?? "").slice(end.offset);
  const inserted = insert.replace(/\r\n/g, "\n").split("\n");
  const next = [...lines];

  if (inserted.length === 1) {
    next[start.line] = before + inserted[0]! + after;
    next.splice(start.line + 1, end.line - start.line);
    return {
      lines: next.length > 0 ? next : [""],
      caret: {
        line: start.line,
        offset: before.length + inserted[0]!.length,
      },
    };
  }

  const lastInsert = inserted[inserted.length - 1]!;
  next[start.line] = before + inserted[0]!;
  next.splice(
    start.line + 1,
    end.line - start.line,
    ...inserted.slice(1, -1),
    lastInsert + after,
  );
  const caretLine = start.line + inserted.length - 1;
  return {
    lines: next.length > 0 ? next : [""],
    caret: { line: caretLine, offset: lastInsert.length },
  };
}

export type LineHighlight = {
  before: string;
  selected: string;
  after: string;
  /** Empty line inside a multi-line range — show a thin marker. */
  emptyMarker: boolean;
};

/** Text segments to paint for a single poetic line under a range selection. */
export function highlightForLine(
  line: string,
  lineIndex: number,
  range: LineRange,
): LineHighlight | null {
  const { start, end } = normalizeRange(range);
  if (lineIndex < start.line || lineIndex > end.line) return null;

  if (start.line === end.line) {
    if (start.offset === end.offset) return null;
    return {
      before: line.slice(0, start.offset),
      selected: line.slice(start.offset, end.offset),
      after: line.slice(end.offset),
      emptyMarker: false,
    };
  }

  if (lineIndex === start.line) {
    const selected = line.slice(start.offset);
    return {
      before: line.slice(0, start.offset),
      selected,
      after: "",
      emptyMarker: selected.length === 0,
    };
  }

  if (lineIndex === end.line) {
    const selected = line.slice(0, end.offset);
    return {
      before: "",
      selected,
      after: line.slice(end.offset),
      emptyMarker: selected.length === 0 && end.offset === 0,
    };
  }

  // Middle line — fully selected.
  return {
    before: "",
    selected: line,
    after: "",
    emptyMarker: line.length === 0,
  };
}
