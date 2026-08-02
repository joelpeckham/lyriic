import { useEffect, useMemo, useState } from "react";

import { EndRhymesSwitch } from "@/components/rhyme/EndRhymesSwitch";
import { SlantRhymesSwitch } from "@/components/rhyme/SlantRhymesSwitch";
import { RhymeWordBank } from "@/components/tools/RhymeWordBank";
import { ToolEditorPitch } from "@/components/tools/ToolEditorPitch";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/content/tools";
import { useDictRevision } from "@/hooks/useDictRevision";
import { getLexicon, syllablesForId } from "@/lib/data/lexicon";
import {
  hasRhymeEntry,
  hasRhymeQueryEntry,
  isRhymeIndexReady,
  isRhymeQueryReady,
  loadRhymeIndex,
  loadRhymeQuery,
  queryRhymeIds,
  type RhymeQueryOptions,
} from "@/lib/rhyme";
import { countWord } from "@/lib/syllables";
import { normalizeLookupKey } from "@/lib/syllables/normalize";
import { rankAndGroupRhymeIds } from "@/lib/wordLookup";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("rhyme-finder")!;

const EXAMPLE_WORDS = [
  "light",
  "heart",
  "night",
  "river",
  "alone",
  "fire",
  "fun",
] as const;

export function RhymeFinderTool() {
  const [query, setQuery] = useState("");
  const [includeEndRhymes, setIncludeEndRhymes] = useState(false);
  const [includeSlantRhymes, setIncludeSlantRhymes] = useState(false);
  const [loaded, setLoaded] = useState<{
    key: string;
    includeEnd: boolean;
    includeSlant: boolean;
  } | null>(null);
  const dictRevision = useDictRevision();
  const dictReady = dictRevision > 0;

  const trimmed = query.trim();
  const lookupKey = normalizeLookupKey(trimmed);
  const queryOpts = useMemo(
    (): RhymeQueryOptions => ({
      includeEnd: includeEndRhymes,
      includeSlant: includeSlantRhymes,
    }),
    [includeEndRhymes, includeSlantRhymes],
  );

  // Defer the multi‑MB rhyme pack until the user asks for a word.
  useEffect(() => {
    if (!lookupKey) return;
    let cancelled = false;
    void loadRhymeQuery(queryOpts).then(() => {
      if (!cancelled) {
        setLoaded({
          key: lookupKey,
          includeEnd: includeEndRhymes,
          includeSlant: includeSlantRhymes,
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [includeEndRhymes, includeSlantRhymes, lookupKey, queryOpts]);

  const modeReady =
    !!lookupKey &&
    loaded?.key === lookupKey &&
    loaded.includeEnd === includeEndRhymes &&
    loaded.includeSlant === includeSlantRhymes;
  const rhymeReady = modeReady && isRhymeQueryReady(queryOpts);

  const { rhymeIds, known } = useMemo(() => {
    if (!rhymeReady || !lookupKey) {
      return { rhymeIds: [] as number[], known: false };
    }
    return {
      rhymeIds: queryRhymeIds(lookupKey, queryOpts),
      known: hasRhymeQueryEntry(lookupKey, queryOpts),
    };
  }, [lookupKey, rhymeReady, queryOpts]);

  // When current modes are empty, probe near packs for enable hints.
  const shouldProbeNear =
    rhymeReady && !!lookupKey && rhymeIds.length === 0 && known;
  const shouldProbeEnd = shouldProbeNear && !includeEndRhymes;
  const shouldProbeSlant = shouldProbeNear && !includeSlantRhymes;
  const [, setNearProbeTick] = useState(0);
  useEffect(() => {
    if (!shouldProbeEnd && !shouldProbeSlant) return;
    let cancelled = false;
    const loads: Promise<unknown>[] = [];
    if (shouldProbeEnd) loads.push(loadRhymeIndex("end"));
    if (shouldProbeSlant) loads.push(loadRhymeIndex("slant"));
    void Promise.all(loads).then(() => {
      if (!cancelled) setNearProbeTick((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [shouldProbeEnd, shouldProbeSlant, lookupKey]);

  const endRhymesAvailable =
    shouldProbeEnd &&
    isRhymeIndexReady("end") &&
    hasRhymeEntry(lookupKey, "end");
  const slantRhymesAvailable =
    shouldProbeSlant &&
    isRhymeIndexReady("slant") &&
    hasRhymeEntry(lookupKey, "slant");

  const groups = useMemo(() => {
    if (!dictReady || !lookupKey || rhymeIds.length === 0) return [];
    void dictRevision;
    const lex = getLexicon();
    if (!lex) return [];
    const queryId = lex.wordToId.get(lookupKey);
    const packed =
      queryId !== undefined ? syllablesForId(queryId) : undefined;
    const tokenSyllables =
      packed ?? countWord(lookupKey).count;
    return rankAndGroupRhymeIds({
      ids: rhymeIds,
      words: lex.words,
      tokenSyllables,
    });
  }, [rhymeIds, dictReady, dictRevision, lookupKey]);

  const emptyHint =
    endRhymesAvailable
      ? "enable-end"
      : slantRhymesAvailable
        ? "enable-slant"
        : "no-rhymes";

  const status =
    trimmed.length === 0
      ? "empty-query"
      : !rhymeReady
        ? "loading-index"
        : !known
          ? "unknown"
          : rhymeIds.length === 0
            ? emptyHint
            : !dictReady
              ? "loading-dict"
              : "ready";

  return (
    <div className="mt-8 font-[family-name:var(--font-ui)]">
      <div className="space-y-3">
        <label htmlFor="rhyme-query" className="block text-sm text-foreground">
          Find rhymes for
          <Input
            id="rhyme-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            placeholder="a word at the end of a line…"
            className={cn(
              "mt-2 h-12 border-border/80 bg-[var(--lyriic-wash-c)] px-3",
              "font-[family-name:var(--font-editor)] text-lg tracking-wide md:text-lg",
              "placeholder:font-[family-name:var(--font-ui)] placeholder:text-base placeholder:tracking-normal",
            )}
          />
        </label>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <EndRhymesSwitch
            checked={includeEndRhymes}
            onCheckedChange={setIncludeEndRhymes}
          />
          <SlantRhymesSwitch
            checked={includeSlantRhymes}
            onCheckedChange={setIncludeSlantRhymes}
          />
        </div>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 text-sm">
          <span className="text-muted-foreground">Try</span>
          {EXAMPLE_WORDS.map((word) => {
            const active = lookupKey === word;
            return (
              <button
                key={word}
                type="button"
                onClick={() => setQuery(word)}
                className={cn(
                  "font-[family-name:var(--font-editor)] text-foreground/80 underline-offset-4",
                  "outline-none transition-colors hover:text-foreground hover:underline hover:decoration-[var(--lyriic-ruler)]",
                  "focus-visible:underline focus-visible:text-foreground focus-visible:decoration-[var(--lyriic-ruler)]",
                  active &&
                    "text-foreground underline decoration-[var(--lyriic-ruler)]",
                )}
                aria-pressed={active}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mt-8 min-h-[8rem]"
        aria-live="polite"
        aria-busy={status === "loading-index" || status === "loading-dict"}
      >
        {status === "loading-index" ? (
          <p className="text-sm text-muted-foreground">
            Opening the local rhyme index…
          </p>
        ) : null}

        {status === "empty-query" ? (
          <p className="text-sm text-muted-foreground">
            Type a word—or pick one above—and rhymes load from the on-device
            dictionary.
          </p>
        ) : null}

        {status === "unknown" ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            “{trimmed}” isn’t in the local index. Try a common English word, or
            open the editor and keep drafting—the lookup is meant for everyday
            diction, not every proper name.
          </p>
        ) : null}

        {status === "enable-end" ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            No perfect rhymes for “{trimmed}”, but end rhymes are available.
            Turn on End rhymes above to see matches that share the final
            syllable.
          </p>
        ) : null}

        {status === "enable-slant" ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            No exact rhymes for “{trimmed}”, but slant rhymes are available.
            Turn on Slant rhymes above for related vowel and coda families.
          </p>
        ) : null}

        {status === "no-rhymes" ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            The index knows “{trimmed}”, but no other rhymes share its ending
            sound here. In the editor, hover or tap the word for synonyms or a
            near fit that might serve the line better.
          </p>
        ) : null}

        {status === "loading-dict" ? (
          <p className="text-sm text-muted-foreground">
            Found {rhymeIds.length} rhyme{rhymeIds.length === 1 ? "" : "s"}
            —sorting by syllable count…
          </p>
        ) : null}

        {status === "ready" ? (
          <RhymeWordBank
            groups={groups}
            query={trimmed}
            totalShown={rhymeIds.length}
          />
        ) : null}
      </div>

      <ToolEditorPitch
        title="Rhymes beside the draft"
        body="In the lyriic editor, hover or tap a word for rhymes sorted by syllable count—right beside your draft, with meter-aware highlighting when a ruler is on."
        cta={tool.cta}
      />
    </div>
  );
}
