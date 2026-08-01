import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { BookA, Hash, Music2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { WordAnchor } from "@/components/editor/WordAnchor";
import { useClosingRetention } from "@/components/editor/useClosingRetention";
import { useKeyedState } from "@/components/editor/useKeyedState";
import { EndRhymesSwitch } from "@/components/rhyme/EndRhymesSwitch";
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
import { getLexicon } from "@/lib/data/lexicon";
import type {
  WordLookupMode,
  WordTarget,
} from "@/lib/editor/wordInteraction";
import type { MeteredLine } from "@/lib/meters/types";
import { loadRhymeQuery, queryRhymeIds } from "@/lib/rhyme";
import { countWord } from "@/lib/syllables/countWord";
import {
  isValidOverrideCount,
  normalizeOverrideKey,
} from "@/lib/syllables/overrides";
import {
  detectUsage,
  loadThesaurus,
  lookupSynonyms,
} from "@/lib/thesaurus";
import {
  getCachedRanked,
  POPOVER_RHYME_RANK_LIMIT,
  POPOVER_THESAURUS_RANK_LIMIT,
  preserveCasing,
  rankCandidates,
  rankRhymeIds,
  rankedCacheKey,
  setCachedRanked,
  type RankedCandidate,
} from "@/lib/wordLookup";

export type WordToolsTarget = WordTarget & {
  /** When set, show thesaurus/rhyme instead of actions/syllables. */
  mode?: WordLookupMode;
  tokenSyllables?: number;
};

type Panel = "actions" | "syllables" | "thesaurus" | "rhyme";

type WordToolsPopoverProps = {
  target: WordToolsTarget | null;
  onClose: () => void;
  onPopoverHoverChange: (hovered: boolean) => void;
  /** Pin open while an interactive panel is up (no mouse-leave dismiss). */
  onStickyChange: (sticky: boolean) => void;
  onOpenLookup: (mode: WordLookupMode) => void;
  onReplace: (from: number, to: number, insert: string) => void;
  onRestoreFocus: () => void;
  onSetOverride: (word: string, count: number) => void;
  onClearOverride: (word: string) => void;
  meteredLine: MeteredLine | undefined;
  overrides: Record<string, number>;
  overrideRevision: string;
};

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

function resolveTokenSyllables(
  target: WordToolsTarget,
  meteredLine: MeteredLine | undefined,
): number {
  if (typeof target.tokenSyllables === "number") {
    return target.tokenSyllables;
  }
  const localStart = target.from - target.lineFrom;
  return (
    meteredLine?.tokens.find((t) => t.start === localStart)?.syllables ?? 0
  );
}

type LoadResult = {
  key: string;
  items: RankedCandidate[];
  error: boolean;
};

export function WordToolsPopover({
  target,
  onClose,
  onPopoverHoverChange,
  onStickyChange,
  onOpenLookup,
  onReplace,
  onRestoreFocus,
  onSetOverride,
  onClearOverride,
  meteredLine,
  overrides,
  overrideRevision,
}: WordToolsPopoverProps) {
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const open = target !== null;
  const display = useClosingRetention(target);
  const retainedMetered = useClosingRetention(
    target ? { meteredLine } : null,
  );
  const displayMetered = retainedMetered?.meteredLine;

  const targetIdentity = display
    ? `${display.from}:${display.to}:${display.word}`
    : "";
  const lookupIdentity = display?.mode
    ? `${display.mode}:${targetIdentity}`
    : "";

  const defaultPanel: Panel = display?.mode ?? "actions";
  const [panel, setPanel] = useKeyedState<Panel>(
    targetIdentity,
    defaultPanel,
  );
  // Lookup mode from PoemEditor wins over local actions/syllables.
  const view: Panel = display?.mode ?? panel;

  const key = display ? normalizeOverrideKey(display.word) : "";
  const hasOverride = Boolean(key && overrides[key] !== undefined);
  const baseline = display ? countWord(display.word, {}) : null;
  const suggestion = display ? suggestionFor(display.word) : null;
  const displayCount = hasOverride
    ? overrides[key]!
    : (baseline?.count ?? 1);
  const [countDraft, setCountDraft] = useKeyedState(
    targetIdentity,
    String(displayCount),
  );

  const [includeEndRhymes, setIncludeEndRhymes] = useKeyedState(
    lookupIdentity,
    false,
  );
  const [activeIndex, setActiveIndex] = useKeyedState(lookupIdentity, 0);
  const [load, setLoad] = useState<LoadResult | null>(null);

  const syllables = display
    ? resolveTokenSyllables(display, displayMetered)
    : 0;
  const lineTotal = displayMetered?.total ?? 0;
  const lineTarget = displayMetered?.target ?? null;

  const usage =
    view === "thesaurus" && display
      ? detectUsage(
          display.word,
          display.lineText,
          display.from - display.lineFrom,
          display.to - display.lineFrom,
        )
      : null;

  const cacheKey =
    display && (view === "thesaurus" || view === "rhyme")
      ? rankedCacheKey({
          mode: view,
          includeEndRhymes:
            view === "rhyme" ? includeEndRhymes : undefined,
          word: display.word,
          usage: view === "thesaurus" ? usage : undefined,
          lineTotal,
          lineTarget,
          tokenSyllables: syllables,
          overrideRevision,
        })
      : null;

  const cached = cacheKey ? getCachedRanked(cacheKey) : undefined;
  const loadMatch = cacheKey && load?.key === cacheKey ? load : null;
  const candidates = cached ?? loadMatch?.items ?? null;
  const loadState = !display || !cacheKey
    ? "idle"
    : loadMatch?.error
      ? "error"
      : candidates
        ? "ready"
        : open
          ? "loading"
          : "idle";

  const onStickyChangeRef = useRef(onStickyChange);
  useLayoutEffect(() => {
    onStickyChangeRef.current = onStickyChange;
  }, [onStickyChange]);

  const sticky = open && view !== "actions";
  useEffect(() => {
    onStickyChangeRef.current(sticky);
    return () => onStickyChangeRef.current(false);
  }, [sticky]);

  useEffect(() => {
    if (
      !open ||
      !display ||
      !cacheKey ||
      cached ||
      (view !== "thesaurus" && view !== "rhyme")
    ) {
      return;
    }

    let cancelled = false;
    const fetchRanked =
      view === "thesaurus"
        ? loadThesaurus().then(() => {
            const syns = lookupSynonyms(display.word, usage);
            return rankCandidates({
              candidates: syns,
              tokenSyllables: syllables,
              lineTotal,
              lineTarget,
              overrides,
              limit: POPOVER_THESAURUS_RANK_LIMIT,
            });
          })
        : loadRhymeQuery(includeEndRhymes).then(() => {
            const ids = queryRhymeIds(display.word, includeEndRhymes);
            const lex = getLexicon();
            if (!lex) return [] as RankedCandidate[];
            return rankRhymeIds({
              ids,
              words: lex.words,
              tokenSyllables: syllables,
              lineTotal,
              lineTarget,
              overrides,
              limit: POPOVER_RHYME_RANK_LIMIT,
            });
          });

    void fetchRanked
      .then((ranked) => {
        if (cancelled) return;
        setCachedRanked(cacheKey, ranked);
        setLoad({ key: cacheKey, items: ranked, error: false });
      })
      .catch(() => {
        if (!cancelled) {
          setLoad({ key: cacheKey, items: [], error: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    open,
    display,
    cacheKey,
    cached,
    syllables,
    lineTotal,
    lineTarget,
    overrides,
    includeEndRhymes,
    usage,
    view,
  ]);

  useLayoutEffect(() => {
    if (!open || loadState !== "ready") return;
    if (view !== "thesaurus" && view !== "rhyme") return;
    listRef.current?.focus();
  }, [open, loadState, lookupIdentity, view]);

  function applyCount(raw: string | number): void {
    if (!open || !display || !key || !baseline) return;
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

  function applyCandidate(candidate: RankedCandidate): void {
    if (!target || !target.mode) return;
    const text = preserveCasing(target.raw, candidate.word);
    if (target.mode === "rhyme") {
      void navigator.clipboard
        .writeText(text)
        .then(() => {
          toast(`“${text}” copied to clipboard`);
        })
        .finally(() => {
          onClose();
          onRestoreFocus();
        });
      return;
    }
    onReplace(target.from, target.to, text);
    onClose();
  }

  function onListKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      onRestoreFocus();
      return;
    }
    if (!candidates || candidates.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((activeIndex + 1) % candidates.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (activeIndex - 1 + candidates.length) % candidates.length,
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const chosen = candidates[activeIndex];
      if (chosen) applyCandidate(chosen);
    }
  }

  const isThesaurus = view === "thesaurus";
  const isLookup = view === "thesaurus" || view === "rhyme";
  const title = display
    ? isThesaurus
      ? `Synonyms for ${display.raw}`
      : view === "rhyme"
        ? `Rhymes for ${display.raw}`
        : view === "syllables"
          ? `Syllables · ${display.raw}`
          : `Word actions for ${display.raw}`
    : "Word tools";
  const emptyLabel = isThesaurus ? "No synonyms found." : "No rhymes found.";
  const errorLabel = isThesaurus
    ? "Couldn’t load thesaurus."
    : "Couldn’t load rhymes.";
  const lookupDescription = isThesaurus
    ? "Choose a synonym. Matching part of speech comes first, then meter fit and syllable count."
    : includeEndRhymes
      ? "Choose a rhyme to copy. Includes perfect rhymes plus end rhymes that match the final syllable. Sorted by syllable count. Meter-matching options are marked."
      : "Choose a perfect rhyme to copy. Options are sorted by syllable count. Meter-matching options are marked.";

  const contentClass =
    view === "actions"
      ? "w-auto gap-0 border-0 bg-transparent p-0 shadow-none ring-0"
      : "w-56 gap-1.5 p-1.5";

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
          if (isLookup) onRestoreFocus();
        }
      }}
    >
      {display ? <WordAnchor anchor={display.anchor} /> : null}
      <PopoverContent
        align={view === "actions" ? "center" : "start"}
        side="bottom"
        sideOffset={6}
        collisionPadding={12}
        data-word-toolbar=""
        className={contentClass}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (isLookup) onRestoreFocus();
        }}
        onPointerEnter={() => onPopoverHoverChange(true)}
        onPointerLeave={() => onPopoverHoverChange(false)}
        onPointerDownOutside={(event) => {
          // Actions/syllables: pointer bridge owns dismiss — ignore editor hits.
          // Thesaurus/rhyme: allow outside click (including editor) to close.
          if (isLookup) return;
          const el = event.target;
          if (el instanceof Element && el.closest(".cm-editor")) {
            event.preventDefault();
          }
        }}
      >
        {view === "actions" && display ? (
          <ButtonGroup
            aria-label={`Word actions for ${display.raw}`}
            className="[&_[data-slot=button]]:bg-popover [&_[data-slot=button]]:hover:bg-muted dark:[&_[data-slot=button]]:bg-popover dark:[&_[data-slot=button]]:hover:bg-muted"
          >
            <ButtonGroup>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Syllable count"
                onClick={() => setPanel("syllables")}
              >
                <Hash />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
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
          </ButtonGroup>
        ) : null}

        {view === "syllables" && display && baseline ? (
          <>
            <PopoverHeader className="gap-0.5 px-0.5">
              <PopoverTitle className="text-xs font-medium tracking-wide text-muted-foreground">
                Syllables · {display.raw}
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
                aria-label={`Syllable count for ${display.raw}`}
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

        {isLookup && display ? (
          <>
            <PopoverHeader className="px-1.5 pt-0.5">
              <PopoverTitle className="text-xs font-medium tracking-wide text-muted-foreground">
                {title}
              </PopoverTitle>
              <PopoverDescription className="sr-only">
                {lookupDescription}
              </PopoverDescription>
            </PopoverHeader>

            {view === "rhyme" ? (
              <EndRhymesSwitch
                size="sm"
                checked={includeEndRhymes}
                onCheckedChange={setIncludeEndRhymes}
              />
            ) : null}

            {loadState === "loading" ? (
              <p className="px-1.5 py-2 text-sm text-muted-foreground">
                Loading…
              </p>
            ) : null}

            {loadState === "error" ? (
              <p className="px-1.5 py-2 text-sm text-muted-foreground">
                {errorLabel}
              </p>
            ) : null}

            {loadState === "ready" && candidates && candidates.length === 0 ? (
              <p className="px-1.5 py-2 text-sm text-muted-foreground">
                {emptyLabel}
              </p>
            ) : null}

            {loadState === "ready" && candidates && candidates.length > 0 ? (
              <div
                ref={listRef}
                id={listId}
                role="listbox"
                tabIndex={0}
                aria-label={title}
                aria-activedescendant={`${listId}-opt-${activeIndex}`}
                className="max-h-64 overflow-y-auto outline-none"
                onKeyDown={onListKeyDown}
              >
                {candidates.map((candidate, index) => {
                  const selected = index === activeIndex;
                  const label = [
                    candidate.word,
                    `${candidate.syllables} ${candidate.syllables === 1 ? "syllable" : "syllables"}`,
                    candidate.keepsMeter ? "keeps meter" : null,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <button
                      key={candidate.word}
                      id={`${listId}-opt-${index}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      aria-label={label}
                      className={[
                        "flex w-full items-baseline justify-between gap-2 rounded-md px-1.5 py-1 text-left text-sm",
                        "outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                        selected ? "bg-muted" : "hover:bg-muted/70",
                        candidate.keepsMeter ? "font-medium" : "font-normal",
                      ].join(" ")}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => applyCandidate(candidate)}
                    >
                      <span
                        className={
                          candidate.keepsMeter
                            ? "min-w-0 truncate underline decoration-muted-foreground/50 underline-offset-2"
                            : "min-w-0 truncate"
                        }
                      >
                        {candidate.word}
                      </span>
                      <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                        {candidate.syllables}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
