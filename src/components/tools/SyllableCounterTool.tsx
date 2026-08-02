import { useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ToolEditorPitch } from "@/components/tools/ToolEditorPitch";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/content/tools";
import { useDictRevision } from "@/hooks/useDictRevision";
import { countLines } from "@/lib/syllables";
import type { LineSyllableCount } from "@/lib/syllables/types";
import {
  CARRY_HINT,
  continueToEditor,
  registerToolHandoffSource,
} from "@/lib/tools/continueToEditor";
import { shouldCarryToolText } from "@/lib/tools/editorHandoff";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("syllable-counter")!;

const SAMPLES = [
  {
    id: "haiku",
    label: "Haiku",
    text: "An old silent pond\nA frog jumps into the pond\nSplash! Silence again",
  },
  {
    id: "iambic",
    label: "Iambic couplet",
    text: "Shall I compare thee to a summer's day?\nThou art more lovely and more temperate.",
  },
  {
    id: "lyric",
    label: "Lyric verse",
    text:
      "I've been walking these streets at midnight\nCounting the windows lit from inside\nHoping one of them still has your name\nWritten in steam on the glass again",
  },
] as const;

const SAMPLE_TEXTS = SAMPLES.map((sample) => sample.text);

type SampleId = (typeof SAMPLES)[number]["id"];

type SyllableCounterToolProps = {
  className?: string;
};

export function SyllableCounterTool({ className }: SyllableCounterToolProps) {
  const [text, setText] = useState<string>(SAMPLES[0].text);
  const [activeSample, setActiveSample] = useState<SampleId | null>("haiku");
  const dictRevision = useDictRevision();
  const fieldId = useId();
  const summaryId = useId();

  const lines = useMemo(() => {
    void dictRevision;
    return countLines(text);
  }, [text, dictRevision]);

  const sourceLines = text.split("\n");
  const isEmpty = text.trim().length === 0;
  const nonEmptyLines = lines.filter(
    (_, index) => (sourceLines[index] ?? "").trim().length > 0,
  );
  const totalSyllables = nonEmptyLines.reduce(
    (sum, line) => sum + line.total,
    0,
  );
  const lineCount = nonEmptyLines.length;
  const carryDraft = shouldCarryToolText(text, SAMPLE_TEXTS);
  const editorCta = carryDraft
    ? "Open this draft in the editor"
    : tool.cta;
  const handoffNavigate = () => {
    continueToEditor({ text, samples: SAMPLE_TEXTS });
  };

  useEffect(() => {
    registerToolHandoffSource({ text, samples: SAMPLE_TEXTS });
    return () => registerToolHandoffSource(null);
  }, [text]);

  const clearAll = () => {
    setText("");
    setActiveSample(null);
  };

  return (
    <div className={cn("mt-8 space-y-8", className)}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-[family-name:var(--font-ui)] text-sm">
          <span className="text-muted-foreground">Try a sample</span>
          {SAMPLES.map((sample) => {
            const selected = activeSample === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setText(sample.text);
                  setActiveSample(sample.id);
                }}
                aria-pressed={selected}
                className={cn(
                  "text-foreground underline-offset-4 transition-colors hover:underline",
                  selected
                    ? "underline decoration-[var(--lyriic-ruler)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {sample.label}
              </button>
            );
          })}
        </div>

        <div
          className="rounded-xl border border-border/70 bg-[var(--lyriic-wash-b)]/40"
          style={{
            backgroundImage:
              "linear-gradient(165deg, var(--lyriic-wash-c) 0%, color-mix(in oklch, var(--lyriic-wash-b) 70%, transparent) 55%, var(--lyriic-wash-a) 100%)",
          }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border/50 px-4 py-3 font-[family-name:var(--font-ui)] sm:px-5">
            <p
              id={summaryId}
              aria-live="polite"
              aria-atomic="true"
              className="text-sm text-foreground"
            >
              {isEmpty ? (
                <span className="text-muted-foreground">
                  Type a line to see syllable counts
                </span>
              ) : (
                <>
                  <span className="font-[family-name:var(--font-brand)] text-xl tabular-nums tracking-tight">
                    {totalSyllables}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    {totalSyllables === 1 ? "syllable" : "syllables"}
                    <span className="mx-1.5 text-border" aria-hidden>
                      ·
                    </span>
                    {lineCount} {lineCount === 1 ? "line" : "lines"}
                  </span>
                </>
              )}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={isEmpty}
            >
              Clear
            </Button>
          </div>

          {carryDraft ? (
            <p className="border-b border-border/50 px-4 py-2 font-[family-name:var(--font-ui)] text-sm sm:px-5">
              <Link
                to="/write"
                onClick={handoffNavigate}
                className="text-foreground underline-offset-2 hover:underline"
              >
                Continue in the editor…
              </Link>
            </p>
          ) : null}

          <div className="grid gap-0 md:grid-cols-2 md:divide-x md:divide-border/50">
            <label
              htmlFor={fieldId}
              className="block px-4 py-4 font-[family-name:var(--font-ui)] text-sm text-foreground sm:px-5"
            >
              <span className="text-muted-foreground">Your poem or lyrics</span>
              <textarea
                id={fieldId}
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  setActiveSample(null);
                }}
                rows={10}
                spellCheck={false}
                aria-describedby={summaryId}
                placeholder={
                  "Type or paste a stanza…\nEach line gets a syllable total."
                }
                className="mt-2 w-full resize-y rounded-lg border border-input/80 bg-[var(--lyriic-wash-c)]/80 px-3 py-2.5 font-[family-name:var(--font-editor)] text-base leading-[1.7] text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/80"
              />
            </label>

            <div
              aria-live="polite"
              aria-relevant="text"
              className="border-t border-border/50 px-4 py-4 font-[family-name:var(--font-ui)] md:border-t-0 sm:px-5"
            >
              <p className="text-sm text-muted-foreground">Line readout</p>

              {isEmpty ? (
                <p className="mt-6 max-w-xs font-[family-name:var(--font-editor)] text-base leading-relaxed text-muted-foreground">
                  Paste a draft, or load a sample above. Totals update as you
                  type — per word when a line has beats to inspect.
                </p>
              ) : (
                <ol className="mt-3 space-y-4">
                  {lines.map((line, index) => (
                    <SyllableLineRow
                      key={index}
                      index={index}
                      sourceLine={sourceLines[index] ?? ""}
                      line={line}
                    />
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToolEditorPitch
        title="Count here. Write in the editor."
        body="This page gives you totals. In the full lyriic editor, syllable counts sit beside every line while you draft — with meter rulers for haiku, iambic pentameter, and dozens of other forms, plus quiet overrides when a word (say fire) should count as one beat instead of two. Drafts stay on your device."
        cta={editorCta}
        onPrimaryNavigate={handoffNavigate}
        carryHint={carryDraft ? CARRY_HINT : undefined}
      />
    </div>
  );
}

function SyllableLineRow({
  index,
  sourceLine,
  line,
}: {
  index: number;
  sourceLine: string;
  line: LineSyllableCount;
}) {
  const empty = sourceLine.trim().length === 0;

  return (
    <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3">
      <span
        className={cn(
          "pt-0.5 text-right font-[family-name:var(--font-brand)] text-lg tabular-nums leading-none tracking-tight transition-colors",
          empty
            ? "text-muted-foreground/50"
            : "text-[var(--lyriic-match)]",
        )}
        aria-label={
          empty
            ? `Line ${index + 1}, empty`
            : `Line ${index + 1}, ${line.total} syllables`
        }
      >
        {empty ? "—" : line.total}
      </span>
      <div className="min-w-0">
        {empty ? (
          <p className="text-sm text-muted-foreground/70">(empty line)</p>
        ) : (
          <>
            <p className="font-[family-name:var(--font-editor)] text-base leading-snug text-foreground">
              {sourceLine}
            </p>
            {line.perWord.length > 0 ? (
              <p className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1 text-xs leading-relaxed">
                {line.perWord.map((word, wordIndex) => (
                  <span
                    key={`${word.word}-${wordIndex}`}
                    className={cn(
                      "inline-flex items-baseline gap-1 text-muted-foreground",
                      word.source === "heuristic" && "italic",
                    )}
                    title={
                      word.source === "heuristic"
                        ? "Estimated from spelling (not in dictionary)"
                        : word.source === "override"
                          ? "Using a syllable override"
                          : "Dictionary primary pronunciation"
                    }
                  >
                    <span className="text-foreground/80">{word.word}</span>
                    <span className="tabular-nums opacity-80">{word.count}</span>
                  </span>
                ))}
              </p>
            ) : null}
          </>
        )}
      </div>
    </li>
  );
}
