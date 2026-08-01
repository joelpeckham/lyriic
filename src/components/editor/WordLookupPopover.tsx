import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { WordAnchor } from "@/components/editor/WordAnchor";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import type { WordLookupRequest } from "@/lib/editor/wordLookup";
import type { MeteredLine } from "@/lib/meters/types";
import { loadRhymeIndex, lookupRhymes } from "@/lib/rhyme";
import { loadThesaurus, lookupSynonyms } from "@/lib/thesaurus";
import {
  getCachedRanked,
  preserveCasing,
  rankCandidates,
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
  const requestIdentity = request
    ? `${request.mode}:${request.from}:${request.to}:${request.word}`
    : "";
  const [active, setActive] = useState({ id: "", index: 0 });
  const activeIndex = active.id === requestIdentity ? active.index : 0;
  const open = request !== null;

  function setActiveIndex(index: number): void {
    setActive({ id: requestIdentity, index });
  }

  const syllables =
    open && request ? resolveTokenSyllables(request, meteredLine) : 0;
  const lineTotal = meteredLine?.total ?? 0;
  const lineTarget = meteredLine?.target ?? null;

  const cacheKey =
    open && request
      ? rankedCacheKey({
          mode: request.mode,
          word: request.word,
          lineTotal,
          lineTarget,
          tokenSyllables: syllables,
          overrideRevision,
        })
      : null;

  const cached = cacheKey ? getCachedRanked(cacheKey) : undefined;
  const remoteMatch = cacheKey && remote?.key === cacheKey ? remote : null;
  const candidates = cached ?? remoteMatch?.items ?? null;
  const loadState = !open
    ? "idle"
    : remoteMatch?.error
      ? "error"
      : candidates
        ? "ready"
        : "loading";

  useEffect(() => {
    if (!open || !request || !cacheKey || cached) return;

    let cancelled = false;
    const load =
      request.mode === "thesaurus"
        ? loadThesaurus().then(() => lookupSynonyms(request.word))
        : loadRhymeIndex().then(() => lookupRhymes(request.word));

    void load
      .then((words) => {
        if (cancelled) return;
        const ranked = rankCandidates({
          candidates: words,
          tokenSyllables: syllables,
          lineTotal,
          lineTarget,
          overrides,
        });
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
    request,
    cacheKey,
    cached,
    syllables,
    lineTotal,
    lineTarget,
    overrides,
  ]);

  useLayoutEffect(() => {
    if (!open || loadState !== "ready") return;
    listRef.current?.focus();
  }, [open, loadState, requestIdentity]);

  function applyCandidate(candidate: RankedCandidate): void {
    if (!request) return;
    const insert = preserveCasing(request.raw, candidate.word);
    onReplace(request.from, request.to, insert);
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

  const isThesaurus = request?.mode === "thesaurus";
  const title = request
    ? isThesaurus
      ? `Synonyms for ${request.raw}`
      : `Rhymes for ${request.raw}`
    : "Word lookup";
  const emptyLabel = isThesaurus ? "No synonyms found." : "No rhymes found.";
  const errorLabel = isThesaurus
    ? "Couldn’t load thesaurus."
    : "Couldn’t load rhymes.";
  const description = isThesaurus
    ? "Choose a synonym. Options are sorted by syllable count. Meter-matching options are marked."
    : "Choose a rhyme. Options are sorted by syllable count. Meter-matching options are marked.";

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
      {request ? <WordAnchor anchor={request.anchor} /> : null}
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

        {loadState === "loading" || loadState === "idle" ? (
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
