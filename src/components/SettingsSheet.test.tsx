import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SettingsSheet } from "@/components/SettingsSheet";
import { PrefsProvider } from "@/hooks/usePrefs";
import { DEFAULT_SETTINGS, type EditorSettings } from "@/lib/settings";

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
    }),
  });
});

afterEach(() => {
  cleanup();
});

function renderSheet(
  props: Partial<{
    settings: EditorSettings;
    onChange: (next: EditorSettings) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }> = {},
) {
  const onChange = props.onChange ?? vi.fn();
  const onOpenChange = props.onOpenChange ?? vi.fn();
  const settings = props.settings ?? DEFAULT_SETTINGS;
  const open = props.open ?? false;

  const view = render(
    <PrefsProvider>
      <SettingsSheet
        settings={settings}
        onChange={onChange}
        open={open}
        onOpenChange={onOpenChange}
      />
    </PrefsProvider>,
  );

  return {
    onChange,
    onOpenChange,
    rerender: (next: Partial<typeof props>) => {
      view.rerender(
        <PrefsProvider>
          <SettingsSheet
            settings={next.settings ?? settings}
            onChange={next.onChange ?? onChange}
            open={next.open ?? open}
            onOpenChange={next.onOpenChange ?? onOpenChange}
          />
        </PrefsProvider>,
      );
    },
  };
}

async function openSettings(
  props: Parameters<typeof renderSheet>[0] = {},
) {
  const result = renderSheet({ ...props, open: true });
  await screen.findByRole("dialog");
  return result;
}

describe("SettingsSheet", () => {
  it("toggles meter rulers via showRulers", async () => {
    const { onChange } = await openSettings();

    fireEvent.click(screen.getByRole("switch", { name: "Meter rulers" }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ showRulers: true }),
    );
  });

  it("selects meter presets via radio buttons", async () => {
    const { onChange } = await openSettings();

    fireEvent.click(screen.getByRole("radio", { name: /Haiku/ }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ meter: "haiku" }),
    );
  });

  it("moves meter selection with arrow keys and roving tabindex", async () => {
    const { onChange } = await openSettings();

    const none = screen.getByRole("radio", { name: /None/ });
    const haiku = screen.getByRole("radio", { name: /Haiku/ });

    expect(none.tabIndex).toBe(0);
    expect(haiku.tabIndex).toBe(-1);

    none.focus();
    fireEvent.keyDown(none, { key: "ArrowDown" });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ meter: "haiku" }),
    );
    expect(document.activeElement).toBe(haiku);
  });

  it("selects font size via button group", async () => {
    const { onChange } = await openSettings();

    fireEvent.click(screen.getByRole("button", { name: "Small" }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ fontSize: 1.25 }),
    );
  });

  it("selects theme via button group", async () => {
    await openSettings();

    fireEvent.click(screen.getByRole("button", { name: "Dark" }));

    expect(
      screen.getByRole("button", { name: "Dark" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("lists keyboard shortcuts", async () => {
    await openSettings();
    expect(screen.getByText("Keyboard")).toBeTruthy();
    expect(screen.getByText("Synonyms")).toBeTruthy();
    expect(screen.getByText("Rhymes")).toBeTruthy();
  });

  it("does not show syllable overrides section", async () => {
    await openSettings();
    expect(screen.queryByText("Syllable overrides")).toBeNull();
  });

  it("opens when controlled open is true", async () => {
    renderSheet({ open: true });
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("syncs custom syllables input when value changes", async () => {
    const custom = {
      ...DEFAULT_SETTINGS,
      meter: "custom" as const,
      customSyllables: 8,
    };
    const { rerender } = await openSettings({ settings: custom });

    const input = screen.getByLabelText("Syllables per line");
    expect(input).toHaveProperty("value", "8");

    rerender({
      settings: { ...custom, customSyllables: 12 },
      open: true,
    });

    expect(screen.getByLabelText("Syllables per line")).toHaveProperty(
      "value",
      "12",
    );
  });
});
