import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronDown, Copy, Search } from "lucide-react";
import { toast } from "sonner";

import { EndRhymesSwitch } from "@/components/rhyme/EndRhymesSwitch";
import { SlantRhymesSwitch } from "@/components/rhyme/SlantRhymesSwitch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useDictRevision } from "@/hooks/useDictRevision";
import {
  getLexicon,
  isLexiconReady,
  loadLexicon,
  lookupDict,
  syllablesForId,
} from "@/lib/data/lexicon";
import {
  loadDefinitions,
  type DefinitionSource,
  type ResolvedDefinitionSense,
} from "@/lib/definitions";
import {
  isRhymeQueryReady,
  loadRhymeQuery,
  materializeWords,
  queryRhymeIds,
} from "@/lib/rhyme";
import { normalizeLookupKey, normalizeWord } from "@/lib/syllables/normalize";
import {
  loadThesaurus,
  lookupSynonymsForBrowse,
  type WordUsage,
} from "@/lib/thesaurus";
import { filterCandidates } from "@/lib/wordLookup/filterCandidates";
import { suggestWords } from "@/lib/wordLookup/suggestWords";
import { cn } from "@/lib/utils";

const USAGE_LABELS: Record<WordUsage, string> = {
  n: "noun",
  v: "verb",
  a: "adjective",
  r: "adverb",
};

const USAGE_ORDER: WordUsage[] = ["n", "v", "a", "r"];
const LIST_CAP = 150;
const SUGGEST_LIMIT = 8;

const EXAMPLE_WORDS = [
  "light",
  "heart",
  "night",
  "river",
  "alone",
  "fire",
] as const;

type BrowseRow = {
  word: string;
  syllables: number;
  usage?: WordUsage;
};

type DefinitionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Seed / reset the search when the sheet opens. */
  initialWord?: string | null;
};

function syllablesForWord(word: string): number {
  const key = normalizeLookupKey(word);
  const fromDict = lookupDict(key);
  if (fromDict != null) return fromDict;
  const lex = getLexicon();
  const id = lex?.wordToId.get(key);
  if (id != null) return syllablesForId(id) ?? 0;
  return 0;
}

function groupSenses(senses: ResolvedDefinitionSense[]) {
  const groups: Array<{ usage: WordUsage; senses: ResolvedDefinitionSense[] }> =
    [];
  for (const usage of USAGE_ORDER) {
    const list = senses.filter((s) => s.usage === usage);
    if (list.length > 0) groups.push({ usage, senses: list });
  }
  return groups;
}

function sourceAttribution(senses: ResolvedDefinitionSense[]): string | null {
  if (senses.length === 0) return null;
  const sources = new Set<DefinitionSource>(senses.map((s) => s.source));
  if (sources.has("oewn") && sources.has("wiktionary")) {
    return "Definitions from Open English WordNet (CC-BY 4.0) and Wiktionary (CC-BY-SA).";
  }
  if (sources.has("wiktionary")) {
    return "Definitions from Wiktionary (CC-BY-SA).";
  }
  return "Definitions from Open English WordNet (CC-BY 4.0).";
}

function normalizeSearchQuery(raw: string): string {
  return normalizeLookupKey(normalizeWord(raw.trim()));
}

/** Min/max known syllable counts among candidates; ignores unknown (≤0). */
function syllableBounds(
  rows: ReadonlyArray<{ syllables: number }>,
): { min: number; max: number } | null {
  let min = Infinity;
  let max = -Infinity;
  for (const row of rows) {
    if (row.syllables <= 0) continue;
    if (row.syllables < min) min = row.syllables;
    if (row.syllables > max) max = row.syllables;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return { min, max };
}

function rangesEqual(
  a: readonly [number, number],
  b: readonly [number, number],
): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function syllableRangeLabel(min: number, max: number): string {
  if (min === max) return `${min} syllable${min === 1 ? "" : "s"}`;
  return `${min}–${max} syllables`;
}

/** Stricter-than-full-bounds selection, clamped to current candidate bounds. */
function activeSyllableRange(
  bounds: { min: number; max: number } | null,
  range: [number, number] | null,
): [number, number] | null {
  if (!bounds || bounds.min === bounds.max || !range) return null;
  const lo = Math.min(
    Math.max(range[0], bounds.min),
    bounds.max,
  );
  const hi = Math.min(
    Math.max(range[1], bounds.min),
    bounds.max,
  );
  const clamped: [number, number] = [Math.min(lo, hi), Math.max(lo, hi)];
  if (rangesEqual(clamped, [bounds.min, bounds.max])) return null;
  return clamped;
}

export function DefinitionSheet({
  open,
  onOpenChange,
  initialWord = null,
}: DefinitionSheetProps) {
  const searchId = useId();
  const listboxId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const blurCloseTimer = useRef<number | null>(null);
  const dictRevision = useDictRevision();

  const [query, setQuery] = useState("");
  const [activeWord, setActiveWord] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [defLoad, setDefLoad] = useState<{
    key: string;
    lemma: string;
    senses: ResolvedDefinitionSense[];
    error: boolean;
  } | null>(null);
  const [thesaurusLoad, setThesaurusLoad] = useState<{
    key: string;
    error: boolean;
  } | null>(null);
  const [rhymeLoad, setRhymeLoad] = useState<{
    key: string;
    error: boolean;
  } | null>(null);

  const [synSub, setSynSub] = useState("");
  /** User syllable range override; null means full candidate bounds. */
  const [synSylRange, setSynSylRange] = useState<[number, number] | null>(null);

  const [rhymeSub, setRhymeSub] = useState("");
  const [includeEndRhymes, setIncludeEndRhymes] = useState(false);
  const [includeSlantRhymes, setIncludeSlantRhymes] = useState(false);
  const [rhymeSylRange, setRhymeSylRange] = useState<[number, number] | null>(
    null,
  );

  const [suggestOpen, setSuggestOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      const seed = initialWord?.trim() ?? "";
      const normalized = seed ? normalizeSearchQuery(seed) : "";
      setQuery(seed);
      setActiveWord(normalized);
      setDefLoad(null);
      setThesaurusLoad(null);
      setRhymeLoad(null);
      setIncludeEndRhymes(false);
      setIncludeSlantRhymes(false);
      setSynSub("");
      setSynSylRange(null);
      setRhymeSub("");
      setRhymeSylRange(null);
      setSuggestOpen(false);
      setHighlight(-1);
    }
  }

  const defKey =
    open && activeWord ? `${activeWord}:${reloadToken}` : "";
  const thesaurusKey = open && activeWord ? activeWord : "";
  const rhymeKey =
    open && activeWord
      ? `${activeWord}:${includeEndRhymes ? 1 : 0}:${includeSlantRhymes ? 1 : 0}`
      : "";

  const defCached = defLoad?.key === defKey ? defLoad : null;
  const thesaurusCached =
    thesaurusLoad?.key === thesaurusKey ? thesaurusLoad : null;
  const rhymeCached = rhymeLoad?.key === rhymeKey ? rhymeLoad : null;

  const defState: "idle" | "loading" | "ready" | "error" = !defKey
    ? "idle"
    : !defCached
      ? "loading"
      : defCached.error
        ? "error"
        : "ready";
  const senses = defState === "ready" ? defCached!.senses : null;
  const resolvedLemma = defState === "ready" ? defCached!.lemma : "";
  const thesaurusReady = Boolean(thesaurusCached && !thesaurusCached.error);
  const rhymeReady = Boolean(rhymeCached && !rhymeCached.error);
  const thesaurusError = Boolean(thesaurusCached?.error);
  const rhymeError = Boolean(rhymeCached?.error);

  const lexiconReady = isLexiconReady() || dictRevision > 0;
  const suggestPrefix = normalizeSearchQuery(query);
  const suggestions =
    lexiconReady && suggestPrefix.length >= 2
      ? suggestWords(suggestPrefix, SUGGEST_LIMIT)
      : [];
  const listVisible = suggestOpen && suggestions.length > 0;

  // Kick lexicon for autocomplete. Focus is handled in onOpenAutoFocus —
  // Radix focuses the first tabbable (the search input) unless prevented.
  useEffect(() => {
    if (!open) return;
    void loadLexicon();
  }, [open]);

  useEffect(() => {
    return () => {
      if (blurCloseTimer.current != null) {
        window.clearTimeout(blurCloseTimer.current);
      }
    };
  }, []);

  // Load definitions for the active word.
  useEffect(() => {
    if (!defKey || defCached) return;

    let cancelled = false;
    void loadDefinitions(activeWord)
      .then((result) => {
        if (cancelled) return;
        setDefLoad({
          key: defKey,
          lemma: result.lemma,
          senses: result.senses,
          error: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setDefLoad({
          key: defKey,
          lemma: "",
          senses: [],
          error: true,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [defKey, defCached, activeWord]);

  // Load thesaurus for synonym browse (independent of rhyme toggles).
  useEffect(() => {
    if (!thesaurusKey || thesaurusCached) return;

    let cancelled = false;
    void (async () => {
      try {
        await Promise.all([loadLexicon(), loadThesaurus()]);
        if (!cancelled) {
          setThesaurusLoad({ key: thesaurusKey, error: false });
        }
      } catch {
        if (!cancelled) {
          setThesaurusLoad({ key: thesaurusKey, error: true });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [thesaurusKey, thesaurusCached]);

  // Load rhyme packs separately so toggling end/slant does not clear synonyms.
  useEffect(() => {
    if (!rhymeKey || rhymeCached) return;

    let cancelled = false;
    void (async () => {
      try {
        await loadRhymeQuery({
          includeEnd: includeEndRhymes,
          includeSlant: includeSlantRhymes,
        });
        if (!cancelled) {
          setRhymeLoad({ key: rhymeKey, error: false });
        }
      } catch {
        if (!cancelled) {
          setRhymeLoad({ key: rhymeKey, error: true });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [rhymeKey, rhymeCached, includeEndRhymes, includeSlantRhymes]);

  function clearSynFilters(): void {
    setSynSub("");
    setSynSylRange(null);
  }

  function clearRhymeFilters(): void {
    setRhymeSub("");
    setRhymeSylRange(null);
  }

  function closeSuggestions(): void {
    setSuggestOpen(false);
    setHighlight(-1);
  }

  function commitSearch(raw: string): void {
    const next = normalizeSearchQuery(raw);
    setQuery(raw.trim() || raw);
    closeSuggestions();
    if (next !== activeWord) {
      clearSynFilters();
      clearRhymeFilters();
      setDefLoad(null);
    }
    setActiveWord(next);
  }

  function onSubmit(event: FormEvent): void {
    event.preventDefault();
    if (listVisible && highlight >= 0 && suggestions[highlight]) {
      commitSearch(suggestions[highlight]!);
      return;
    }
    commitSearch(query);
  }

  function onSearchKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") {
      if (listVisible) {
        event.preventDefault();
        closeSuggestions();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      setSuggestOpen(true);
      setHighlight((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      setSuggestOpen(true);
      setHighlight((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      // Form onSubmit handles commit (with optional highlight).
      return;
    }
  }

  function onSearchChange(value: string): void {
    setQuery(value);
    setHighlight(-1);
    const nextPrefix = normalizeSearchQuery(value);
    setSuggestOpen(nextPrefix.length >= 2);
  }

  function onSearchFocus(): void {
    if (blurCloseTimer.current != null) {
      window.clearTimeout(blurCloseTimer.current);
      blurCloseTimer.current = null;
    }
    if (suggestPrefix.length >= 2 && suggestions.length > 0) {
      setSuggestOpen(true);
    }
  }

  function onSearchBlur(): void {
    blurCloseTimer.current = window.setTimeout(() => {
      closeSuggestions();
      blurCloseTimer.current = null;
    }, 120);
  }

  function navigateTo(word: string): void {
    commitSearch(word);
  }

  function retryDefinitions(): void {
    setDefLoad(null);
    setReloadToken((n) => n + 1);
  }

  function copyWord(word: string): void {
    void navigator.clipboard.writeText(word).then(
      () => toast(`“${word}” copied to clipboard`),
      () => toast("Couldn’t copy to clipboard"),
    );
  }

  const synRows: BrowseRow[] = thesaurusReady
    ? lookupSynonymsForBrowse(activeWord).map((s) => ({
        word: s.word,
        usage: s.usage,
        syllables: syllablesForWord(s.word),
      }))
    : [];

  const rhymeOpts = {
    includeEnd: includeEndRhymes,
    includeSlant: includeSlantRhymes,
  };
  const rhymeRows: BrowseRow[] =
    rhymeReady && isRhymeQueryReady(rhymeOpts)
      ? materializeWords(queryRhymeIds(activeWord, rhymeOpts)).map((word) => ({
          word,
          syllables: syllablesForWord(word),
        }))
      : [];

  const synBounds = syllableBounds(synRows);
  const rhymeBounds = syllableBounds(rhymeRows);
  const synActiveRange = activeSyllableRange(synBounds, synSylRange);
  const rhymeActiveRange = activeSyllableRange(rhymeBounds, rhymeSylRange);

  const synFilters = {
    substring: synSub,
    syllableMin: synActiveRange?.[0] ?? null,
    syllableMax: synActiveRange?.[1] ?? null,
  };
  const rhymeFilters = {
    substring: rhymeSub,
    syllableMin: rhymeActiveRange?.[0] ?? null,
    syllableMax: rhymeActiveRange?.[1] ?? null,
  };

  const filteredSyns = filterCandidates(synRows, synFilters, LIST_CAP);
  const filteredRhymes = filterCandidates(rhymeRows, rhymeFilters, LIST_CAP);

  const synFiltersActive =
    Boolean(synSub.trim()) || synActiveRange != null;
  const rhymeFiltersActive =
    Boolean(rhymeSub.trim()) || rhymeActiveRange != null;

  const senseGroups = senses ? groupSenses(senses) : [];
  const attribution = senses ? sourceAttribution(senses) : null;
  const mixedSources =
    senses != null &&
    senses.some((s) => s.source === "oewn") &&
    senses.some((s) => s.source === "wiktionary");
  const titleLemma =
    resolvedLemma && resolvedLemma !== activeWord
      ? resolvedLemma
      : activeWord;
  const showResolvedNote =
    Boolean(resolvedLemma) &&
    resolvedLemma !== activeWord &&
    defState === "ready";

  const activeOptionId =
    listVisible && highlight >= 0
      ? `${listboxId}-opt-${highlight}`
      : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 overflow-hidden"
        onOpenAutoFocus={(event) => {
          // Prefill (Define / word tools): do not focus search — keeps the soft
          // keyboard down and avoids opening autocomplete on the seeded word.
          if (initialWord?.trim()) {
            event.preventDefault();
            return;
          }
          // Empty open: focus search for typing.
          event.preventDefault();
          searchRef.current?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById("poem")?.focus();
        }}
      >
        <SheetHeader className="shrink-0">
          <SheetTitle>Dictionary</SheetTitle>
          <SheetDescription>
            Definitions, synonyms, and rhymes for any word.
          </SheetDescription>
        </SheetHeader>

        {/* Non-scrolling search chrome — padding keeps input border/ring inside overflow-hidden. */}
        <div className="z-10 shrink-0 px-4 pt-1 pb-3">
          <div className="relative">
            <form className="relative" onSubmit={onSubmit}>
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Label htmlFor={searchId} className="sr-only">
                Look up a word
              </Label>
              <Input
                ref={searchRef}
                id={searchId}
                role="combobox"
                value={query}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={onSearchKeyDown}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
                placeholder="Search a word…"
                autoComplete="off"
                spellCheck={false}
                aria-autocomplete="list"
                aria-expanded={listVisible}
                aria-controls={listVisible ? listboxId : undefined}
                aria-activedescendant={activeOptionId}
                className="pl-8 font-[family-name:var(--font-editor)]"
              />
            </form>

            {listVisible ? (
              <ul
                id={listboxId}
                role="listbox"
                aria-label="Word suggestions"
                className="absolute top-full right-0 left-0 z-10 mt-1 max-h-56 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
              >
                {suggestions.map((word, index) => {
                  const selected = index === highlight;
                  return (
                    <li key={word} className="min-w-0">
                      <button
                        id={`${listboxId}-opt-${index}`}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={cn(
                          "flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm outline-none",
                          "font-[family-name:var(--font-editor)]",
                          "focus-visible:ring-3 focus-visible:ring-ring/80",
                          selected ? "bg-muted" : "hover:bg-muted/70",
                        )}
                        onMouseEnter={() => setHighlight(index)}
                        onMouseDown={(event) => {
                          // Keep input focus until commit; avoid blur-close racing the click.
                          event.preventDefault();
                        }}
                        onClick={() => commitSearch(word)}
                      >
                        {word}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6">
          {!activeWord ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Type a word—or pick one below—to look up definitions, synonyms,
                and rhymes.
              </p>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 text-sm">
                <span className="text-muted-foreground">Try</span>
                {EXAMPLE_WORDS.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => commitSearch(word)}
                    className={cn(
                      "font-[family-name:var(--font-editor)] text-foreground/80 underline-offset-4",
                      "outline-none transition-colors hover:text-foreground hover:underline hover:decoration-[var(--lyriic-ruler)]",
                      "focus-visible:underline focus-visible:text-foreground focus-visible:decoration-[var(--lyriic-ruler)]",
                    )}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <section className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <h2 className="font-[family-name:var(--font-brand)] text-2xl tracking-tight text-foreground">
                    {titleLemma}
                  </h2>
                  {showResolvedNote ? (
                    <p className="text-xs text-muted-foreground">
                      from “{activeWord}”
                    </p>
                  ) : null}
                </div>

                {defState === "loading" ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : null}

                {defState === "error" ? (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm text-muted-foreground">
                      Couldn’t load definitions.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      className="self-start"
                      onClick={retryDefinitions}
                    >
                      Retry
                    </Button>
                  </div>
                ) : null}

                {defState === "ready" && senseGroups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No definition found for this word.
                  </p>
                ) : null}

                {defState === "ready" && senseGroups.length > 0
                  ? senseGroups.map((group) => (
                      <div key={group.usage} className="flex flex-col gap-2">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          {USAGE_LABELS[group.usage]}
                        </p>
                        <ol className="flex list-decimal flex-col gap-2 pl-5 marker:text-muted-foreground">
                          {group.senses.map((sense, index) => (
                            <li
                              key={`${group.usage}-${index}-${sense.gloss.slice(0, 24)}`}
                              className="pl-1 font-[family-name:var(--font-editor)] text-sm leading-relaxed text-foreground"
                            >
                              {sense.gloss}
                              {mixedSources ? (
                                <span className="ml-1.5 text-xs text-muted-foreground">
                                  {sense.source === "wiktionary"
                                    ? "Wikt."
                                    : "OEWN"}
                                </span>
                              ) : null}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))
                  : null}

                {attribution ? (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {attribution}
                  </p>
                ) : null}
              </section>

              <BrowseSection
                key={`syn-${activeWord}`}
                title="Synonyms"
                emptyLabel={
                  thesaurusError
                    ? "Couldn’t load synonyms."
                    : !thesaurusReady
                      ? "Loading…"
                      : synRows.length === 0
                        ? "No synonyms for this word."
                        : synFiltersActive
                          ? "No synonyms match these filters."
                          : "No synonyms for this word."
                }
                hasCandidates={synRows.length > 0}
                candidateCount={synRows.length}
                filtersActive={synFiltersActive}
                onClearFilters={clearSynFilters}
                substring={synSub}
                onSubstringChange={setSynSub}
                syllableBounds={synBounds}
                syllableRange={synSylRange}
                onSyllableRangeChange={setSynSylRange}
                rows={filteredSyns}
                truncated={filteredSyns.length === LIST_CAP}
                showUsage
                onNavigate={navigateTo}
                onCopy={copyWord}
              />

              <BrowseSection
                key={`rhyme-${activeWord}`}
                title="Rhymes"
                emptyLabel={
                  rhymeError
                    ? "Couldn’t load rhymes."
                    : !rhymeReady
                      ? "Loading…"
                      : rhymeRows.length === 0
                        ? "No rhymes for this word."
                        : rhymeFiltersActive
                          ? "No rhymes match these filters."
                          : "No rhymes for this word."
                }
                hasCandidates={rhymeRows.length > 0}
                candidateCount={rhymeRows.length}
                filtersActive={rhymeFiltersActive}
                onClearFilters={clearRhymeFilters}
                substring={rhymeSub}
                onSubstringChange={setRhymeSub}
                syllableBounds={rhymeBounds}
                syllableRange={rhymeSylRange}
                onSyllableRangeChange={setRhymeSylRange}
                rows={filteredRhymes}
                truncated={filteredRhymes.length === LIST_CAP}
                onNavigate={navigateTo}
                onCopy={copyWord}
                rhymeControls={
                  <div className="flex flex-col gap-1">
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
                }
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function BrowseSection({
  title,
  emptyLabel,
  hasCandidates,
  candidateCount,
  filtersActive,
  onClearFilters,
  substring,
  onSubstringChange,
  syllableBounds: bounds,
  syllableRange,
  onSyllableRangeChange,
  rows,
  truncated,
  showUsage,
  onNavigate,
  onCopy,
  rhymeControls,
}: {
  title: string;
  emptyLabel: string;
  hasCandidates: boolean;
  candidateCount: number;
  filtersActive: boolean;
  onClearFilters: () => void;
  substring: string;
  onSubstringChange: (value: string) => void;
  syllableBounds: { min: number; max: number } | null;
  syllableRange: [number, number] | null;
  onSyllableRangeChange: (value: [number, number] | null) => void;
  rows: BrowseRow[];
  truncated: boolean;
  showUsage?: boolean;
  onNavigate: (word: string) => void;
  onCopy: (word: string) => void;
  rhymeControls?: ReactNode;
}) {
  const [open, setOpen] = useState(hasCandidates);
  const [prevHasCandidates, setPrevHasCandidates] = useState(hasCandidates);
  if (hasCandidates !== prevHasCandidates) {
    setPrevHasCandidates(hasCandidates);
    if (hasCandidates) setOpen(true);
  }

  const sliderEnabled = bounds != null && bounds.min !== bounds.max;
  const activeRange = activeSyllableRange(bounds, syllableRange);
  const sliderValue: [number, number] =
    bounds == null
      ? [1, 1]
      : (activeRange ?? [bounds.min, bounds.max]);
  const sliderLabel = bounds
    ? syllableRangeLabel(sliderValue[0], sliderValue[1])
    : "Syllables unknown";

  return (
    <section className="flex flex-col gap-3">
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left outline-none focus-visible:underline"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          {title}
        </span>
        {candidateCount > 0 ? (
          <span className="tabular-nums text-xs text-muted-foreground">
            {candidateCount}
          </span>
        ) : null}
        <ChevronDown
          className={cn(
            "ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <>
          {rhymeControls}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <Label className="sr-only">
                  Filter {title.toLowerCase()} by text
                </Label>
                <Input
                  value={substring}
                  onChange={(e) => onSubstringChange(e.target.value)}
                  placeholder="Contains…"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-8"
                />
              </div>
              {filtersActive ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="shrink-0 text-muted-foreground"
                  onClick={onClearFilters}
                >
                  Clear
                </Button>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5 px-0.5">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs text-muted-foreground">
                  Syllables
                </Label>
                <span className="tabular-nums text-xs text-muted-foreground">
                  {sliderLabel}
                </span>
              </div>
              <Slider
                min={bounds?.min ?? 1}
                max={bounds?.max ?? 1}
                step={1}
                value={sliderValue}
                disabled={!sliderEnabled}
                onValueChange={(next) => {
                  if (!bounds || !sliderEnabled) return;
                  const range: [number, number] = [
                    next[0] ?? bounds.min,
                    next[1] ?? bounds.max,
                  ];
                  if (rangesEqual(range, [bounds.min, bounds.max])) {
                    onSyllableRangeChange(null);
                  } else {
                    onSyllableRangeChange(range);
                  }
                }}
                aria-label={`Filter ${title.toLowerCase()} by syllable count`}
              />
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-muted-foreground">{emptyLabel}</p>
              {filtersActive ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="self-start"
                  onClick={onClearFilters}
                >
                  Clear filters
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {truncated ? (
                <p className="text-xs text-muted-foreground">
                  Showing first {LIST_CAP}.
                </p>
              ) : null}
              <ul className="flex flex-col gap-0.5">
                {rows.map((row) => (
                  <li
                    key={`${row.word}-${row.usage ?? ""}`}
                    className="flex items-center gap-0.5 rounded-md hover:bg-muted/70"
                  >
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center justify-between gap-2 px-1.5 py-1 text-left text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/80"
                      onClick={() => onNavigate(row.word)}
                    >
                      <span className="min-w-0 truncate">{row.word}</span>
                      <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                        {showUsage && row.usage
                          ? `${USAGE_LABELS[row.usage]} · `
                          : null}
                        {row.syllables}
                      </span>
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="mr-0.5 shrink-0 text-muted-foreground"
                      aria-label={`Copy ${row.word}`}
                      onClick={() => onCopy(row.word)}
                    >
                      <Copy />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
