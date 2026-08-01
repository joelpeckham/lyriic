import { useState, type KeyboardEvent } from "react";
import {
  CircleDot,
  CircleSlash,
  Contrast,
  Hash,
  Keyboard,
  Monitor,
  Moon,
  MousePointerClick,
  Music2,
  Ruler,
  Settings,
  Sun,
  Type,
  Waves,
  type LucideIcon,
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
import { METER_PRESETS, type MeterPresetId } from "@/lib/meters";
import {
  DEFAULT_FONT_SIZE,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type ThemePref,
} from "@/lib/prefs";
import {
  CUSTOM_SYLLABLES_MAX,
  CUSTOM_SYLLABLES_MIN,
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
  icon: LucideIcon;
}[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

const METER_ICONS: Record<MeterPresetId, LucideIcon> = {
  none: CircleSlash,
  haiku: Hash,
  "iambic-pentameter": Type,
  "common-meter": Music2,
  custom: Ruler,
};

const SHORTCUT_ICONS = {
  Settings: Settings,
  "Focus poem": Type,
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

function SettingsToggle({
  id,
  label,
  hint,
  icon: Icon,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const hintId = `${id}-hint`;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-start gap-2.5">
        <Icon
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={id}>{label}</Label>
          <p id={hintId} className="text-muted-foreground text-xs">
            {hint}
          </p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        aria-describedby={hintId}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

function meterRadioIndex(meter: MeterPresetId): number {
  const index = METER_PRESETS.findIndex((preset) => preset.id === meter);
  return index >= 0 ? index : 0;
}

function focusMeterRadio(group: HTMLElement, index: number) {
  const radios = group.querySelectorAll<HTMLElement>('[role="radio"]');
  radios[index]?.focus();
}

export function SettingsSheet({
  settings,
  onChange,
  open,
  onOpenChange,
}: SettingsSheetProps) {
  const { prefs, setTheme, setContrast, setFontSize } = usePrefs();

  const fontValue = FONT_SIZE_OPTIONS.some(
    (option) => option.value === prefs.fontSize,
  )
    ? prefs.fontSize
    : DEFAULT_FONT_SIZE;

  const selectedMeterIndex = meterRadioIndex(settings.meter);

  const onMeterKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    const last = METER_PRESETS.length - 1;
    let nextIndex = selectedMeterIndex;

    if (key === "ArrowDown" || key === "ArrowRight") {
      nextIndex = (selectedMeterIndex + 1) % METER_PRESETS.length;
    } else if (key === "ArrowUp" || key === "ArrowLeft") {
      nextIndex =
        (selectedMeterIndex - 1 + METER_PRESETS.length) % METER_PRESETS.length;
    } else if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = last;
    } else {
      return;
    }

    event.preventDefault();
    const next = METER_PRESETS[nextIndex];
    if (!next) return;
    if (next.id !== settings.meter) {
      onChange({ ...settings, meter: next.id });
    }
    focusMeterRadio(event.currentTarget, nextIndex);
  };

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
                      onClick={() => setTheme(option.value)}
                    >
                      <Icon data-icon="inline-start" />
                      {option.label}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </div>

            <SettingsToggle
              id="higher-contrast"
              label="Higher contrast"
              hint="Stronger subtle text and borders across the app"
              icon={Contrast}
              checked={prefs.contrast === "more"}
              onCheckedChange={(checked) =>
                setContrast(checked ? "more" : "default")
              }
            />

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
                        setFontSize(
                          Math.min(
                            FONT_SIZE_MAX,
                            Math.max(FONT_SIZE_MIN, option.value),
                          ),
                        );
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
              tabIndex={-1}
              className="flex flex-col gap-1.5"
              onKeyDown={onMeterKeyDown}
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
                    tabIndex={selected ? 0 : -1}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                      "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/80",
                      selected
                        ? "border-border bg-muted text-foreground"
                        : "border-transparent hover:bg-muted/60",
                    )}
                    onClick={() =>
                      onChange({ ...settings, meter: preset.id })
                    }
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
              key={settings.customSyllables}
              value={settings.customSyllables}
              onCommit={(customSyllables) =>
                onChange({ ...settings, customSyllables })
              }
            />
          )}

          <Separator />

          <SettingsToggle
            id="show-counts"
            label="Syllable counts"
            hint="Show a count at the end of each line"
            icon={Hash}
            checked={settings.showCounts}
            onCheckedChange={(showCounts) =>
              onChange({ ...settings, showCounts })
            }
          />

          <SettingsToggle
            id="show-rulers"
            label="Meter rulers"
            hint="Tick marks at syllable boundaries under each line"
            icon={Ruler}
            checked={settings.showRulers}
            onCheckedChange={(showRulers) =>
              onChange({ ...settings, showRulers })
            }
          />

          <SettingsToggle
            id="show-stress"
            label="Stress marks"
            hint="ˈ and ˘ marks above stressed and unstressed syllables"
            icon={Waves}
            checked={settings.showStress}
            onCheckedChange={(showStress) =>
              onChange({ ...settings, showStress })
            }
          />

          <SettingsToggle
            id="show-meter-breaks"
            label="Meter breaks"
            hint="On stress-aware meters, mark syllables that break the pattern"
            icon={CircleDot}
            checked={settings.showMeterBreaks}
            onCheckedChange={(showMeterBreaks) =>
              onChange({ ...settings, showMeterBreaks })
            }
          />

          <Separator />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MousePointerClick
                className="size-4 text-muted-foreground"
                aria-hidden
              />
              <p className="text-sm font-medium">Word tools</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Hover or tap a word for synonyms, rhymes, and syllable or stress
              overrides.
            </p>
          </div>

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
