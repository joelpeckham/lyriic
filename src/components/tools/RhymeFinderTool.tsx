import { useEffect, useMemo, useState } from "react";

import { RhymeEditorPitch } from "@/components/tools/RhymeEditorPitch";
import {
  RhymeWordBank,
  type RhymeSyllableGroup,
} from "@/components/tools/RhymeWordBank";
import { Input } from "@/components/ui/input";
import { useDictRevision } from "@/hooks/useDictRevision";
import { normalizeLookupKey } from "@/lib/data/lazyJson";
import { loadRhymeIndex, lookupRhymes, type RhymeIndex } from "@/lib/rhyme";
import { countWord } from "@/lib/syllables";
import { cn } from "@/lib/utils";

const RESULT_LIMIT = 60;

const EXAMPLE_WORDS = [
  "light",
  "heart",
  "night",
  "river",
  "alone",
  "fire",
] as const;

function groupBySyllables(words: string[]): RhymeSyllableGroup[] {
  const map = new Map<number, string[]>();
  for (const word of words) {
    const { count } = countWord(word);
    const list = map.get(count);
    if (list) list.push(word);
    else map.set(count, [word]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([syllables, groupWords]) => ({
      syllables,
      words: groupWords.sort((a, b) => a.localeCompare(b)),
    }));
}

export function RhymeFinderTool() {
  const [query, setQuery] = useState("light");
  const [index, setIndex] = useState<RhymeIndex | null>(null);
  const dictRevision = useDictRevision();
  const dictReady = dictRevision > 0;
  const rhymeReady = index !== null;

  useEffect(() => {
    let cancelled = false;
    void loadRhymeIndex().then((loaded) => {
      if (!cancelled) setIndex(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const trimmed = query.trim();
  const lookupKey = normalizeLookupKey(trimmed);

  const { rhymes, known, truncated } = useMemo(() => {
    if (!index || !lookupKey) {
      return { rhymes: [] as string[], known: false, truncated: false };
    }
    const all = lookupRhymes(lookupKey);
    return {
      rhymes: all.slice(0, RESULT_LIMIT),
      known: index.byWord[lookupKey] !== undefined,
      truncated: all.length > RESULT_LIMIT,
    };
  }, [lookupKey, index]);

  const groups = useMemo(() => {
    if (!dictReady || rhymes.length === 0) return [];
    void dictRevision;
    return groupBySyllables(rhymes);
  }, [rhymes, dictReady, dictRevision]);

  const status = !rhymeReady
    ? "loading-index"
    : trimmed.length === 0
      ? "empty-query"
      : !known
        ? "unknown"
        : rhymes.length === 0
          ? "no-rhymes"
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
                  "outline-none transition-colors hover:text-foreground hover:underline",
                  "focus-visible:underline focus-visible:text-foreground",
                  active && "text-foreground underline",
                )}
                aria-pressed={active}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 min-h-[8rem]" aria-live="polite" aria-busy={status === "loading-index" || status === "loading-dict"}>
        {status === "loading-index" ? (
          <p className="text-sm text-muted-foreground">
            Opening the local rhyme index…
          </p>
        ) : null}

        {status === "empty-query" ? (
          <p className="text-sm text-muted-foreground">
            Type a word—or pick one above—and we’ll gather rhymes from the
            on-device dictionary.
          </p>
        ) : null}

        {status === "unknown" ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            “{trimmed}” isn’t in the local index. Try a common English word, or
            open the editor and keep drafting—the lookup is meant for everyday
            diction, not every proper name.
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
            Found {rhymes.length}
            {truncated ? "+" : ""} rhyme{rhymes.length === 1 ? "" : "s"}—sorting
            by syllable count…
          </p>
        ) : null}

        {status === "ready" ? (
          <RhymeWordBank
            groups={groups}
            query={trimmed}
            truncated={truncated}
            totalShown={rhymes.length}
          />
        ) : null}
      </div>

      <RhymeEditorPitch />
    </div>
  );
}
