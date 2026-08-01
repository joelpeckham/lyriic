import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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
    onChange: (next: typeof DEFAULT_SETTINGS) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }> = {},
) {
  const onChange = props.onChange ?? vi.fn();
  const onOpenChange = props.onOpenChange ?? vi.fn();

  render(
    <PrefsProvider>
      <SettingsSheet
        settings={props.settings ?? DEFAULT_SETTINGS}
        onChange={onChange}
        open={props.open ?? false}
        onOpenChange={onOpenChange}
      />
    </PrefsProvider>,
  );

  return { onChange, onOpenChange };
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
});
