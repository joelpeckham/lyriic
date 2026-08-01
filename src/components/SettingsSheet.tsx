import { useState } from "react";
import { Settings, X } from "lucide-react";

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
import { usePrefs } from "@/hooks/usePrefs";
import { isMeterPresetId, METER_PRESETS } from "@/lib/meters";
import { isThemePref, type ThemePref } from "@/lib/prefs";
import {
  CUSTOM_SYLLABLES_MAX,
  CUSTOM_SYLLABLES_MIN,
  DEFAULT_FONT_SIZE,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type EditorSettings,
} from "@/lib/settings";
import {
  isValidOverrideCount,
  normalizeOverrideKey,
} from "@/lib/syllables/overrides";

type SettingsSheetProps = {
  settings: EditorSettings;
  onChange: (next: EditorSettings) => void;
  overrides: Record<string, number>;
  onSetOverride: (word: string, count: number) => void;
  onClearOverride: (word: string) => void;
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

/** Quiet ambiguity shortcuts — not an encyclopedia. */
const OVERRIDE_SUGGESTIONS = [
  { word: "fire", counts: [1, 2] as const },
  { word: "every", counts: [2, 3] as const },
] as const;

const OVERRIDE_COUNT_MIN = 1;
const OVERRIDE_COUNT_MAX = 8;

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
    <div className="flex flex-col gap-2">
      <Label htmlFor="custom-syllables">Syllables per line</Label>
      <Input
        id="custom-syllables"
        type="number"
        min={CUSTOM_SYLLABLES_MIN}
        max={CUSTOM_SYLLABLES_MAX}
        value={draft}
        aria-describedby="custom-syllables-hint"
        onChange={(event) => {
          const raw = event.target.value;
          setDraft(raw);
          const parsed = parseCustomSyllables(raw);
          if (
            parsed !== null &&
            parsed >= CUSTOM_SYLLABLES_MIN &&
            parsed <= CUSTOM_SYLLABLES_MAX
          ) {
            onCommit(parsed);
          }
        }}
        onBlur={() => commit(draft)}
      />
      <p id="custom-syllables-hint" className="text-muted-foreground text-xs">
        {CUSTOM_SYLLABLES_MIN}–{CUSTOM_SYLLABLES_MAX} syllables
      </p>
    </div>
  );
}

function SyllableOverridesSection({
  overrides,
  onSetOverride,
  onClearOverride,
}: {
  overrides: Record<string, number>;
  onSetOverride: (word: string, count: number) => void;
  onClearOverride: (word: string) => void;
}) {
  const [wordDraft, setWordDraft] = useState("");
  const [countDraft, setCountDraft] = useState("2");

  const entries = Object.entries(overrides).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const addOverride = () => {
    const key = normalizeOverrideKey(wordDraft);
    const count = Number(countDraft);
    if (!key || !isValidOverrideCount(count)) return;
    const clamped = Math.min(
      OVERRIDE_COUNT_MAX,
      Math.max(OVERRIDE_COUNT_MIN, Math.floor(count)),
    );
    onSetOverride(key, clamped);
    setWordDraft("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">Syllable overrides</p>
        <p
          id="overrides-hint"
          className="text-muted-foreground text-xs"
        >
          Dictionary defaults apply. Override when a word should scan
          differently (e.g. fire, every).
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5" aria-label="Common ambiguities">
        {OVERRIDE_SUGGESTIONS.map((suggestion) =>
          suggestion.counts.map((count) => (
            <Button
              key={`${suggestion.word}-${count}`}
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() => onSetOverride(suggestion.word, count)}
            >
              {suggestion.word} → {count}
            </Button>
          )),
        )}
      </div>

      {entries.length > 0 ? (
        <ul className="flex flex-col gap-1.5" aria-label="Active overrides">
          {entries.map(([word, count]) => (
            <li
              key={word}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="font-[family-name:var(--font-ui)] tabular-nums">
                {word}{" "}
                <span className="text-muted-foreground">· {count}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground"
                aria-label={`Clear override for ${word}`}
                onClick={() => onClearOverride(word)}
              >
                <X className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Label htmlFor="override-word">Word</Label>
          <Input
            id="override-word"
            value={wordDraft}
            aria-describedby="overrides-hint"
            placeholder="fire"
            onChange={(event) => setWordDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addOverride();
              }
            }}
          />
        </div>
        <div className="flex w-16 flex-col gap-1.5">
          <Label htmlFor="override-count">Count</Label>
          <Input
            id="override-count"
            type="number"
            min={OVERRIDE_COUNT_MIN}
            max={OVERRIDE_COUNT_MAX}
            value={countDraft}
            onChange={(event) => setCountDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addOverride();
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mb-px"
          onClick={addOverride}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export function SettingsSheet({
  settings,
  onChange,
  overrides,
  onSetOverride,
  onClearOverride,
}: SettingsSheetProps) {
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
                onChange({ ...settings, meter: value });
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
            <CustomSyllablesInput
              value={settings.customSyllables}
              onCommit={(customSyllables) =>
                onChange({ ...settings, customSyllables })
              }
            />
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
                Tick marks at syllable boundaries under each line
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

          <Separator />

          <SyllableOverridesSection
            overrides={overrides}
            onSetOverride={onSetOverride}
            onClearOverride={onClearOverride}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
