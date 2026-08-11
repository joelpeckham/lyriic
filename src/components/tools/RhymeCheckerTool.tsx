import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ToolEditorPitch } from "@/components/tools/ToolEditorPitch";
import { Input } from "@/components/ui/input";
import { getToolBySlug } from "@/content/tools";
import { getLexicon } from "@/lib/data/lexicon";
import {
  hasRhymeQueryEntry,
  isRhymeQueryReady,
  loadRhymeQuery,
  wordsRhyme,
  type RhymeQueryOptions,
} from "@/lib/rhyme";
import { normalizeLookupKey } from "@/lib/syllables/normalize";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("rhyme-checker")!;

const EXAMPLE_PAIRS = [
  { a: "light", b: "night" },
  { a: "heart", b: "part" },
  { a: "fun", b: "anyone" },
  { a: "night", b: "side" },
  { a: "alone", b: "home" },
] as const;

type Verdict =
  | "empty"
  | "loading"
  | "unknown-a"
  | "unknown-b"
  | "perfect"
  | "end"
  | "slant"
  | "none";

const ALL_MODES: RhymeQueryOptions = {
  includeEnd: true,
  includeSlant: true,
};

export function RhymeCheckerTool() {
  const [wordA, setWordA] = useState("");
  const [wordB, setWordB] = useState("");
  const [loaded, setLoaded] = useState(false);

  const keyA = normalizeLookupKey(wordA.trim());
  const keyB = normalizeLookupKey(wordB.trim());
  const bothReady = !!keyA && !!keyB;

  useEffect(() => {
    if (!bothReady) return;
    let cancelled = false;
    void loadRhymeQuery(ALL_MODES).then(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [bothReady, keyA, keyB]);

  const packsReady = loaded && isRhymeQueryReady(ALL_MODES);

  const verdict = useMemo((): Verdict => {
    if (!keyA || !keyB) return "empty";
    if (!packsReady) return "loading";

    const lex = getLexicon();
    const inLexA = lex?.wordToId.has(keyA) ?? false;
    const inLexB = lex?.wordToId.has(keyB) ?? false;
    if (!inLexA || !hasRhymeQueryEntry(keyA, ALL_MODES)) return "unknown-a";
    if (!inLexB || !hasRhymeQueryEntry(keyB, ALL_MODES)) return "unknown-b";

    if (wordsRhyme(keyA, keyB, "perfect")) return "perfect";
    if (wordsRhyme(keyA, keyB, "end")) return "end";
    if (wordsRhyme(keyA, keyB, "slant")) return "slant";
    return "none";
  }, [keyA, keyB, packsReady]);

  const displayA = wordA.trim() || "…";
  const displayB = wordB.trim() || "…";

  return (
    <div className="mt-8 font-[family-name:var(--font-ui)]">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <label htmlFor="rhyme-a" className="block text-sm text-foreground">
            First word
            <Input
              id="rhyme-a"
              value={wordA}
              onChange={(event) => setWordA(event.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              placeholder="light"
              className={cn(
                "mt-2 h-12 border-border/80 bg-[var(--lyriic-wash-c)] px-3",
                "font-[family-name:var(--font-editor)] text-lg tracking-wide md:text-lg",
                "placeholder:font-[family-name:var(--font-ui)] placeholder:text-base placeholder:tracking-normal",
              )}
            />
          </label>
          <p
            className="hidden pb-3 text-sm text-muted-foreground sm:block"
            aria-hidden
          >
            rhyme with
          </p>
          <label htmlFor="rhyme-b" className="block text-sm text-foreground">
            Second word
            <Input
              id="rhyme-b"
              value={wordB}
              onChange={(event) => setWordB(event.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              placeholder="night"
              className={cn(
                "mt-2 h-12 border-border/80 bg-[var(--lyriic-wash-c)] px-3",
                "font-[family-name:var(--font-editor)] text-lg tracking-wide md:text-lg",
                "placeholder:font-[family-name:var(--font-ui)] placeholder:text-base placeholder:tracking-normal",
              )}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 text-sm">
          <span className="text-muted-foreground">Try</span>
          {EXAMPLE_PAIRS.map((pair) => {
            const active = keyA === pair.a && keyB === pair.b;
            return (
              <button
                key={`${pair.a}-${pair.b}`}
                type="button"
                onClick={() => {
                  setWordA(pair.a);
                  setWordB(pair.b);
                }}
                className={cn(
                  "font-[family-name:var(--font-editor)] text-foreground/80 underline-offset-4",
                  "outline-none transition-colors hover:text-foreground hover:underline hover:decoration-[var(--lyriic-ruler)]",
                  "focus-visible:underline focus-visible:text-foreground focus-visible:decoration-[var(--lyriic-ruler)]",
                  active &&
                    "text-foreground underline decoration-[var(--lyriic-ruler)]",
                )}
                aria-pressed={active}
              >
                {pair.a} / {pair.b}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mt-8 min-h-[8rem]"
        aria-live="polite"
        aria-busy={verdict === "loading"}
      >
        {verdict === "empty" ? (
          <p className="text-sm text-muted-foreground">
            Type two words—or pick a pair above—to check whether they rhyme.
            Perfect, end, and slant matches all run from the on-device
            dictionary.
          </p>
        ) : null}

        {verdict === "loading" ? (
          <p className="text-sm text-muted-foreground">
            Opening the local rhyme index…
          </p>
        ) : null}

        {verdict === "unknown-a" ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            “{displayA}” isn’t in the local index. Try a common English word —
            the checker is built for everyday diction, not every proper name.
          </p>
        ) : null}

        {verdict === "unknown-b" ? (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            “{displayB}” isn’t in the local index. Try a common English word —
            the checker is built for everyday diction, not every proper name.
          </p>
        ) : null}

        {verdict === "perfect" ? (
          <div className="max-w-prose space-y-2">
            <p className="text-base text-foreground">
              Yes — <span className="font-medium">{displayA}</span> and{" "}
              <span className="font-medium">{displayB}</span> are a{" "}
              <span className="font-medium">perfect rhyme</span>.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              They share the same stressed vowel and everything after it (light
              / night, heart / part).
            </p>
          </div>
        ) : null}

        {verdict === "end" ? (
          <div className="max-w-prose space-y-2">
            <p className="text-base text-foreground">
              Close — <span className="font-medium">{displayA}</span> and{" "}
              <span className="font-medium">{displayB}</span> are an{" "}
              <span className="font-medium">end rhyme</span>.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              They share the final syllable even when stress differs (fun /
              anyone). Not a perfect rhyme, but often useful at line ends.
            </p>
          </div>
        ) : null}

        {verdict === "slant" ? (
          <div className="max-w-prose space-y-2">
            <p className="text-base text-foreground">
              Near — <span className="font-medium">{displayA}</span> and{" "}
              <span className="font-medium">{displayB}</span> are a{" "}
              <span className="font-medium">slant rhyme</span>.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              They share a related vowel and coda family (night / side), or
              differ by one coda segment (mind / time). Looser than a perfect
              rhyme.
            </p>
          </div>
        ) : null}

        {verdict === "none" ? (
          <div className="max-w-prose space-y-2">
            <p className="text-base text-foreground">
              No — <span className="font-medium">{displayA}</span> and{" "}
              <span className="font-medium">{displayB}</span> do not rhyme in
              the local index.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              No perfect, end, or slant match. Browse more candidates in the{" "}
              <Link
                to="/tools/rhyme-finder"
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                rhyme finder
              </Link>
              , or hover a word in the editor for synonyms and near fits.
            </p>
          </div>
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
