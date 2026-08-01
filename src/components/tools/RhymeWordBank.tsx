import { useId, useState } from "react";

import { toast } from "sonner";

import type { RhymeSyllableGroup } from "@/lib/wordLookup";
import { cn } from "@/lib/utils";

export type { RhymeSyllableGroup };

type RhymeWordBankProps = {
  groups: RhymeSyllableGroup[];
  query: string;
  totalShown: number;
};

export function RhymeWordBank({
  groups,
  query,
  totalShown,
}: RhymeWordBankProps) {
  const listId = useId();
  const [copied, setCopied] = useState<string | null>(null);

  function copyWord(word: string) {
    void navigator.clipboard.writeText(word).then(
      () => {
        setCopied(word);
        toast(`“${word}” copied`);
        window.setTimeout(() => {
          setCopied((current) => (current === word ? null : current));
        }, 1200);
      },
      () => {
        toast("Couldn’t copy — try selecting the word");
      },
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-[var(--lyriic-subtle)]">
        {totalShown} rhyme{totalShown === 1 ? "" : "s"} for “{query}”
        <span className="text-muted-foreground"> · click to copy</span>
      </p>

      <div
        id={listId}
        aria-label={`Rhymes for ${query}, grouped by syllable count`}
        className="max-h-[min(70vh,36rem)] space-y-5 overflow-y-auto"
      >
        {groups.map((group) => (
          <section
            key={group.syllables}
            aria-labelledby={`${listId}-s${group.syllables}`}
            className="[content-visibility:auto] [contain-intrinsic-size:auto_8rem]"
          >
            <h3
              id={`${listId}-s${group.syllables}`}
              className="mb-2 flex items-baseline gap-2 border-b border-border/50 pb-1 font-[family-name:var(--font-brand)] text-sm tracking-wide text-[var(--lyriic-subtle)]"
            >
              <span>
                {group.syllables} syllable
                {group.syllables === 1 ? "" : "s"}
              </span>
              <span className="font-[family-name:var(--font-ui)] font-normal text-muted-foreground tabular-nums">
                {group.words.length}
              </span>
            </h3>
            <div className="flex flex-wrap gap-x-0.5 gap-y-0.5">
              {group.words.map((word) => {
                const isCopied = copied === word;
                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => copyWord(word)}
                    className={cn(
                      "rounded-md px-2 py-1 text-left font-[family-name:var(--font-editor)] text-[0.95rem] leading-snug text-foreground sm:text-base",
                      "transition-colors outline-none",
                      "hover:bg-[var(--lyriic-selection)] hover:text-[var(--lyriic-ink)]",
                      "focus-visible:ring-2 focus-visible:ring-ring/70",
                      isCopied &&
                        "bg-[var(--lyriic-selection)] text-[var(--lyriic-ink)]",
                    )}
                    aria-label={`Copy ${word}`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
