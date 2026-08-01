import { describe, expect, it, vi } from "vitest";

import { handleAppShortcut, isModKey } from "./shortcuts";

function keyEvent(
  key: string,
  init: Partial<KeyboardEvent> & { metaKey?: boolean; ctrlKey?: boolean } = {},
): KeyboardEvent {
  return new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
    metaKey: init.metaKey ?? false,
    ctrlKey: init.ctrlKey ?? false,
    altKey: init.altKey ?? false,
    shiftKey: init.shiftKey ?? false,
  });
}

describe("handleAppShortcut", () => {
  it("toggles settings on Mod-,", () => {
    const setSettingsOpen = vi.fn();
    const focusPoem = vi.fn();
    const event = keyEvent(",", { metaKey: true });
    const handled = handleAppShortcut(event, {
      settingsOpen: false,
      setSettingsOpen,
      focusPoem,
    });
    expect(handled).toBe(true);
    expect(event.defaultPrevented).toBe(true);
    expect(setSettingsOpen).toHaveBeenCalledWith(true);
  });

  it("focuses poem on Mod-.", () => {
    const setSettingsOpen = vi.fn();
    const focusPoem = vi.fn();
    const event = keyEvent(".", { ctrlKey: true });
    const handled = handleAppShortcut(event, {
      settingsOpen: true,
      setSettingsOpen,
      focusPoem,
    });
    expect(handled).toBe(true);
    expect(setSettingsOpen).toHaveBeenCalledWith(false);
    expect(focusPoem).toHaveBeenCalled();
  });

  it("closes settings on Escape when open", () => {
    const setSettingsOpen = vi.fn();
    const focusPoem = vi.fn();
    const event = keyEvent("Escape");
    const handled = handleAppShortcut(event, {
      settingsOpen: true,
      setSettingsOpen,
      focusPoem,
    });
    expect(handled).toBe(true);
    expect(setSettingsOpen).toHaveBeenCalledWith(false);
    expect(focusPoem).toHaveBeenCalled();
  });

  it("ignores Escape when settings closed", () => {
    const setSettingsOpen = vi.fn();
    const handled = handleAppShortcut(keyEvent("Escape"), {
      settingsOpen: false,
      setSettingsOpen,
      focusPoem: vi.fn(),
    });
    expect(handled).toBe(false);
    expect(setSettingsOpen).not.toHaveBeenCalled();
  });
});

describe("isModKey", () => {
  it("detects meta or ctrl", () => {
    expect(isModKey(keyEvent("a", { metaKey: true }))).toBe(true);
    expect(isModKey(keyEvent("a", { ctrlKey: true }))).toBe(true);
    expect(isModKey(keyEvent("a"))).toBe(false);
  });
});
