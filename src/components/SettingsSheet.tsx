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
import {
  isMeterPresetId,
  METER_PRESETS,
  type MeterPresetId,
} from "@/lib/meters/presets";
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

export function SettingsSheet({ settings, onChange }: SettingsSheetProps) {
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
          className="text-muted-foreground hover:text-foreground"
          aria-label="Open settings"
        >
          <Settings className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Meter guides and display options for the active draft.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pb-6">
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
              <p className="text-muted-foreground text-xs">
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
              <p className="text-muted-foreground text-xs">
                Show a count at the end of each line
              </p>
            </div>
            <Switch
              id="show-counts"
              checked={settings.showCounts}
              onCheckedChange={(showCounts) =>
                onChange({ ...settings, showCounts })
              }
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="show-rulers">Meter rulers</Label>
              <p className="text-muted-foreground text-xs">
                Syllable break guides on each line
              </p>
            </div>
            <Switch
              id="show-rulers"
              checked={settings.showRulers}
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
