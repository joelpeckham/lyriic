import { useMemo, useState } from "react";
import {
  CircleDot,
  Contrast,
  Hash,
  Keyboard,
  Monitor,
  Moon,
  MousePointerClick,
  Ruler,
  Search,
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { usePrefs } from "@/hooks/usePrefs";
import {
  CUSTOM_FOOT_IDS,
  FOOT_LABELS,
  listMeterCatalogByGroup,
  resolveMeterConfig,
  type CustomFootId,
} from "@/lib/meters";
import {
  DEFAULT_FONT_SIZE,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type ThemePref,
} from "@/lib/prefs";
import {
  formatCustomPattern,
  parseCustomPattern,
  type EditorSettings,
} from "@/lib/settings";
import { applyMeterChoice } from "@/lib/settings/applyMeterChoice";
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

const SHORTCUT_ICONS = {
  Settings: Settings,
  "Focus poem": Type,
} as const;

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

function CustomMeterControls({
  settings,
  onChange,
}: {
  settings: EditorSettings;
  onChange: (next: EditorSettings) => void;
}) {
  const [draft, setDraft] = useState(() =>
    formatCustomPattern(settings.customPattern),
  );

  const commitPattern = (raw: string) => {
    const parsed = parseCustomPattern(raw);
    const next = parsed ?? settings.customPattern;
    setDraft(formatCustomPattern(next));
    if (
      next.length !== settings.customPattern.length ||
      next.some((n, i) => n !== settings.customPattern[i])
    ) {
      onChange(applyMeterChoice({ ...settings, customPattern: next }, "custom"));
    }
  };

  const preview = resolveMeterConfig({
    meter: "custom",
    customPattern: settings.customPattern,
    customFoot: settings.customFoot,
  });

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/70 bg-muted/30 px-3 py-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-pattern">Syllables per line</Label>
        <Input
          id="custom-pattern"
          value={draft}
          placeholder="8 or 5, 7, 5"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => commitPattern(draft)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitPattern(draft);
            }
          }}
        />
        <p className="text-muted-foreground text-xs">
          Fixed length or a cycle like 5, 7, 5
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-foot">Stress foot</Label>
        <select
          id="custom-foot"
          className={cn(
            "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm",
            "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/80",
          )}
          value={settings.customFoot}
          onChange={(event) => {
            const customFoot = event.target.value as CustomFootId;
            onChange(
              applyMeterChoice({ ...settings, customFoot }, "custom"),
            );
          }}
        >
          {CUSTOM_FOOT_IDS.map((foot) => (
            <option key={foot} value={foot}>
              {FOOT_LABELS[foot]}
            </option>
          ))}
        </select>
      </div>

      <p className="text-muted-foreground text-xs">{preview.description}</p>
    </div>
  );
}

function MeterPicker({
  settings,
  onChange,
}: {
  settings: EditorSettings;
  onChange: (next: EditorSettings) => void;
}) {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => listMeterCatalogByGroup(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        entries: group.entries.filter(
          (entry) =>
            entry.label.toLowerCase().includes(q) ||
            entry.description.toLowerCase().includes(q) ||
            entry.id.includes(q),
        ),
      }))
      .filter((group) => group.entries.length > 0);
  }, [groups, query]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="meter-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search meters…"
          className="pl-8"
          aria-label="Search meters"
        />
      </div>

      <div
        role="listbox"
        aria-label="Meter"
        className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-0.5"
      >
        {filtered.map((group) => (
          <div key={group.group} className="flex flex-col gap-1">
            <p className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {group.label}
            </p>
            {group.entries.map((entry) => {
              const selected = settings.meter === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors",
                    "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/80",
                    selected
                      ? "border-border bg-muted text-foreground"
                      : "border-transparent hover:bg-muted/60",
                  )}
                  onClick={() => onChange(applyMeterChoice(settings, entry.id))}
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium">{entry.label}</span>
                    {entry.description ? (
                      <span className="text-muted-foreground text-xs">
                        {entry.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
        {filtered.length === 0 ? (
          <p className="px-1 text-sm text-muted-foreground">No meters match.</p>
        ) : null}
      </div>
    </div>
  );
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
          <SheetDescription>Preferences stay on this device.</SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6">
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Appearance
            </p>

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
            <MeterPicker settings={settings} onChange={onChange} />
          </div>

          {settings.meter === "custom" ? (
            <CustomMeterControls
              key={formatCustomPattern(settings.customPattern)}
              settings={settings}
              onChange={onChange}
            />
          ) : null}

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
