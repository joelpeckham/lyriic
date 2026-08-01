import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BookA, Hash, Music2, RotateCcw } from "lucide-react";

import { WordAnchor } from "@/components/editor/WordAnchor";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import type { WordLookupMode } from "@/lib/editor/wordLookup";
import type { WordToolbarTarget } from "@/lib/editor/wordToolbar";
import { countWord } from "@/lib/syllables/countWord";
import {
  isValidOverrideCount,
  normalizeOverrideKey,
} from "@/lib/syllables/overrides";

type WordToolbarPopoverProps = {
  target: WordToolbarTarget | null;
  onClose: () => void;
  onPopoverHoverChange: (hovered: boolean) => void;
  /** Pin open while the syllable panel is up (no mouse-leave dismiss). */
  onStickyChange: (sticky: boolean) => void;
  onOpenLookup: (mode: WordLookupMode) => void;
  onSetOverride: (word: string, count: number) => void;
  onClearOverride: (word: string) => void;
  overrides: Record<string, number>;
};

type Panel = "actions" | "syllables";

const OVERRIDE_COUNT_MIN = 1;
const OVERRIDE_COUNT_MAX = 8;

const OVERRIDE_SUGGESTIONS = [
  { word: "fire", counts: [1, 2] as const },
  { word: "every", counts: [2, 3] as const },
] as const;

function suggestionFor(word: string) {
  const key = normalizeOverrideKey(word);
  return OVERRIDE_SUGGESTIONS.find((s) => s.word === key) ?? null;
}

function clampOverrideCount(value: number): number {
  return Math.min(
    OVERRIDE_COUNT_MAX,
    Math.max(OVERRIDE_COUNT_MIN, Math.floor(value)),
  );
}

export function WordToolbarPopover({
  target,
  onClose,
  onPopoverHoverChange,
  onStickyChange,
  onOpenLookup,
  onSetOverride,
  onClearOverride,
  overrides,
}: WordToolbarPopoverProps) {
  const open = target !== null;
  const targetIdentity = target
    ? `${target.from}:${target.to}:${target.word}`
    : "";
  const [panel, setPanel] = useState<{ id: string; view: Panel }>({
    id: "",
    view: "actions",
  });
  const view = panel.id === targetIdentity ? panel.view : "actions";

  const key = target ? normalizeOverrideKey(target.word) : "";
  const hasOverride = Boolean(key && overrides[key] !== undefined);
  /** Dictionary / heuristic baseline — ignores project overrides. */
  const baseline = target ? countWord(target.word, {}) : null;
  const suggestion = target ? suggestionFor(target.word) : null;

  const displayCount = hasOverride
    ? overrides[key]!
    : (baseline?.count ?? 1);
  const [countDraftState, setCountDraftState] = useState({
    id: "",
    value: "1",
  });
  const countDraft =
    countDraftState.id === targetIdentity
      ? countDraftState.value
      : String(displayCount);

  const onStickyChangeRef = useRef(onStickyChange);
  useLayoutEffect(() => {
    onStickyChangeRef.current = onStickyChange;
  }, [onStickyChange]);

  useEffect(() => {
    const sticky = open && view === "syllables";
    onStickyChangeRef.current(sticky);
    return () => onStickyChangeRef.current(false);
  }, [open, view]);

  function setCountDraft(value: string): void {
    setCountDraftState({ id: targetIdentity, value });
  }

  function applyCount(raw: string | number): void {
    if (!target || !key || !baseline) return;
    const parsed = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(parsed) || !isValidOverrideCount(parsed)) {
      setCountDraft(String(displayCount));
      return;
    }
    const next = clampOverrideCount(parsed);
    setCountDraft(String(next));
    if (next === baseline.count) {
      if (hasOverride) onClearOverride(key);
      return;
    }
    onSetOverride(key, next);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      {target ? <WordAnchor anchor={target.anchor} /> : null}
      <PopoverContent
        align="center"
        side="bottom"
        sideOffset={6}
        collisionPadding={12}
        data-word-toolbar=""
        className={
          view === "actions"
            ? "w-auto gap-0 border-0 bg-transparent p-0 shadow-none ring-0"
            : "w-56 gap-2 p-2"
        }
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
        onPointerEnter={() => onPopoverHoverChange(true)}
        onPointerLeave={() => onPopoverHoverChange(false)}
        onPointerDownOutside={(event) => {
          // Keep open when interacting with the editor word itself;
          // pointer bridge owns dismiss on leave / doc change.
          const el = event.target;
          if (el instanceof Element && el.closest(".cm-editor")) {
            event.preventDefault();
          }
        }}
      >
        {view === "actions" && target ? (
          <ButtonGroup aria-label={`Word actions for ${target.raw}`}>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Syllable count"
              onClick={() =>
                setPanel({ id: targetIdentity, view: "syllables" })
              }
            >
              <Hash />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Synonyms"
              onClick={() => onOpenLookup("thesaurus")}
            >
              <BookA />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Rhymes"
              onClick={() => onOpenLookup("rhyme")}
            >
              <Music2 />
            </Button>
          </ButtonGroup>
        ) : null}

        {view === "syllables" && target && baseline ? (
          <>
            <PopoverHeader className="gap-0.5 px-0.5">
              <PopoverTitle className="text-xs font-medium tracking-wide text-muted-foreground">
                Syllables · {target.raw}
              </PopoverTitle>
              <PopoverDescription className="text-muted-foreground text-xs">
                {hasOverride
                  ? `Override · dictionary ${baseline.count}`
                  : baseline.source === "dict"
                    ? "Dictionary default"
                    : "Estimated default"}
              </PopoverDescription>
            </PopoverHeader>

            <div className="flex items-center gap-2 px-0.5">
              <Label htmlFor="syllable-override-count" className="sr-only">
                Syllable count
              </Label>
              <Input
                id="syllable-override-count"
                type="number"
                inputMode="numeric"
                min={OVERRIDE_COUNT_MIN}
                max={OVERRIDE_COUNT_MAX}
                value={countDraft}
                aria-label={`Syllable count for ${target.raw}`}
                className="h-8 w-16 tabular-nums"
                onChange={(event) => setCountDraft(event.target.value)}
                onBlur={() => applyCount(countDraft)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyCount(countDraft);
                  }
                }}
              />
              {hasOverride ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  aria-label={`Clear override for ${key}`}
                  onClick={() => onClearOverride(key)}
                >
                  <RotateCcw data-icon="inline-start" />
                  Reset
                </Button>
              ) : null}
            </div>

            {suggestion ? (
              <div className="flex flex-wrap gap-1 px-0.5">
                {suggestion.counts.map((count) => (
                  <Button
                    key={count}
                    type="button"
                    variant="ghost"
                    size="xs"
                    aria-label={`${suggestion.word} → ${count}`}
                    onClick={() => applyCount(count)}
                  >
                    {suggestion.word} → {count}
                  </Button>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
