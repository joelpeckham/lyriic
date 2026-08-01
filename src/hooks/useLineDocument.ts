import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

import {
  caretIndexFromPoint,
  isCaretOnFirstVisualRow,
  isCaretOnLastVisualRow,
  lineIndexFromPoint,
} from "@/lib/editor/caretGeometry";
import {
  extractRangeText,
  isFullDocumentRange,
  isRangeCollapsed,
  normalizeRange,
  replaceRange,
  type LineRange,
} from "@/lib/editor/lineSelection";

function splitLines(value: string): string[] {
  return value.split("\n");
}

function joinLines(lines: string[]): string {
  return lines.join("\n");
}

export type PendingFocus = { index: number; offset: number };

type UseLineDocumentArgs = {
  /** Document text — drives pending-focus restoration after mutations. */
  value: string;
  lines: string[];
  onChange: (value: string) => void;
  lineRefs: RefObject<Array<HTMLTextAreaElement | null>>;
  markDirty: (...indices: number[]) => void;
  markAllDirty: () => void;
  setActiveLineIndex: (index: number) => void;
};

type DragState = {
  anchorLine: number;
  /** Resolved after the browser places the caret on pointerdown. */
  anchorOffset: number | null;
  pointerId: number;
  /**
   * Once the pointer leaves the anchor line, stay on the custom range model
   * even if it returns to that line (native selection was already collapsed).
   */
  crossedLines: boolean;
};

/**
 * Multi-textarea document model: line edits, Enter/Backspace/Delete merge,
 * paste reflow, whole-poem / cross-line selection, and pending focus.
 */
export function useLineDocument({
  value,
  lines,
  onChange,
  lineRefs,
  markDirty,
  markAllDirty,
  setActiveLineIndex,
}: UseLineDocumentArgs) {
  const pendingFocusRef = useRef<PendingFocus | null>(null);
  /** Whole-poem selection (Cmd/Ctrl+A); native select-all is per-textarea. */
  const [selectAll, setSelectAll] = useState(false);
  /** Cross-line drag (or shift) selection when focus line ≠ anchor line. */
  const [lineRange, setLineRange] = useState<LineRange | null>(null);
  const selectAllRef = useRef(false);
  const lineRangeRef = useRef<LineRange | null>(null);
  const linesRef = useRef<string[]>([]);
  const dragRef = useRef<DragState | null>(null);

  useLayoutEffect(() => {
    selectAllRef.current = selectAll;
  }, [selectAll]);

  useLayoutEffect(() => {
    lineRangeRef.current = lineRange;
  }, [lineRange]);

  useLayoutEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  useLayoutEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) return;
    pendingFocusRef.current = null;
    const el = lineRefs.current[pending.index];
    if (!el) return;
    setActiveLineIndex(pending.index);
    el.focus();
    const offset = Math.min(pending.offset, el.value.length);
    el.setSelectionRange(offset, offset);
  }, [value, lineRefs, setActiveLineIndex]);

  const clearCustomSelection = () => {
    setSelectAll(false);
    setLineRange(null);
  };

  useEffect(() => {
    const collapseNativeSelections = () => {
      for (const el of lineRefs.current) {
        if (!el) continue;
        const caret = el.selectionStart;
        el.setSelectionRange(caret, caret);
      }
    };

    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (event.pointerId !== drag.pointerId) return;
      if (event.buttons === 0) return;

      const els = lineRefs.current;
      const anchorEl = els[drag.anchorLine];
      if (!anchorEl) return;

      if (drag.anchorOffset === null) {
        // Fallback if pointerdown couldn't resolve (shouldn't happen).
        drag.anchorOffset = caretIndexFromPoint(
          anchorEl,
          event.clientX,
          event.clientY,
        );
      }

      const focusLine = lineIndexFromPoint(els, event.clientY);
      const focusEl = els[focusLine];
      if (!focusEl) return;
      const focusOffset = caretIndexFromPoint(
        focusEl,
        event.clientX,
        event.clientY,
      );

      if (focusLine !== drag.anchorLine) {
        drag.crossedLines = true;
      }

      // Pure same-line drags keep native ::selection until we ever leave the line.
      if (!drag.crossedLines) {
        setLineRange(null);
        return;
      }

      setSelectAll(false);
      setLineRange({
        anchor: { line: drag.anchorLine, offset: drag.anchorOffset },
        focus: { line: focusLine, offset: focusOffset },
      });
      setActiveLineIndex(focusLine);
      // Keep focus on the anchor textarea for keyboard/clipboard; visual range
      // is driven by state. Collapse natives so ::selection doesn't stack.
      collapseNativeSelections();
      if (document.activeElement !== anchorEl) {
        anchorEl.focus({ preventScroll: true });
      }
    };

    const onUp = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      dragRef.current = null;

      const range = lineRangeRef.current;
      if (!range || isRangeCollapsed(range)) return;

      const { start, end } = normalizeRange(range);

      // Hand a same-line result back to native selection for a normal caret UX.
      if (start.line === end.line) {
        setLineRange(null);
        const el = lineRefs.current[start.line];
        if (el) {
          setActiveLineIndex(start.line);
          el.focus({ preventScroll: true });
          el.setSelectionRange(start.offset, end.offset);
        }
        return;
      }

      collapseNativeSelections();
      setActiveLineIndex(end.line);
      lineRefs.current[end.line]?.focus({ preventScroll: true });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [lineRefs, setActiveLineIndex]);

  const updateLines = (
    next: string[],
    focus?: PendingFocus,
    dirty: number[] | "all" = "all",
  ) => {
    if (focus) pendingFocusRef.current = focus;
    if (dirty === "all") {
      markAllDirty();
    } else {
      markDirty(...dirty);
    }
    onChange(joinLines(next));
  };

  const onLineChange = (index: number, text: string) => {
    const cleaned = text.replace(/\n/g, "");
    const next = [...lines];
    next[index] = cleaned;
    updateLines(next, undefined, [index]);
  };

  const focusLine = (index: number, offset: number) => {
    clearCustomSelection();
    setActiveLineIndex(index);
    const el = lineRefs.current[index];
    if (!el) return;
    el.focus();
    const nextOffset = Math.min(Math.max(0, offset), el.value.length);
    el.setSelectionRange(nextOffset, nextOffset);
  };

  const replaceDocument = (
    next: string[],
    focus?: PendingFocus,
  ) => {
    clearCustomSelection();
    const safe = next.length > 0 ? next : [""];
    updateLines(
      safe,
      focus ?? {
        index: 0,
        offset: safe[0]?.length ?? 0,
      },
      "all",
    );
  };

  const applyRangeReplacement = (insert: string) => {
    const range = lineRangeRef.current;
    if (!range) return false;
    const { lines: next, caret } = replaceRange(linesRef.current, range, insert);
    clearCustomSelection();
    updateLines(next, { index: caret.line, offset: caret.offset }, "all");
    return true;
  };

  const onLinePointerDown = (
    index: number,
    event: ReactPointerEvent<HTMLTextAreaElement>,
  ) => {
    if (event.button !== 0) return;
    clearCustomSelection();
    const el = event.currentTarget;
    dragRef.current = {
      anchorLine: index,
      // Use the down point so later same-line native drags don't move the anchor.
      anchorOffset: caretIndexFromPoint(el, event.clientX, event.clientY),
      pointerId: event.pointerId,
      crossedLines: false,
    };
  };

  const onLineKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    const ta = event.currentTarget;
    const { selectionStart, selectionEnd } = ta;
    const mod = event.metaKey || event.ctrlKey;
    const hasRange = lineRange !== null && !isRangeCollapsed(lineRange);
    const hasCustom = selectAll || hasRange;

    if (mod && event.key.toLowerCase() === "a") {
      event.preventDefault();
      setLineRange(null);
      setSelectAll(true);
      // Collapse native selection — visual highlight is the text-shaped overlay.
      const caret = ta.selectionStart;
      ta.setSelectionRange(caret, caret);
      return;
    }

    if (hasCustom) {
      if (event.key === "Escape") {
        event.preventDefault();
        clearCustomSelection();
        ta.setSelectionRange(selectionStart, selectionStart);
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        if (selectAll) {
          replaceDocument([""], { index: 0, offset: 0 });
        } else {
          applyRangeReplacement("");
        }
        return;
      }

      if (event.key === "Enter" && !event.nativeEvent.isComposing) {
        event.preventDefault();
        if (selectAll) {
          replaceDocument(["", ""], { index: 1, offset: 0 });
        } else {
          applyRangeReplacement("\n");
        }
        return;
      }

      if (mod && event.key.toLowerCase() === "c") {
        event.preventDefault();
        event.nativeEvent.stopImmediatePropagation?.();
        const text = selectAll
          ? joinLines(lines)
          : extractRangeText(lines, lineRange!);
        void navigator.clipboard.writeText(text);
        return;
      }

      if (mod && event.key.toLowerCase() === "x") {
        event.preventDefault();
        const text = selectAll
          ? joinLines(lines)
          : extractRangeText(lines, lineRange!);
        void navigator.clipboard.writeText(text);
        if (selectAll) {
          replaceDocument([""], { index: 0, offset: 0 });
        } else {
          applyRangeReplacement("");
        }
        return;
      }

      if (
        !mod &&
        !event.altKey &&
        event.key.length === 1 &&
        !event.nativeEvent.isComposing
      ) {
        event.preventDefault();
        if (selectAll) {
          replaceDocument([event.key], { index: 0, offset: 1 });
        } else {
          applyRangeReplacement(event.key);
        }
        return;
      }

      if (event.key.startsWith("Arrow") || event.key === "Tab") {
        clearCustomSelection();
        // Fall through to normal handling / browser Tab.
      } else if (!mod) {
        return;
      }
    }

    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      const before = lines[index]!.slice(0, selectionStart);
      const after = lines[index]!.slice(selectionEnd);
      const next = [...lines];
      next[index] = before;
      next.splice(index + 1, 0, after);
      updateLines(next, { index: index + 1, offset: 0 }, [index, index + 1]);
      return;
    }

    if (
      event.key === "Backspace" &&
      selectionStart === 0 &&
      selectionEnd === 0 &&
      index > 0
    ) {
      event.preventDefault();
      const prevLen = lines[index - 1]!.length;
      const next = [...lines];
      next[index - 1] = next[index - 1]! + next[index]!;
      next.splice(index, 1);
      updateLines(next, { index: index - 1, offset: prevLen }, [
        index - 1,
        index,
      ]);
      return;
    }

    if (
      event.key === "Delete" &&
      selectionStart === selectionEnd &&
      selectionStart === lines[index]!.length &&
      index < lines.length - 1
    ) {
      event.preventDefault();
      const joinAt = lines[index]!.length;
      const next = [...lines];
      next[index] = next[index]! + next[index + 1]!;
      next.splice(index + 1, 1);
      updateLines(next, { index, offset: joinAt }, [index, index + 1]);
      return;
    }

    if (
      event.key === "ArrowLeft" &&
      selectionStart === 0 &&
      selectionEnd === 0 &&
      index > 0
    ) {
      event.preventDefault();
      focusLine(index - 1, lines[index - 1]!.length);
      return;
    }

    if (
      event.key === "ArrowRight" &&
      selectionStart === selectionEnd &&
      selectionStart === lines[index]!.length &&
      index < lines.length - 1
    ) {
      event.preventDefault();
      focusLine(index + 1, 0);
      return;
    }

    if (
      event.key === "ArrowUp" &&
      index > 0 &&
      selectionStart === selectionEnd &&
      isCaretOnFirstVisualRow(ta)
    ) {
      event.preventDefault();
      focusLine(index - 1, selectionStart);
      return;
    }

    if (
      event.key === "ArrowDown" &&
      index < lines.length - 1 &&
      selectionStart === selectionEnd &&
      isCaretOnLastVisualRow(ta)
    ) {
      event.preventDefault();
      focusLine(index + 1, selectionStart);
    }
  };

  const onLinePaste = (
    index: number,
    event: ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const pasted = event.clipboardData.getData("text").replace(/\r\n/g, "\n");

    if (selectAll) {
      event.preventDefault();
      const next = splitLines(pasted);
      const focusIndex = Math.max(0, next.length - 1);
      const focusOffset = next[focusIndex]?.length ?? 0;
      replaceDocument(next, { index: focusIndex, offset: focusOffset });
      return;
    }

    if (lineRange && !isRangeCollapsed(lineRange)) {
      event.preventDefault();
      applyRangeReplacement(pasted);
      return;
    }

    if (!pasted.includes("\n")) return;

    event.preventDefault();
    const ta = event.currentTarget;
    const { selectionStart, selectionEnd } = ta;
    const parts = pasted.split("\n");
    const before = lines[index]!.slice(0, selectionStart);
    const after = lines[index]!.slice(selectionEnd);
    const next = [...lines];
    next[index] = before + parts[0]!;
    const rest = parts.slice(1);
    if (rest.length > 0) {
      rest[rest.length - 1] = rest[rest.length - 1]! + after;
      next.splice(index + 1, 0, ...rest);
      const focusIndex = index + rest.length;
      const focusOffset = rest[rest.length - 1]!.length - after.length;
      const dirty = Array.from(
        { length: rest.length + 1 },
        (_, i) => index + i,
      );
      updateLines(next, { index: focusIndex, offset: Math.max(0, focusOffset) }, dirty);
    } else {
      next[index] = before + parts[0]! + after;
      updateLines(
        next,
        {
          index,
          offset: before.length + parts[0]!.length,
        },
        [index],
      );
    }
  };

  const onLineCopy = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    if (selectAllRef.current) {
      event.preventDefault();
      event.clipboardData.setData("text/plain", joinLines(linesRef.current));
      return;
    }
    const range = lineRangeRef.current;
    if (range && !isRangeCollapsed(range)) {
      event.preventDefault();
      event.clipboardData.setData(
        "text/plain",
        extractRangeText(linesRef.current, range),
      );
    }
  };

  const onLineCut = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    if (selectAllRef.current) {
      event.preventDefault();
      event.clipboardData.setData("text/plain", joinLines(linesRef.current));
      replaceDocument([""], { index: 0, offset: 0 });
      return;
    }
    const range = lineRangeRef.current;
    if (range && !isRangeCollapsed(range)) {
      event.preventDefault();
      event.clipboardData.setData(
        "text/plain",
        extractRangeText(linesRef.current, range),
      );
      applyRangeReplacement("");
    }
  };

  const hasCustomSelection =
    selectAll || (lineRange !== null && !isRangeCollapsed(lineRange));

  // Treat a drag that covers the whole doc like select-all for overlay simplicity.
  const effectiveSelectAll =
    selectAll ||
    (lineRange !== null && isFullDocumentRange(lineRange, lines));

  return {
    selectAll: effectiveSelectAll,
    lineRange: effectiveSelectAll ? null : lineRange,
    hasCustomSelection,
    setSelectAll,
    clearCustomSelection,
    onLinePointerDown,
    onLineChange,
    onLineKeyDown,
    onLinePaste,
    onLineCopy,
    onLineCut,
  };
}
