import { useState } from "react";
import {
  BookA,
  CircleSlash,
  Contrast,
  Hash,
  Keyboard,
  Monitor,
  Moon,
  Music2,
  Ruler,
  Settings,
  Sun,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { usePrefs } from "@/hooks/usePrefs";
import { isMeterPresetId, METER_PRESETS, type MeterPresetId } from "@/lib/meters";
import { isThemePref, type ThemePref } from "@/lib/prefs";
import {
  CUSTOM_SYLLABLES_MAX,
  CUSTOM_SYLLABLES_MIN,
  DEFAULT_FONT_SIZE,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type EditorSettings,
} from "@/lib/settings";
import { SHORTCUT_HINTS } from "@/lib/shortcuts";
import { cn } from "@/lib/utils";

type SettingsSheetProps = {
  settings: EditorSettings;
  onChange: (next: EditorSettings) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FONT_SIZE_OPTIONS = [
  { value: 1.25, label: "S", aria: "Small" },
  { value: 1.5, label: "M", aria: "Medium" },
  { value: DEFAULT_FONT_SIZE, label: "L", aria: "Large" },
  { value: 2.25, label: "XL", aria: "Extra large" },
] as const;

const THEME_OPTIONS: {
  value: ThemePref;
  label: string;
  icon: typeof Sun;
}[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

const METER_ICONS: Record<MeterPresetId, typeof Hash> = {
  none: CircleSlash,
  haiku: Hash,
  "iambic-pentameter": Type,
  "common-meter": Music2,
  custom: Ruler,
};

const SHORTCUT_ICONS = {
  Settings: Settings,
  "Focus poem": Type,
  Synonyms: BookA,
  Rhymes: Music2,
} as const;

function parseCustomSyllables(raw: string): number | null {
  if (raw.trim() === "") return null;
  const next = Number(raw);
  if (!Number.isFinite(next)) return null;
  return Math.round(next);
}

function clampCustomSyllables(value: number): number {
  return Math.min(
    CUSTOM_SYLLABLES_MAX,
    Math.max(CUSTOM_SYLLABLES_MIN, value),
  );
}

function CustomSyllablesInput({
  value,
  onCommit,
}: {
  value: number;
  onCommit: (next: number) => void;
}) {
  const [draft, setDraft] = useState(() => String(value));

  const commit = (raw: string) => {
    const parsed = parseCustomSyllables(raw);
    const next = clampCustomSyllables(parsed ?? value);
    setDraft(String(next));
    if (next !== value) onCommit(next);
  };

  return (
    <div className="flex flex-col gap-2 pl-1">
      <Label htmlFor="custom-syllables">Syllables per line</Label>
      <Input
        id="custom-syllables"
        type="number"
        inputMode="numeric"
        min={CUSTOM_SYLLABLES_MIN}
        max={CUSTOM_SYLLABLES_MAX}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(draft);
          }
        }}
        className="w-24"
      />
    </div>
  );
}

export function SettingsSheet({
  settings,
  onChange,
  open,
  onOpenChange,
}: SettingsSheetProps) {
  const { prefs, setTheme, setContrast } = usePrefs();

  const fontValue = FONT_SIZE_OPTIONS.some(
    (option) => option.value === settings.fontSize,
  )
    ? settings.fontSize
    : DEFAULT_FONT_SIZE;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 text-muted-foreground hover:text-foreground"
          aria-label="Open settings"
        >
          <Settings className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0 overflow-hidden">
        <SheetHeader className="shrink-0">
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium">Appearance</p>

            <div className="flex flex-col gap-2">
              <Label id="theme-label">Theme</Label>
              <ButtonGroup aria-labelledby="theme-label">
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const selected = prefs.theme === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={option.label}
                      aria-pressed={selected}
                      className={cn(selected && "bg-muted text-foreground")}
                      onClick={() => {
                        if (!isThemePref(option.value)) return;
                        setTheme(option.value);
                      }}
                    >
                      <Icon data-icon="inline-start" />
                      {option.label}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-2.5">
                <Contrast
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor="higher-contrast">Higher contrast</Label>
                  <p
                    id="higher-contrast-hint"
                    className="text-muted-foreground text-xs"
                  >
                    Stronger subtle text and borders across the app
                  </p>
                </div>
              </div>
              <Switch
                id="higher-contrast"
                checked={prefs.contrast === "more"}
                aria-describedby="higher-contrast-hint"
                onCheckedChange={(checked) =>
                  setContrast(checked ? "more" : "default")
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Type className="size-4 text-muted-foreground" aria-hidden />
                <Label id="font-size-label">Font size</Label>
              </div>
              <ButtonGroup aria-labelledby="font-size-label">
                {FONT_SIZE_OPTIONS.map((option) => {
                  const selected = fontValue === option.value;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={option.aria}
                      aria-pressed={selected}
                      className={cn(
                        "min-w-10",
                        selected && "bg-muted text-foreground",
                      )}
                      onClick={() => {
                        onChange({
                          ...settings,
                          fontSize: Math.min(
                            FONT_SIZE_MAX,
                            Math.max(FONT_SIZE_MIN, option.value),
                          ),
                        });
                      }}
                    >
                      <span
                        className="font-[family-name:var(--font-brand)]"
                        style={{ fontSize: `${0.65 + option.value * 0.2}rem` }}
                      >
                        {option.label}
                      </span>
                    </Button>
                  );
                })}
              </ButtonGroup>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <Label id="meter-label">Meter</Label>
            <div
              role="radiogroup"
              aria-labelledby="meter-label"
              className="flex flex-col gap-1.5"
            >
              {METER_PRESETS.map((preset) => {
                const Icon = METER_ICONS[preset.id];
                const selected = settings.meter === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                      "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/80",
                      selected
                        ? "border-border bg-muted text-foreground"
                        : "border-transparent hover:bg-muted/60",
                    )}
                    onClick={() => {
                      if (!isMeterPresetId(preset.id)) return;
                      onChange({ ...settings, meter: preset.id });
                    }}
                  >
                    <Icon
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-medium">{preset.label}</span>
                      {preset.description ? (
                        <span className="text-muted-foreground text-xs">
                          {preset.description}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {settings.meter === "custom" && (
            <CustomSyllablesInput
              value={settings.customSyllables}
              onCommit={(customSyllables) =>
                onChange({ ...settings, customSyllables })
              }
            />
          )}

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-start gap-2.5">
              <Hash
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="show-counts">Syllable counts</Label>
                <p
                  id="show-counts-hint"
                  className="text-muted-foreground text-xs"
                >
                  Show a count at the end of each line
                </p>
              </div>
            </div>
            <Switch
              id="show-counts"
              checked={settings.showCounts}
              aria-describedby="show-counts-hint"
              onCheckedChange={(showCounts) =>
                onChange({ ...settings, showCounts })
              }
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-start gap-2.5">
              <Ruler
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="show-rulers">Meter rulers</Label>
                <p
                  id="show-rulers-hint"
                  className="text-muted-foreground text-xs"
                >
                  Tick marks at syllable boundaries under each line
                </p>
              </div>
            </div>
            <Switch
              id="show-rulers"
              checked={settings.showRulers}
              aria-describedby="show-rulers-hint"
              onCheckedChange={(showRulers) =>
                onChange({ ...settings, showRulers })
              }
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Keyboard
                className="size-4 text-muted-foreground"
                aria-hidden
              />
              <p className="text-sm font-medium">Keyboard</p>
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              {SHORTCUT_HINTS.map((hint) => {
                const Icon =
                  SHORTCUT_ICONS[hint.action as keyof typeof SHORTCUT_ICONS];
                return (
                  <li
                    key={hint.action}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      {Icon ? (
                        <Icon className="size-3.5 shrink-0" aria-hidden />
                      ) : null}
                      {hint.action}
                    </span>
                    <Kbd>{hint.keys}</Kbd>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
