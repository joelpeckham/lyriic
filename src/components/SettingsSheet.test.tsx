import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsSheet } from "@/components/SettingsSheet";
import { PrefsProvider } from "@/hooks/usePrefs";
import { DEFAULT_SETTINGS } from "@/lib/settings";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
});

afterEach(() => {
  cleanup();
});

function renderSheet(
  props: Partial<{
    settings: typeof DEFAULT_SETTINGS;
    overrides: Record<string, number>;
    onChange: (next: typeof DEFAULT_SETTINGS) => void;
    onSetOverride: (word: string, count: number) => void;
    onClearOverride: (word: string) => void;
  }> = {},
) {
  const onChange = props.onChange ?? vi.fn();
  const onSetOverride = props.onSetOverride ?? vi.fn();
  const onClearOverride = props.onClearOverride ?? vi.fn();

  render(
    <PrefsProvider>
      <SettingsSheet
        settings={props.settings ?? DEFAULT_SETTINGS}
        onChange={onChange}
        overrides={props.overrides ?? {}}
        onSetOverride={onSetOverride}
        onClearOverride={onClearOverride}
      />
    </PrefsProvider>,
  );

  return { onChange, onSetOverride, onClearOverride };
}

async function openSettings() {
  fireEvent.click(screen.getByRole("button", { name: "Open settings" }));
  return screen.findByRole("dialog");
}

describe("SettingsSheet", () => {
  it("toggles meter rulers via showRulers", async () => {
    const { onChange } = renderSheet();
    await openSettings();

    fireEvent.click(screen.getByRole("switch", { name: "Meter rulers" }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ showRulers: true }),
    );
  });

  it("adds and clears syllable overrides through project mutators", async () => {
    const onSetOverride = vi.fn();
    const onClearOverride = vi.fn();
    renderSheet({
      overrides: { fire: 1 },
      onSetOverride,
      onClearOverride,
    });
    await openSettings();

    const list = screen.getByRole("list", { name: "Active overrides" });
    expect(within(list).getByText(/fire/)).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: "Clear override for fire" }),
    );
    expect(onClearOverride).toHaveBeenCalledWith("fire");

    fireEvent.change(screen.getByLabelText("Word"), {
      target: { value: "Every" },
    });
    fireEvent.change(screen.getByLabelText("Count"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onSetOverride).toHaveBeenCalledWith("every", 3);
  });

  it("offers quiet fire/every suggestion buttons", async () => {
    const onSetOverride = vi.fn();
    renderSheet({ onSetOverride });
    await openSettings();

    fireEvent.click(screen.getByRole("button", { name: "fire → 1" }));
    expect(onSetOverride).toHaveBeenCalledWith("fire", 1);
  });
});
