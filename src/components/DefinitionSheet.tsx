import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Copy, Search } from "lucide-react";
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
import {
  loadDefinitions,
  type DefinitionSource,
  type ResolvedDefinitionSense,
} from "@/lib/definitions";
import {
  getLexicon,
  loadLexicon,
  lookupDict,
  syllablesForId,
} from "@/lib/data/lexicon";
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
import { cn } from "@/lib/utils";

const USAGE_LABELS: Record<WordUsage, string> = {
  n: "noun",
  v: "verb",
  a: "adjective",
  r: "adverb",
};

const USAGE_ORDER: WordUsage[] = ["n", "v", "a", "r"];
const LIST_CAP = 150;

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

function clearBrowseFilters(
  setSynSub: (v: string) => void,
  setRhymeSub: (v: string) => void,
  setSynUsages: (v: Set<WordUsage>) => void,
  setSynSylMin: (v: string) => void,
  setSynSylMax: (v: string) => void,
  setRhymeSylMin: (v: string) => void,
  setRhymeSylMax: (v: string) => void,
): void {
  setSynSub("");
  setRhymeSub("");
  setSynUsages(new Set());
  setSynSylMin("");
  setSynSylMax("");
  setRhymeSylMin("");
  setRhymeSylMax("");
}

export function DefinitionSheet({
  open,
  onOpenChange,
  initialWord = null,
}: DefinitionSheetProps) {
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
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
  const [synUsages, setSynUsages] = useState<Set<WordUsage>>(new Set());
  const [synSylMin, setSynSylMin] = useState("");
  const [synSylMax, setSynSylMax] = useState("");

  const [rhymeSub, setRhymeSub] = useState("");
  const [includeEndRhymes, setIncludeEndRhymes] = useState(false);
  const [includeSlantRhymes, setIncludeSlantRhymes] = useState(false);
  const [rhymeSylMin, setRhymeSylMin] = useState("");
  const [rhymeSylMax, setRhymeSylMax] = useState("");

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
      clearBrowseFilters(
        setSynSub,
        setRhymeSub,
        setSynUsages,
        setSynSylMin,
        setSynSylMax,
        setRhymeSylMin,
        setRhymeSylMax,
      );
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
  const listError = Boolean(
    thesaurusCached?.error || rhymeCached?.error,
  );

  // Focus search when opening.
  useEffect(() => {
    if (!open) return;
    const seed = initialWord?.trim() ?? "";
    const timer = window.setTimeout(() => {
      searchRef.current?.focus();
      if (seed) searchRef.current?.select();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [open, initialWord]);

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

  function resetFilters(): void {
    clearBrowseFilters(
      setSynSub,
      setRhymeSub,
      setSynUsages,
      setSynSylMin,
      setSynSylMax,
      setRhymeSylMin,
      setRhymeSylMax,
    );
  }

  function commitSearch(raw: string): void {
    const next = normalizeSearchQuery(raw);
    setQuery(raw);
    if (next !== activeWord) {
      resetFilters();
      setDefLoad(null);
    }
    setActiveWord(next);
  }

  function onSubmit(event: FormEvent): void {
    event.preventDefault();
    commitSearch(query);
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

  const synFilters = {
    substring: synSub,
    usages: synUsages.size > 0 ? synUsages : null,
    syllableMin: synSylMin ? Number(synSylMin) : null,
    syllableMax: synSylMax ? Number(synSylMax) : null,
  };
  const rhymeFilters = {
    substring: rhymeSub,
    syllableMin: rhymeSylMin ? Number(rhymeSylMin) : null,
    syllableMax: rhymeSylMax ? Number(rhymeSylMax) : null,
  };

  const filteredSyns = filterCandidates(synRows, synFilters, LIST_CAP);
  const filteredRhymes = filterCandidates(rhymeRows, rhymeFilters, LIST_CAP);

  const synFiltersActive =
    Boolean(synSub.trim()) ||
    synUsages.size > 0 ||
    Boolean(synSylMin) ||
    Boolean(synSylMax);
  const rhymeFiltersActive =
    Boolean(rhymeSub.trim()) ||
    Boolean(rhymeSylMin) ||
    Boolean(rhymeSylMax);

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 overflow-hidden sm:max-w-md"
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

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6">
          <form className="relative" onSubmit={onSubmit}>
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Label htmlFor={searchId} className="sr-only">
              Look up a word
            </Label>
            <Input
              ref={searchRef}
              id={searchId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a word…"
              autoComplete="off"
              spellCheck={false}
              className="pl-8 font-[family-name:var(--font-editor)]"
            />
          </form>

          {!activeWord ? (
            <p className="text-sm text-muted-foreground">
              Type a word and press Enter to look it up.
            </p>
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
                title="Synonyms"
                emptyLabel={
                  listError
                    ? "Couldn’t load synonyms."
                    : !thesaurusReady
                      ? "Loading…"
                      : synRows.length === 0
                        ? "No synonyms for this word."
                        : synFiltersActive
                          ? "No synonyms match these filters."
                          : "No synonyms for this word."
                }
                onClearFilters={
                  thesaurusReady &&
                  synRows.length > 0 &&
                  filteredSyns.length === 0 &&
                  synFiltersActive
                    ? resetFilters
                    : undefined
                }
                substring={synSub}
                onSubstringChange={setSynSub}
                syllableMin={synSylMin}
                syllableMax={synSylMax}
                onSyllableMinChange={setSynSylMin}
                onSyllableMaxChange={setSynSylMax}
                rows={filteredSyns}
                showUsage
                usageFilter={synUsages}
                onToggleUsage={(usage) => {
                  setSynUsages((prev) => {
                    const next = new Set(prev);
                    if (next.has(usage)) next.delete(usage);
                    else next.add(usage);
                    return next;
                  });
                }}
                onNavigate={navigateTo}
                onCopy={copyWord}
              />

              <BrowseSection
                title="Rhymes"
                emptyLabel={
                  listError
                    ? "Couldn’t load rhymes."
                    : !rhymeReady
                      ? "Loading…"
                      : rhymeRows.length === 0
                        ? "No rhymes for this word."
                        : rhymeFiltersActive
                          ? "No rhymes match these filters."
                          : "No rhymes for this word."
                }
                onClearFilters={
                  rhymeReady &&
                  rhymeRows.length > 0 &&
                  filteredRhymes.length === 0 &&
                  rhymeFiltersActive
                    ? resetFilters
                    : undefined
                }
                substring={rhymeSub}
                onSubstringChange={setRhymeSub}
                syllableMin={rhymeSylMin}
                syllableMax={rhymeSylMax}
                onSyllableMinChange={setRhymeSylMin}
                onSyllableMaxChange={setRhymeSylMax}
                rows={filteredRhymes}
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
  onClearFilters,
  substring,
  onSubstringChange,
  syllableMin,
  syllableMax,
  onSyllableMinChange,
  onSyllableMaxChange,
  rows,
  showUsage,
  usageFilter,
  onToggleUsage,
  onNavigate,
  onCopy,
  rhymeControls,
}: {
  title: string;
  emptyLabel: string;
  onClearFilters?: () => void;
  substring: string;
  onSubstringChange: (value: string) => void;
  syllableMin: string;
  syllableMax: string;
  onSyllableMinChange: (value: string) => void;
  onSyllableMaxChange: (value: string) => void;
  rows: BrowseRow[];
  showUsage?: boolean;
  usageFilter?: Set<WordUsage>;
  onToggleUsage?: (usage: WordUsage) => void;
  onNavigate: (word: string) => void;
  onCopy: (word: string) => void;
  rhymeControls?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        {title}
      </p>

      {rhymeControls}

      {showUsage && onToggleUsage && usageFilter ? (
        <div className="flex flex-wrap gap-1">
          {USAGE_ORDER.map((usage) => {
            const selected = usageFilter.has(usage);
            return (
              <Button
                key={usage}
                type="button"
                size="xs"
                variant={selected ? "secondary" : "ghost"}
                className={cn(selected && "font-medium")}
                aria-pressed={selected}
                onClick={() => onToggleUsage(usage)}
              >
                {usage}
              </Button>
            );
          })}
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_auto_auto] items-end gap-2">
        <div className="min-w-0">
          <Label className="sr-only">Filter {title.toLowerCase()} by text</Label>
          <Input
            value={substring}
            onChange={(e) => onSubstringChange(e.target.value)}
            placeholder="Contains…"
            autoComplete="off"
            spellCheck={false}
            className="h-8"
          />
        </div>
        <div className="w-14">
          <Label className="sr-only">Min syllables</Label>
          <Input
            inputMode="numeric"
            value={syllableMin}
            onChange={(e) =>
              onSyllableMinChange(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Min"
            className="h-8 px-2 tabular-nums"
          />
        </div>
        <div className="w-14">
          <Label className="sr-only">Max syllables</Label>
          <Input
            inputMode="numeric"
            value={syllableMax}
            onChange={(e) =>
              onSyllableMaxChange(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Max"
            className="h-8 px-2 tabular-nums"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
          {onClearFilters ? (
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
        <ul className="flex max-h-56 flex-col gap-0.5 overflow-y-auto">
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
                  {row.usage ? `${row.usage} · ` : null}
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
      )}
    </section>
  );
}
