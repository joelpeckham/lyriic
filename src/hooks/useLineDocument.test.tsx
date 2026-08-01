import {
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useLineDocument } from "./useLineDocument";

type HarnessProps = {
  initialValue?: string;
};

function useHarness({ initialValue = "hello world" }: HarnessProps = {}) {
  const [value, setValue] = useState(initialValue);
  const lines = value.split("\n");
  const lineRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  const markDirty = vi.fn();
  const markAllDirty = vi.fn();
  const setActiveLineIndex = vi.fn();

  const doc = useLineDocument({
    value,
    lines,
    onChange: setValue,
    lineRefs: lineRefs as RefObject<Array<HTMLTextAreaElement | null>>,
    markDirty,
    markAllDirty,
    setActiveLineIndex,
  });

  return { value, lines, doc, markDirty, markAllDirty };
}

function keyEvent(
  key: string,
  selectionStart: number,
  selectionEnd: number,
  value: string,
  extras: Partial<KeyboardEvent> = {},
) {
  const preventDefault = vi.fn();
  return {
    key,
    preventDefault,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    nativeEvent: { isComposing: false },
    currentTarget: {
      value,
      selectionStart,
      selectionEnd,
      focus: vi.fn(),
      setSelectionRange: vi.fn(),
    },
    ...extras,
  } as unknown as KeyboardEvent<HTMLTextAreaElement>;
}

function pasteEvent(text: string, selectionStart: number, selectionEnd: number) {
  const preventDefault = vi.fn();
  return {
    preventDefault,
    clipboardData: {
      getData: (type: string) => (type === "text" ? text : ""),
    },
    currentTarget: {
      selectionStart,
      selectionEnd,
    },
  } as unknown as ClipboardEvent<HTMLTextAreaElement>;
}

describe("useLineDocument", () => {
  it("splits a line on Enter", () => {
    const { result } = renderHook(() => useHarness({ initialValue: "ab" }));

    act(() => {
      result.current.doc.onLineKeyDown(0, keyEvent("Enter", 1, 1, "ab"));
    });

    expect(result.current.value).toBe("a\nb");
    expect(result.current.lines).toEqual(["a", "b"]);
  });

  it("merges with previous line on Backspace at start", () => {
    const { result } = renderHook(() =>
      useHarness({ initialValue: "hello\nworld" }),
    );

    act(() => {
      result.current.doc.onLineKeyDown(1, keyEvent("Backspace", 0, 0, "world"));
    });

    expect(result.current.value).toBe("helloworld");
    expect(result.current.lines).toEqual(["helloworld"]);
  });

  it("reflows a multi-line paste into separate poetic lines", () => {
    const { result } = renderHook(() =>
      useHarness({ initialValue: "start end" }),
    );

    act(() => {
      result.current.doc.onLinePaste(0, pasteEvent("one\ntwo\nthree", 6, 6));
    });

    expect(result.current.value).toBe("start one\ntwo\nthreeend");
    expect(result.current.lines).toEqual(["start one", "two", "threeend"]);
  });
});
