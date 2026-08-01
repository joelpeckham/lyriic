import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { toast } from "sonner";

import { WordAnchor } from "@/components/editor/WordAnchor";
import { useClosingRetention } from "@/components/editor/useClosingRetention";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { WordLookupRequest } from "@/lib/editor/wordLookup";
import type { MeteredLine } from "@/lib/meters/types";
import { getLexicon } from "@/lib/data/lexicon";
import {
  loadRhymeIndex,
  lookupRhymeIds,
  type RhymeMode,
} from "@/lib/rhyme";
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

type WordLookupPopoverProps = {
  request: WordLookupRequest | null;
  onClose: () => void;
  onReplace: (from: number, to: number, insert: string) => void;
  onRestoreFocus: () => void;
  meteredLine: MeteredLine | undefined;
  overrides: Record<string, number>;
  overrideRevision: string;
};

function resolveTokenSyllables(
  request: WordLookupRequest,
  meteredLine: MeteredLine | undefined,
): number {
  if (typeof request.tokenSyllables === "number") {
    return request.tokenSyllables;
  }
  const localStart = request.from - request.lineFrom;
  return (
    meteredLine?.tokens.find((t) => t.start === localStart)?.syllables ?? 0
  );
}

type RemoteState = {
  key: string;
  items: RankedCandidate[];
  error: boolean;
};

export function WordLookupPopover({
  request,
  onClose,
  onReplace,
  onRestoreFocus,
  meteredLine,
  overrides,
  overrideRevision,
}: WordLookupPopoverProps) {
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [remote, setRemote] = useState<RemoteState | null>(null);
  const [rhymeMode, setRhymeMode] = useState<RhymeMode>("perfect");
  const open = request !== null;
  const display = useClosingRetention(request);
  const meteredRef = useRef(meteredLine);
  if (request) meteredRef.current = meteredLine;
  const displayMetered = meteredRef.current;

  const requestIdentity = display
    ? `${display.mode}:${display.from}:${display.to}:${display.word}`
    : "";
  const [active, setActive] = useState({ id: "", index: 0 });
  const activeIndex = active.id === requestIdentity ? active.index : 0;

  function setActiveIndex(index: number): void {
    setActive({ id: requestIdentity, index });
  }

  const syllables = display
    ? resolveTokenSyllables(display, displayMetered)
    : 0;
  const lineTotal = displayMetered?.total ?? 0;
  const lineTarget = displayMetered?.target ?? null;

  const usage =
    display?.mode === "thesaurus"
      ? detectUsage(
          display.word,
          display.lineText,
          display.from - display.lineFrom,
          display.to - display.lineFrom,
        )
      : null;

  const cacheKey = display
    ? rankedCacheKey({
        mode: display.mode,
        rhymeMode: display.mode === "rhyme" ? rhymeMode : undefined,
        word: display.word,
        usage: display.mode === "thesaurus" ? usage : undefined,
        lineTotal,
        lineTarget,
        tokenSyllables: syllables,
        overrideRevision,
      })
    : null;

  const cached = cacheKey ? getCachedRanked(cacheKey) : undefined;
  const remoteMatch = cacheKey && remote?.key === cacheKey ? remote : null;
  const candidates = cached ?? remoteMatch?.items ?? null;
  const loadState = !display
    ? "idle"
    : remoteMatch?.error
      ? "error"
      : candidates
        ? "ready"
        : open
          ? "loading"
          : "idle";

  useEffect(() => {
    if (!open || !display || !cacheKey || cached) return;

    let cancelled = false;
    const load =
      display.mode === "thesaurus"
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
        : loadRhymeIndex(rhymeMode).then(() => {
            const ids = lookupRhymeIds(display.word, rhymeMode);
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

    void load
      .then((ranked) => {
        if (cancelled) return;
        setCachedRanked(cacheKey, ranked);
        setRemote({ key: cacheKey, items: ranked, error: false });
      })
      .catch(() => {
        if (!cancelled) {
          setRemote({ key: cacheKey, items: [], error: true });
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
    rhymeMode,
    usage,
  ]);
  useLayoutEffect(() => {
    if (!open || loadState !== "ready") return;
    listRef.current?.focus();
  }, [open, loadState, requestIdentity]);

  function applyCandidate(candidate: RankedCandidate): void {
    if (!request) return;
    const text = preserveCasing(request.raw, candidate.word);
    if (request.mode === "rhyme") {
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
    onReplace(request.from, request.to, text);
    onClose();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
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
      setActiveIndex((activeIndex - 1 + candidates.length) % candidates.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const chosen = candidates[activeIndex];
      if (chosen) applyCandidate(chosen);
    }
  }

  const isThesaurus = display?.mode === "thesaurus";
  const title = display
    ? isThesaurus
      ? `Synonyms for ${display.raw}`
      : `Rhymes for ${display.raw}`
    : "Word lookup";
  const emptyLabel = isThesaurus ? "No synonyms found." : "No rhymes found.";
  const errorLabel = isThesaurus
    ? "Couldn’t load thesaurus."
    : "Couldn’t load rhymes.";
  const description = isThesaurus
    ? "Choose a synonym. Matching part of speech comes first, then meter fit and syllable count."
    : rhymeMode === "end"
      ? "Choose an end rhyme to copy. Matches the final syllable even when stress differs. Sorted by syllable count."
      : "Choose a perfect rhyme to copy. Options are sorted by syllable count. Meter-matching options are marked.";

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
          onRestoreFocus();
        }
      }}
    >
      {display ? <WordAnchor anchor={display.anchor} /> : null}
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-56 gap-1.5 p-1.5"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onRestoreFocus();
        }}
      >
        <PopoverHeader className="px-1.5 pt-0.5">
          <PopoverTitle className="text-xs font-medium tracking-wide text-muted-foreground">
            {title}
          </PopoverTitle>
          <PopoverDescription className="sr-only">
            {description}
          </PopoverDescription>
        </PopoverHeader>

        {!isThesaurus && display ? (
          <ButtonGroup
            aria-label="Rhyme type"
            className="px-0.5"
          >
            <Button
              type="button"
              size="xs"
              variant={rhymeMode === "perfect" ? "secondary" : "ghost"}
              aria-pressed={rhymeMode === "perfect"}
              onClick={() => setRhymeMode("perfect")}
            >
              Perfect
            </Button>
            <Button
              type="button"
              size="xs"
              variant={rhymeMode === "end" ? "secondary" : "ghost"}
              aria-pressed={rhymeMode === "end"}
              onClick={() => setRhymeMode("end")}
            >
              End
            </Button>
          </ButtonGroup>
        ) : null}

        {loadState === "loading" ? (
          <p className="px-1.5 py-2 text-sm text-muted-foreground">Loading…</p>
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
            onKeyDown={onKeyDown}
          >
            {candidates.map((candidate, index) => {
              const active = index === activeIndex;
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
                  aria-selected={active}
                  aria-label={label}
                  className={[
                    "flex w-full items-baseline justify-between gap-2 rounded-md px-1.5 py-1 text-left text-sm",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                    active ? "bg-muted" : "hover:bg-muted/70",
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
      </PopoverContent>
    </Popover>
  );
}
