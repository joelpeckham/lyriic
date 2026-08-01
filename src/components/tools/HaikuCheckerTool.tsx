import { useId, useMemo, useState } from "react";

import { ToolEditorPitch } from "@/components/tools/ToolEditorPitch";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/content/tools";
import { useDictRevision } from "@/hooks/useDictRevision";
import { countLine } from "@/lib/syllables";
import { cn } from "@/lib/utils";

const tool = getToolBySlug("haiku-checker")!;

const TARGETS = [5, 7, 5] as const;
const DEFAULT_LINES = [
  "An old silent pond",
  "A frog jumps into the pond",
  "Splash! Silence again",
] as const;

type LineResult = {
  count: number;
  target: number;
  delta: number;
  ok: boolean;
  empty: boolean;
};

function formatDelta(delta: number): string {
  if (delta === 0) return "0";
  if (delta > 0) return `+${delta}`;
  return `−${Math.abs(delta)}`;
}

function splitDraftLines(text: string): string[] {
  return text.replace(/\r\n/g, "\n").split("\n");
}

function applyLinesFromPaste(
  current: string[],
  pasted: string,
  startIndex = 0,
): string[] {
  const parts = splitDraftLines(pasted);
  if (parts.length === 1) {
    const next = [...current];
    next[startIndex] = parts[0] ?? "";
    return next;
  }
  const next = [...current];
  for (let i = 0; i < parts.length && startIndex + i < TARGETS.length; i++) {
    next[startIndex + i] = parts[i] ?? "";
  }
  return next;
}

function SyllableTicks({ count, target }: { count: number; target: number }) {
  const length = Math.max(target, count, 1);
  return (
    <div
      className="flex flex-wrap items-center gap-1"
      aria-hidden="true"
      title={`${count} of ${target} syllables`}
    >
      {Array.from({ length }, (_, index) => {
        const filled = index < count;
        const over = index >= target;
        return (
          <span
            key={index}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors duration-200",
              !filled && "bg-[var(--lyriic-subtle-faint)]/45",
              filled && !over && "bg-[var(--lyriic-match)]",
              filled && over && "bg-[var(--lyriic-over)]",
            )}
          />
        );
      })}
    </div>
  );
}

function MeterStatus({ results, allOk }: { results: LineResult[]; allOk: boolean }) {
  return (
    <div className="text-center">
      <p
        className={cn(
          "font-[family-name:var(--font-brand)] text-3xl tracking-[0.18em] tabular-nums transition-colors duration-300 sm:text-4xl",
          allOk ? "text-foreground" : "text-muted-foreground",
        )}
        aria-hidden="true"
      >
        {results.map((result, index) => (
          <span key={index}>
            {index > 0 ? (
              <span className="mx-1 text-muted-foreground/50 sm:mx-2">·</span>
            ) : null}
            <span
              className={cn(
                "inline-block min-w-[1.1em] transition-colors duration-300",
                result.ok
                  ? "text-foreground"
                  : result.empty
                    ? "text-muted-foreground/55"
                    : "text-[var(--lyriic-over)]",
              )}
            >
              {result.target}
            </span>
          </span>
        ))}
      </p>
      <p
        aria-live="polite"
        className={cn(
          "mt-2 font-[family-name:var(--font-ui)] text-sm transition-colors duration-300",
          allOk ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {allOk
          ? "This draft hits 5 · 7 · 5."
          : "English haiku target — adjust until each line lands."}
      </p>
    </div>
  );
}

export function HaikuCheckerTool() {
  const [lines, setLines] = useState<string[]>([...DEFAULT_LINES]);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const dictRevision = useDictRevision();
  const baseId = useId();

  const results = useMemo(() => {
    void dictRevision;
    return lines.map((line, index): LineResult => {
      const count = countLine(line).total;
      const target = TARGETS[index]!;
      const empty = line.trim().length === 0;
      return {
        count: empty ? 0 : count,
        target,
        delta: empty ? -target : count - target,
        ok: !empty && count === target,
        empty,
      };
    });
  }, [lines, dictRevision]);

  const allOk = results.every((result) => result.ok);

  const updateLine = (index: number, value: string) => {
    setLines((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const resetSample = () => {
    setLines([...DEFAULT_LINES]);
    setPasteText("");
  };

  const clearAll = () => {
    setLines(["", "", ""]);
    setPasteText("");
  };

  const applyPasteDraft = () => {
    if (!pasteText.trim()) return;
    setLines(applyLinesFromPaste(["", "", ""], pasteText, 0));
  };

  return (
    <div className="mt-8 font-[family-name:var(--font-ui)]">
      <MeterStatus results={results} allOk={allOk} />

      <div
        className={cn(
          "mt-8 rounded-xl px-4 py-6 transition-[background-color,box-shadow] duration-300 sm:px-7 sm:py-8",
          "bg-[color-mix(in_oklch,var(--lyriic-wash-b),transparent_35%)]",
          allOk &&
            "shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--lyriic-match),transparent_72%)]",
        )}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Draft
          </p>
          <div className="flex flex-wrap gap-1">
            <Button type="button" variant="ghost" size="sm" onClick={resetSample}>
              Reset sample
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
              Clear
            </Button>
          </div>
        </div>

        <ul className="mt-5 space-y-5">
          {lines.map((line, index) => {
            const result = results[index]!;
            const inputId = `${baseId}-line-${index}`;
            const statusId = `${baseId}-status-${index}`;
            return (
              <li key={index} className="min-w-0">
                <div className="flex items-end gap-3 sm:gap-4">
                  <div className="hidden w-10 shrink-0 flex-col items-end pb-2 sm:flex">
                    <span
                      className={cn(
                        "font-[family-name:var(--font-brand)] text-lg tabular-nums leading-none",
                        result.ok
                          ? "text-foreground"
                          : result.empty
                            ? "text-muted-foreground/55"
                            : "text-[var(--lyriic-over)]",
                      )}
                    >
                      {result.empty ? "—" : result.count}
                    </span>
                    <span className="mt-1 text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                      /{result.target}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor={inputId}
                      className="text-xs text-muted-foreground"
                    >
                      Line {index + 1}
                      <span className="sr-only">
                        {`, target ${result.target} syllables`}
                      </span>
                    </label>
                    <input
                      id={inputId}
                      value={line}
                      onChange={(event) =>
                        updateLine(index, event.target.value)
                      }
                      onPaste={(event) => {
                        const pasted = event.clipboardData.getData("text");
                        if (!pasted.includes("\n") && !pasted.includes("\r")) {
                          return;
                        }
                        event.preventDefault();
                        setLines((current) =>
                          applyLinesFromPaste(current, pasted, index),
                        );
                      }}
                      spellCheck={false}
                      autoComplete="off"
                      aria-invalid={
                        !result.empty && !result.ok ? true : undefined
                      }
                      aria-describedby={statusId}
                      className={cn(
                        "mt-1.5 w-full border-0 border-b bg-transparent px-0 py-2 font-[family-name:var(--font-editor)] text-lg leading-snug text-foreground outline-none transition-[border-color] duration-200 sm:text-xl",
                        "placeholder:text-muted-foreground/45",
                        "focus-visible:border-[var(--lyriic-match)]",
                        result.ok
                          ? "border-foreground/25"
                          : result.empty
                            ? "border-border"
                            : "border-[var(--lyriic-over)]/55",
                      )}
                      placeholder={
                        index === 0
                          ? "five syllables…"
                          : index === 1
                            ? "seven syllables here…"
                            : "five again…"
                      }
                    />
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <SyllableTicks
                        count={result.empty ? 0 : result.count}
                        target={result.target}
                      />
                      <p
                        id={statusId}
                        className={cn(
                          "text-sm tabular-nums",
                          result.ok
                            ? "text-foreground"
                            : result.empty
                              ? "text-muted-foreground"
                              : "text-[var(--lyriic-over)]",
                        )}
                      >
                        <span className="sm:hidden">
                          {result.empty
                            ? `Need ${result.target}`
                            : result.ok
                              ? `${result.count} — matches`
                              : `${result.count}/${result.target} (${formatDelta(result.delta)})`}
                        </span>
                        <span className="hidden sm:inline">
                          {result.empty
                            ? `Need ${result.target}`
                            : result.ok
                              ? "Matches"
                              : formatDelta(result.delta)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          aria-expanded={pasteOpen}
          onClick={() => setPasteOpen((open) => !open)}
        >
          {pasteOpen ? "Hide paste-all" : "Paste all three lines"}
        </button>
        {pasteOpen ? (
          <div className="mt-3">
            <label
              htmlFor={`${baseId}-paste`}
              className="block text-sm text-foreground"
            >
              Paste a draft
              <span className="ml-1.5 font-normal text-muted-foreground">
                — splits on newlines into the three lines
              </span>
            </label>
            <textarea
              id={`${baseId}-paste`}
              value={pasteText}
              onChange={(event) => setPasteText(event.target.value)}
              rows={4}
              spellCheck={false}
              className="mt-2 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 font-[family-name:var(--font-editor)] text-base leading-relaxed text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/80"
              placeholder={DEFAULT_LINES.join("\n")}
            />
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applyPasteDraft}
                disabled={!pasteText.trim()}
              >
                Apply to lines
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Counts use English syllables from the bundled dictionary. Traditional Japanese haiku is
        measured in <span className="italic">on</span> — sound units that are
        not the same as English syllables — so treat 5 · 7 · 5 as a useful
        teaching form, not a universal rule.
      </p>

      <ToolEditorPitch
        title="Live Haiku meter in the editor"
        body="Open the Haiku writer for 5/7/5 ticks beside each line as you write — not just after you paste. Hover or tap a word for rhymes and synonyms. Drafts stay local on your device."
        cta={tool.cta}
        to="/write/haiku"
      />
    </div>
  );
}
