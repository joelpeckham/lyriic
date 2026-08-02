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
import { SlantRhymesSwitch } from "@/components/rhyme/SlantRhymesSwitch";
import { useVariantsRevision } from "@/hooks/useVariantsRevision";
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
import { loadStress } from "@/lib/data/stress";
import {
  loadVariants,
  syllableCountsForWord,
} from "@/lib/data/variants";
import { WORD_TOOLBAR_SIDE_OFFSET_PX } from "@/lib/editor/resolveWordTarget";
import type {
  WordLookupMode,
  WordTarget,
} from "@/lib/editor/wordInteraction";
import type { MeteredLine } from "@/lib/meters/types";
import {
  hasRhymeEntry,
  isRhymeIndexReady,
  loadRhymeIndex,
  loadRhymeQuery,
  queryRhymeIds,
} from "@/lib/rhyme";
import { primaryStressIndex, resolveWordStress } from "@/lib/stress";
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
import { cn } from "@/lib/utils";

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
  onSetStressOverride: (word: string, primaryIndex: number) => void;
  onClearStressOverride: (word: string) => void;
  meteredLine: MeteredLine | undefined;
  overrides: Record<string, number>;
  overrideRevision: string;
  stressOverrides: Record<string, number>;
  stressOverrideRevision: string;
};

const OVERRIDE_COUNT_MIN = 1;
const OVERRIDE_COUNT_MAX = 8;

function clampOverrideCount(value: number): number {
  return Math.min(
    OVERRIDE_COUNT_MAX,
    Math.max(OVERRIDE_COUNT_MIN, Math.floor(value)),
  );
}

function findMeteredToken(
  target: WordToolsTarget,
  meteredLine: MeteredLine | undefined,
) {
  const localStart = target.from - target.lineFrom;
  return meteredLine?.tokens.find((t) => t.start === localStart);
}

function resolveTokenSyllables(
  target: WordToolsTarget,
  meteredLine: MeteredLine | undefined,
): number {
  if (typeof target.tokenSyllables === "number") {
    return target.tokenSyllables;
  }
  return findMeteredToken(target, meteredLine)?.syllables ?? 0;
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
  onSetStressOverride,
  onClearStressOverride,
  meteredLine,
  overrides,
  overrideRevision,
  stressOverrides,
  stressOverrideRevision,
}: WordToolsPopoverProps) {
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const open = target !== null;
  const display = useClosingRetention(target);
  // Pass the line ref directly — wrapping in a new `{ meteredLine }` each
  // render makes useClosingRetention setState forever (Object.is fails).
  const displayMetered =
    useClosingRetention(target !== null ? (meteredLine ?? null) : null) ??
    undefined;

  const targetIdentity = display
    ? `${display.from}:${display.to}:${display.word}`
    : "";
  const lookupIdentity = display?.mode
    ? `${display.mode}:${targetIdentity}`
    : "";

  // Fresh open returns to the tool picker. Leave panel alone on close so the
  // exit animation can still show syllables.
  const [panel, setPanel] = useState<Panel>("actions");
  const [includeEndRhymes, setIncludeEndRhymes] = useState(false);
  const [includeSlantRhymes, setIncludeSlantRhymes] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setPanel("actions");
    else {
      setIncludeEndRhymes(false);
      setIncludeSlantRhymes(false);
    }
  }
  // Lookup mode from PoemEditor wins over local actions/syllables.
  const view: Panel = display?.mode ?? panel;

  // Re-render when variants.bin finishes loading so alt count chips appear.
  useVariantsRevision();

  const key = display ? normalizeOverrideKey(display.word) : "";
  const hasOverride = Boolean(key && overrides[key] !== undefined);
  const hasStressOverride = Boolean(
    key && stressOverrides[key] !== undefined,
  );
  const baseline = display ? countWord(display.word, {}) : null;
  const meteredToken = display
    ? findMeteredToken(display, displayMetered)
    : undefined;
  const variantCounts = display
    ? syllableCountsForWord(display.word).filter(
        (n) => n !== baseline?.count,
      )
    : [];
  // Prefer meter-fitted syllable count when the line has a matching token.
  const displayCount = hasOverride
    ? overrides[key]!
    : (meteredToken?.syllables ?? baseline?.count ?? 1);
  const [countDraft, setCountDraft] = useKeyedState(
    targetIdentity,
    String(displayCount),
  );

  const syllableOverridesForStress =
    display && key
      ? hasOverride
        ? overrides
        : meteredToken &&
            baseline &&
            meteredToken.syllables !== baseline.count
          ? { ...overrides, [key]: meteredToken.syllables }
          : overrides
      : overrides;

  const stressResolved = display
    ? !hasStressOverride &&
      meteredToken &&
      meteredToken.stress.length === displayCount
      ? {
          word: display.word,
          pattern: meteredToken.stress,
          source: "dict" as const,
        }
      : resolveWordStress(
          display.word,
          stressOverrides,
          syllableOverridesForStress,
        )
    : null;
  // null = no primary (all unstressed); do not coerce to 0.
  const selectedPrimaryIndex =
    stressResolved != null
      ? primaryStressIndex(stressResolved.pattern)
      : null;
  const stressSyllableCount = stressResolved?.pattern.length ?? displayCount;

  const [activeIndex, setActiveIndex] = useKeyedState(
    `${lookupIdentity}|end:${includeEndRhymes ? 1 : 0}|slant:${includeSlantRhymes ? 1 : 0}`,
    0,
  );
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
          includeSlantRhymes:
            view === "rhyme" ? includeSlantRhymes : undefined,
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
    if (!open || view !== "syllables") return;
    void loadStress().catch(() => {});
    void loadVariants().catch(() => {});
  }, [open, view]);

  // Drop out-of-range stress overrides when syllable count shrinks.
  useEffect(() => {
    if (!open || view !== "syllables" || !key || !hasStressOverride) return;
    const idx = stressOverrides[key];
    if (typeof idx === "number" && idx >= displayCount) {
      onClearStressOverride(key);
    }
  }, [
    open,
    view,
    key,
    hasStressOverride,
    stressOverrides,
    displayCount,
    onClearStressOverride,
    stressOverrideRevision,
  ]);

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
        : loadRhymeQuery({
            includeEnd: includeEndRhymes,
            includeSlant: includeSlantRhymes,
          }).then(() => {
            const ids = queryRhymeIds(display.word, {
              includeEnd: includeEndRhymes,
              includeSlant: includeSlantRhymes,
            });
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
    includeSlantRhymes,
    usage,
    view,
  ]);

  useLayoutEffect(() => {
    if (!open || loadState !== "ready") return;
    if (view !== "thesaurus" && view !== "rhyme") return;
    listRef.current?.focus();
  }, [open, loadState, lookupIdentity, view]);

  // Prefetch near packs when the current list is empty so enable hints work.
  useEffect(() => {
    if (
      !open ||
      view !== "rhyme" ||
      loadState !== "ready" ||
      (candidates && candidates.length > 0)
    ) {
      return;
    }
    if (!includeEndRhymes) void loadRhymeIndex("end");
    if (!includeSlantRhymes) void loadRhymeIndex("slant");
  }, [
    open,
    view,
    includeEndRhymes,
    includeSlantRhymes,
    loadState,
    candidates,
  ]);

  function applyCount(raw: string | number): void {
    if (!open || !display || !key || !baseline) return;
    const parsed = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(parsed) || !isValidOverrideCount(parsed)) {
      setCountDraft(String(displayCount));
      return;
    }
    const next = clampOverrideCount(parsed);
    setCountDraft(String(next));
    if (hasStressOverride && stressOverrides[key]! >= next) {
      onClearStressOverride(key);
    }
    if (next === baseline.count) {
      if (hasOverride) onClearOverride(key);
      return;
    }
    onSetOverride(key, next);
  }

  function applyStress(index: number): void {
    if (!open || !display || !key || stressSyllableCount < 1) return;
    const next = Math.min(
      Math.max(0, Math.floor(index)),
      stressSyllableCount - 1,
    );
    const dictPrimary = resolveWordStress(
      display.word,
      {},
      syllableOverridesForStress,
    );
    const dictIndex = primaryStressIndex(dictPrimary.pattern);
    // Clear override when tapping the citation primary.
    if (
      dictIndex !== null &&
      next === dictIndex &&
      dictPrimary.source !== "override"
    ) {
      if (hasStressOverride) onClearStressOverride(key);
      return;
    }
    onSetStressOverride(key, next);
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
  const rhymeEmptyHint = (() => {
    if (view !== "rhyme" || !display) return "No rhymes found.";
    if (
      !includeEndRhymes &&
      isRhymeIndexReady("end") &&
      hasRhymeEntry(display.word, "end")
    ) {
      return "No perfect rhymes — enable End rhymes for more matches.";
    }
    if (
      !includeSlantRhymes &&
      isRhymeIndexReady("slant") &&
      hasRhymeEntry(display.word, "slant")
    ) {
      return "No exact rhymes — enable Slant rhymes for more matches.";
    }
    return "No rhymes found.";
  })();
  const emptyLabel = isThesaurus ? "No synonyms found." : rhymeEmptyHint;
  const errorLabel = isThesaurus
    ? "Couldn’t load thesaurus."
    : "Couldn’t load rhymes.";
  const nearRhymeBits = [
    includeEndRhymes ? "end rhymes that match the final syllable" : null,
    includeSlantRhymes
      ? "slant rhymes (related vowel/coda families and one-segment coda add/drop)"
      : null,
  ].filter(Boolean);
  const lookupDescription = isThesaurus
    ? "Choose a synonym. Matching part of speech comes first, then meter fit and syllable count."
    : nearRhymeBits.length > 0
      ? `Choose a rhyme to copy. Includes perfect rhymes plus ${nearRhymeBits.join(" and ")}. Sorted by syllable count. Meter-matching options are marked.`
      : "Choose a perfect rhyme to copy. Options are sorted by syllable count. Meter-matching options are marked.";

  const contentClass =
    view === "actions"
      ? "w-auto gap-0 border-0 bg-transparent p-0 shadow-none ring-0"
      : view === "syllables"
        ? "w-60 gap-1.5 p-1.5"
        : "w-56 gap-1.5 p-1.5";

  // Outer shell ignores hits so slide/zoom (and transparent actions chrome)
  // cannot steal the I-beam over the word; only the inner surface is live.
  const contentShellClass = cn(
    contentClass,
    "pointer-events-none animate-none data-open:animate-none data-closed:animate-none",
  );

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
        sideOffset={WORD_TOOLBAR_SIDE_OFFSET_PX}
        collisionPadding={12}
        avoidCollisions
        data-word-toolbar=""
        className={contentShellClass}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (isLookup) onRestoreFocus();
        }}
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
        <div
          className={cn(
            "pointer-events-auto",
            view === "actions" && "cursor-default [&_button]:cursor-pointer",
            view !== "actions" && "flex flex-col gap-1.5",
          )}
          onPointerEnter={() => onPopoverHoverChange(true)}
          onPointerLeave={() => onPopoverHoverChange(false)}
        >
        {view === "actions" && display ? (
          <ButtonGroup
            aria-label={`Word actions for ${display.raw}`}
            className="[&_[data-slot=button]]:bg-popover [&_[data-slot=button]]:hover:bg-muted dark:[&_[data-slot=button]]:border-[color-mix(in_oklch,var(--popover-foreground)_25%,var(--popover))] dark:[&_[data-slot=button]]:bg-popover dark:[&_[data-slot=button]]:hover:bg-muted"
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
                  aria-label={`Clear syllable override for ${key}`}
                  onClick={() => {
                    onClearOverride(key);
                    setCountDraft(String(baseline.count));
                    if (
                      hasStressOverride &&
                      baseline &&
                      stressOverrides[key]! >= baseline.count
                    ) {
                      onClearStressOverride(key);
                    }
                  }}
                >
                  <RotateCcw data-icon="inline-start" />
                  Reset
                </Button>
              ) : null}
            </div>

            {variantCounts.length > 0 ? (
              <div className="flex flex-wrap gap-1 px-0.5">
                {variantCounts.map((count) => (
                  <Button
                    key={count}
                    type="button"
                    variant="ghost"
                    size="xs"
                    aria-label={`Use ${count} syllables for ${display.raw}`}
                    onClick={() => applyCount(count)}
                  >
                    {count} syllables
                  </Button>
                ))}
              </div>
            ) : null}

            {stressSyllableCount > 0 ? (
              <div className="flex flex-col gap-1.5 px-0.5 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-muted-foreground text-xs font-medium tracking-wide">
                    Stress
                  </p>
                  {hasStressOverride ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      aria-label={`Clear stress override for ${key}`}
                      onClick={() => onClearStressOverride(key)}
                    >
                      <RotateCcw data-icon="inline-start" />
                      Reset
                    </Button>
                  ) : null}
                </div>
                <p className="text-muted-foreground text-xs leading-snug">
                  Tap a syllable to move primary stress
                </p>
                <div
                  role="radiogroup"
                  aria-label={`Primary stress for ${display.raw}`}
                  className="flex flex-wrap gap-1"
                >
                  {Array.from({ length: stressSyllableCount }, (_, index) => {
                    const selected =
                      selectedPrimaryIndex !== null &&
                      index === selectedPrimaryIndex;
                    return (
                      <Button
                        key={index}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        variant={selected ? "secondary" : "ghost"}
                        size="xs"
                        className={cn(
                          "min-w-7 tabular-nums",
                          selected && "font-semibold",
                        )}
                        aria-label={`Syllable ${index + 1}${selected ? ", stressed" : ""}`}
                        onClick={() => applyStress(index)}
                      >
                        {selected ? "ˈ" : "˘"}
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
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
              <div className="flex flex-col gap-1 px-0.5">
                <EndRhymesSwitch
                  size="sm"
                  checked={includeEndRhymes}
                  onCheckedChange={setIncludeEndRhymes}
                />
                <SlantRhymesSwitch
                  size="sm"
                  checked={includeSlantRhymes}
                  onCheckedChange={setIncludeSlantRhymes}
                />
              </div>
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
                        "outline-none focus-visible:ring-3 focus-visible:ring-ring/80",
                        selected ? "bg-muted" : "hover:bg-muted/70",
                        candidate.keepsMeter ? "font-medium" : "font-normal",
                      ].join(" ")}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => applyCandidate(candidate)}
                    >
                      <span
                        className={
                          candidate.keepsMeter
                            ? "min-w-0 wrap-break-word underline decoration-muted-foreground/50 underline-offset-2"
                            : "min-w-0 wrap-break-word"
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
