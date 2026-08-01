import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { usePrefs } from "@/lib/PrefsProvider";
import {
  isMeterPresetId,
  METER_PRESETS,
  type MeterPresetId,
} from "@/lib/meters";
import { isThemePref, type ThemePref } from "@/lib/prefs";
import {
  CUSTOM_SYLLABLES_MAX,
  CUSTOM_SYLLABLES_MIN,
  DEFAULT_FONT_SIZE,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type EditorSettings,
} from "@/lib/settings";

type SettingsSheetProps = {
  settings: EditorSettings;
  onChange: (next: EditorSettings) => void;
};

const FONT_SIZE_OPTIONS = [
  { value: "1.25", label: "Small" },
  { value: "1.5", label: "Medium" },
  { value: String(DEFAULT_FONT_SIZE), label: "Large" },
  { value: "2.25", label: "Extra large" },
] as const;

const THEME_OPTIONS: { value: ThemePref; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function SettingsSheet({ settings, onChange }: SettingsSheetProps) {
  const { prefs, setTheme, setContrast } = usePrefs();

  const fontValue = FONT_SIZE_OPTIONS.some(
    (option) => Number(option.value) === settings.fontSize,
  )
    ? String(settings.fontSize)
    : String(DEFAULT_FONT_SIZE);

  return (
    <Sheet>
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
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Appearance is app-wide. Meter guides apply to the active draft.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pb-6">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium">Appearance</p>

            <div className="flex flex-col gap-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={prefs.theme}
                onValueChange={(value) => {
                  if (!isThemePref(value)) return;
                  setTheme(value);
                }}
              >
                <SelectTrigger id="theme" className="w-full">
                  <SelectValue placeholder="Choose a theme" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="higher-contrast">Higher contrast</Label>
                <p
                  id="higher-contrast-hint"
                  className="text-muted-foreground text-xs"
                >
                  Stronger subtle text and borders across the app
                </p>
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
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <Label htmlFor="meter">Meter</Label>
            <Select
              value={settings.meter}
              onValueChange={(value) => {
                if (!isMeterPresetId(value)) return;
                onChange({ ...settings, meter: value as MeterPresetId });
              }}
            >
              <SelectTrigger id="meter" className="w-full">
                <SelectValue placeholder="Choose a meter" />
              </SelectTrigger>
              <SelectContent>
                {METER_PRESETS.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.label}
                    {preset.description ? ` — ${preset.description}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {settings.meter === "custom" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="custom-syllables">Syllables per line</Label>
              <Input
                id="custom-syllables"
                type="number"
                min={CUSTOM_SYLLABLES_MIN}
                max={CUSTOM_SYLLABLES_MAX}
                value={settings.customSyllables}
                aria-describedby="custom-syllables-hint"
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (!Number.isFinite(next)) return;
                  onChange({
                    ...settings,
                    customSyllables: Math.min(
                      CUSTOM_SYLLABLES_MAX,
                      Math.max(CUSTOM_SYLLABLES_MIN, Math.round(next)),
                    ),
                  });
                }}
              />
              <p
                id="custom-syllables-hint"
                className="text-muted-foreground text-xs"
              >
                {CUSTOM_SYLLABLES_MIN}–{CUSTOM_SYLLABLES_MAX} syllables
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="font-size">Font size</Label>
            <Select
              value={fontValue}
              onValueChange={(value) => {
                const next = Number(value);
                if (!Number.isFinite(next)) return;
                onChange({
                  ...settings,
                  fontSize: Math.min(
                    FONT_SIZE_MAX,
                    Math.max(FONT_SIZE_MIN, next),
                  ),
                });
              }}
            >
              <SelectTrigger id="font-size" className="w-full">
                <SelectValue placeholder="Choose a size" />
              </SelectTrigger>
              <SelectContent>
                {FONT_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="show-counts">Syllable counts</Label>
              <p id="show-counts-hint" className="text-muted-foreground text-xs">
                Show a count at the end of each line
              </p>
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
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="show-rulers">Meter rulers</Label>
              <p id="show-rulers-hint" className="text-muted-foreground text-xs">
                Syllable break guides on each line
              </p>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
