import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

function autosize(el: HTMLTextAreaElement): void {
  el.style.height = "0px";
  el.style.height = `${el.scrollHeight}px`;
}

type UseLineAutosizeArgs = {
  value: string;
  linesLength: number;
  fontSize: number;
  documentKey: string;
  containerRef: RefObject<HTMLDivElement | null>;
  lineRefs: RefObject<Array<HTMLTextAreaElement | null>>;
};

/**
 * Tracks dirty poetic lines and resizes their textareas after value/font/
 * document changes and container ResizeObserver events.
 */
export function useLineAutosize({
  value,
  linesLength,
  fontSize,
  documentKey,
  containerRef,
  lineRefs,
}: UseLineAutosizeArgs): {
  markDirty: (...indices: number[]) => void;
  markAllDirty: () => void;
} {
  const dirtyLinesRef = useRef<Set<number> | "all">("all");
  const prevDocumentKeyForSizeRef = useRef(documentKey);

  const markDirty = (...indices: number[]) => {
    if (dirtyLinesRef.current === "all") return;
    for (const index of indices) {
      if (index >= 0) dirtyLinesRef.current.add(index);
    }
  };

  const markAllDirty = () => {
    dirtyLinesRef.current = "all";
  };

  useLayoutEffect(() => {
    if (prevDocumentKeyForSizeRef.current !== documentKey) {
      dirtyLinesRef.current = "all";
      prevDocumentKeyForSizeRef.current = documentKey;
    }
    const dirty = dirtyLinesRef.current;
    if (dirty === "all") {
      for (const el of lineRefs.current) {
        if (el) autosize(el);
      }
    } else {
      for (const index of dirty) {
        const el = lineRefs.current[index];
        if (el) autosize(el);
      }
    }
    dirtyLinesRef.current = new Set();
  }, [value, linesLength, fontSize, documentKey, lineRefs]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      dirtyLinesRef.current = "all";
      for (const el of lineRefs.current) {
        if (el) autosize(el);
      }
      dirtyLinesRef.current = new Set();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [containerRef, lineRefs]);

  return { markDirty, markAllDirty };
}
