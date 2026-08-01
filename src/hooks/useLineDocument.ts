import {
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";

import {
  isCaretOnFirstVisualRow,
  isCaretOnLastVisualRow,
} from "@/lib/editor/caretGeometry";

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

/**
 * Multi-textarea document model: line edits, Enter/Backspace/Delete merge,
 * paste reflow, whole-poem select-all / copy / cut / paste, and pending focus.
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
  const selectAllRef = useRef(false);
  const linesRef = useRef<string[]>([]);

  useLayoutEffect(() => {
    selectAllRef.current = selectAll;
  }, [selectAll]);

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
    const el = lineRefs.current[index];
    if (!el) return;
    setSelectAll(false);
    setActiveLineIndex(index);
    el.focus();
    const nextOffset = Math.min(Math.max(0, offset), el.value.length);
    el.setSelectionRange(nextOffset, nextOffset);
  };

  const replaceDocument = (
    next: string[],
    focus?: PendingFocus,
  ) => {
    setSelectAll(false);
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

  const onLineKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    const ta = event.currentTarget;
    const { selectionStart, selectionEnd } = ta;
    const mod = event.metaKey || event.ctrlKey;

    if (mod && event.key.toLowerCase() === "a") {
      event.preventDefault();
      setSelectAll(true);
      ta.setSelectionRange(0, ta.value.length);
      return;
    }

    if (selectAll) {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectAll(false);
        ta.setSelectionRange(selectionStart, selectionStart);
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        replaceDocument([""], { index: 0, offset: 0 });
        return;
      }

      if (event.key === "Enter" && !event.nativeEvent.isComposing) {
        event.preventDefault();
        replaceDocument(["", ""], { index: 1, offset: 0 });
        return;
      }

      if (mod && event.key.toLowerCase() === "c") {
        event.preventDefault();
        event.nativeEvent.stopImmediatePropagation?.();
        void navigator.clipboard.writeText(joinLines(lines));
        return;
      }

      if (mod && event.key.toLowerCase() === "x") {
        event.preventDefault();
        void navigator.clipboard.writeText(joinLines(lines));
        replaceDocument([""], { index: 0, offset: 0 });
        return;
      }

      if (
        !mod &&
        !event.altKey &&
        event.key.length === 1 &&
        !event.nativeEvent.isComposing
      ) {
        event.preventDefault();
        replaceDocument([event.key], { index: 0, offset: 1 });
        return;
      }

      if (event.key.startsWith("Arrow") || event.key === "Tab") {
        setSelectAll(false);
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
    if (!selectAllRef.current) return;
    event.preventDefault();
    event.clipboardData.setData("text/plain", joinLines(linesRef.current));
  };

  const onLineCut = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    if (!selectAllRef.current) return;
    event.preventDefault();
    event.clipboardData.setData("text/plain", joinLines(linesRef.current));
    replaceDocument([""], { index: 0, offset: 0 });
  };

  return {
    selectAll,
    setSelectAll,
    onLineChange,
    onLineKeyDown,
    onLinePaste,
    onLineCopy,
    onLineCut,
  };
}
