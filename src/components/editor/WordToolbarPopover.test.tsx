import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WordToolbarPopover } from "@/components/editor/WordToolbarPopover";
import type { WordToolbarTarget } from "@/lib/editor/wordToolbar";

const target: WordToolbarTarget = {
  from: 5,
  to: 9,
  raw: "Fire",
  word: "fire",
  lineIndex: 0,
  lineFrom: 0,
  anchor: { left: 10, top: 20, right: 40, bottom: 36 },
};

/** CMU primary for "fire". */
const FIRE_DICT_COUNT = 2;

const toolbarProps = {
  onClose: vi.fn(),
  onPopoverHoverChange: vi.fn(),
  onStickyChange: vi.fn(),
  onOpenLookup: vi.fn(),
  onSetOverride: vi.fn(),
  onClearOverride: vi.fn(),
  overrides: {} as Record<string, number>,
};

afterEach(() => {
  cleanup();
});

describe("WordToolbarPopover", () => {
  it("opens synonym and rhyme lookup from the action group", () => {
    const onOpenLookup = vi.fn();
    render(
      <WordToolbarPopover
        {...toolbarProps}
        target={target}
        onOpenLookup={onOpenLookup}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Synonyms" }));
    expect(onOpenLookup).toHaveBeenCalledWith("thesaurus");

    fireEvent.click(screen.getByRole("button", { name: "Rhymes" }));
    expect(onOpenLookup).toHaveBeenCalledWith("rhyme");
  });

  it("defaults the syllable input to the dictionary count and sets overrides", () => {
    const onSetOverride = vi.fn();
    const onClearOverride = vi.fn();
    const onStickyChange = vi.fn();
    const { rerender } = render(
      <WordToolbarPopover
        {...toolbarProps}
        target={target}
        onSetOverride={onSetOverride}
        onClearOverride={onClearOverride}
        onStickyChange={onStickyChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Syllable count" }));
    expect(onStickyChange).toHaveBeenCalledWith(true);

    const input = screen.getByRole("spinbutton", {
      name: "Syllable count for Fire",
    });
    expect((input as HTMLInputElement).value).toBe(String(FIRE_DICT_COUNT));

    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.blur(input);
    expect(onSetOverride).toHaveBeenCalledWith("fire", 1);

    rerender(
      <WordToolbarPopover
        {...toolbarProps}
        target={target}
        onSetOverride={onSetOverride}
        onClearOverride={onClearOverride}
        onStickyChange={onStickyChange}
        overrides={{ fire: 1 }}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Clear override for fire" }),
    );
    expect(onClearOverride).toHaveBeenCalledWith("fire");
  });

  it("clears an override when the input is set back to the dictionary count", () => {
    const onSetOverride = vi.fn();
    const onClearOverride = vi.fn();
    render(
      <WordToolbarPopover
        {...toolbarProps}
        target={target}
        onSetOverride={onSetOverride}
        onClearOverride={onClearOverride}
        overrides={{ fire: 1 }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Syllable count" }));
    const input = screen.getByRole("spinbutton", {
      name: "Syllable count for Fire",
    });
    expect((input as HTMLInputElement).value).toBe("1");

    fireEvent.change(input, {
      target: { value: String(FIRE_DICT_COUNT) },
    });
    fireEvent.blur(input);
    expect(onClearOverride).toHaveBeenCalledWith("fire");
    expect(onSetOverride).not.toHaveBeenCalled();
  });

  it("offers quiet fire suggestion chips", () => {
    const onSetOverride = vi.fn();
    render(
      <WordToolbarPopover
        {...toolbarProps}
        target={target}
        onSetOverride={onSetOverride}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Syllable count" }));
    fireEvent.click(screen.getByRole("button", { name: "fire → 1" }));
    expect(onSetOverride).toHaveBeenCalledWith("fire", 1);
  });
});
