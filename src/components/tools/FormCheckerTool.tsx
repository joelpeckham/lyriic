import { useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ToolEditorPitch } from "@/components/tools/ToolEditorPitch";
import { Button } from "@/components/ui/button";
import {
  getComposedFormToolPageByMeterId,
  ZEN_EDITOR_PITCH,
} from "@/content/formCheckers";
import { useDictRevision } from "@/hooks/useDictRevision";
import { useStressRevision } from "@/hooks/useStressRevision";
import { loadStress } from "@/lib/data/stress";
import {
  buildMeteredLine,
  flattenTokenStress,
  formCheckerLineCount,
  getMeterCatalogEntry,
  isStressAwareMeterConfig,
  stressMismatchMask,
  targetForLine,
} from "@/lib/meters";
import { countLine } from "@/lib/syllables";
import {
  CARRY_HINT,
  continueToEditor,
  registerToolHandoffSource,
} from "@/lib/tools/continueToEditor";
import { shouldCarryToolText } from "@/lib/tools/editorHandoff";
import { cn } from "@/lib/utils";

type FormCheckerToolProps = {
  meterId: string;
};

type LineResult = {
  count: number;
  target: number;
  delta: number;
  /** Syllable target hit (non-empty). */
  syllableOk: boolean;
  /** Stress contour ok when meter is stress-aware and pack ready; else true. */
  stressOk: boolean;
  /** Overall line ok for “all match”. */
  ok: boolean;
  empty: boolean;
  status: "none" | "under" | "exact" | "over" | "stress";
  /** Per-syllable mismatch flags when count matches and stress expected. */
  stressMask: boolean[] | null;
  expectedStress: readonly (0 | 1)[] | null;
  /** Contour rendered in stress ticks (matched literary length when stress-off). */
  stressTicks: readonly (0 | 1)[] | null;
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
  for (let i = 0; i < parts.length && startIndex + i < current.length; i++) {
    next[startIndex + i] = parts[i] ?? "";
  }
  return next;
}

function padLines(lines: readonly string[], count: number): string[] {
  const next = lines.slice(0, count);
  while (next.length < count) next.push("");
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

function StressTicks({
  expected,
  mask,
}: {
  expected: readonly (0 | 1)[];
  mask: boolean[] | null;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-0.5"
      aria-hidden="true"
      title="Expected stress (● strong · ○ weak)"
    >
      {expected.map((beat, index) => {
        const mismatch = mask?.[index] === true;
        return (
          <span
            key={index}
            className={cn(
              "inline-block text-xs leading-none transition-colors duration-200",
              mismatch
                ? "text-[var(--lyriic-over)]"
                : beat === 1
                  ? "text-foreground"
                  : "text-muted-foreground/55",
            )}
          >
            {beat === 1 ? "●" : "○"}
          </span>
        );
      })}
    </div>
  );
}

function MeterStatus({
  pattern,
  allOk,
  stressAware,
  continueTo,
  continueLabel,
  onContinue,
}: {
  pattern: readonly number[];
  allOk: boolean;
  stressAware: boolean;
  continueTo?: string;
  continueLabel?: string;
  onContinue?: () => void;
}) {
  const cycle = pattern.join(" · ");
  return (
    <div className="text-center">
      <p
        className={cn(
          "font-[family-name:var(--font-brand)] text-3xl tracking-tight tabular-nums transition-colors duration-200 sm:text-4xl",
          allOk ? "text-foreground" : "text-muted-foreground",
        )}
        aria-hidden="true"
      >
        {pattern.map((target, index) => (
          <span key={index}>
            {index > 0 ? (
              <span className="mx-1 text-muted-foreground/50 sm:mx-2">·</span>
            ) : null}
            <span className="inline-block min-w-[1.1em]">{target}</span>
          </span>
        ))}
      </p>
      <p
        aria-live="polite"
        className={cn(
          "mt-2 font-[family-name:var(--font-ui)] text-sm transition-colors duration-200",
          allOk ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {allOk
          ? `This draft hits ${cycle}${stressAware ? " with matching stress" : ""}.`
          : stressAware
            ? "Adjust syllables and stress until each line lands."
            : "Adjust until each line hits its syllable target."}
      </p>
      {continueTo && continueLabel ? (
        <p
          className={cn(
            "mt-3 font-[family-name:var(--font-ui)] text-sm",
            allOk ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <Link
            to={continueTo}
            onClick={onContinue}
            className={cn(
              "underline-offset-2 hover:underline",
              allOk
                ? "text-foreground hover:text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {continueLabel}
          </Link>
        </p>
      ) : null}
    </div>
  );
}

export function FormCheckerTool({ meterId }: FormCheckerToolProps) {
  const page = getComposedFormToolPageByMeterId(meterId);
  const entry = getMeterCatalogEntry(meterId);
  const lineCount = formCheckerLineCount(entry);
  const stressAware = isStressAwareMeterConfig(entry);
  const sampleLines = padLines(page?.sampleLines ?? [], lineCount);

  const [lines, setLines] = useState<string[]>(() => [...sampleLines]);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const dictRevision = useDictRevision();
  const stressRevision = useStressRevision();
  const baseId = useId();

  useEffect(() => {
    if (stressAware) {
      void loadStress().catch(() => {});
    }
  }, [stressAware]);

  const results = useMemo(() => {
    void dictRevision;
    void stressRevision;
    return lines.map((line, index): LineResult => {
      const target = targetForLine(entry.pattern, index) ?? 0;
      const empty = line.trim().length === 0;
      const counted = countLine(line);
      const metered = buildMeteredLine(counted, index, {
        pattern: entry.pattern,
        stressPatterns: entry.stressPatterns,
        footId: entry.footId,
      });
      const count = empty ? 0 : metered.total;
      // Exact (incl. literary length fits) and stress-off (count ok) are syllable-OK.
      const syllableOk =
        !empty &&
        (metered.status === "exact" || metered.status === "stress");
      const expectedStress = metered.expectedStress;
      const matchedStress = metered.matchedStress ?? null;
      const stressOk = empty || metered.status !== "stress";
      let stressMask: boolean[] | null = null;
      const compareTo =
        stressAware && !empty && metered.status === "stress"
          ? (matchedStress ?? expectedStress)
          : null;
      if (compareTo) {
        stressMask = stressMismatchMask(
          flattenTokenStress(metered.tokens),
          compareTo,
        );
      }
      // Length-shifted literary near-misses: ticks follow matchedStress length.
      const stressTicks =
        !empty && metered.status === "stress" && matchedStress
          ? matchedStress
          : expectedStress;
      return {
        count,
        target,
        delta: empty ? -target : count - target,
        syllableOk,
        stressOk,
        ok: !empty && metered.status === "exact",
        empty,
        status: empty ? "none" : metered.status,
        stressMask,
        expectedStress,
        stressTicks,
      };
    });
  }, [lines, dictRevision, stressRevision, entry, stressAware]);

  const allOk = results.length > 0 && results.every((result) => result.ok);
  const draftText = lines.join("\n");
  const sampleText = sampleLines.join("\n");
  const sampleList = useMemo(() => [sampleText] as const, [sampleText]);
  const carryDraft = shouldCarryToolText(draftText, sampleList);
  const writePath = page?.writePath ?? ZEN_EDITOR_PITCH.to;
  const editorCta = carryDraft
    ? "Open this draft in the editor"
    : page
      ? `Try ${page.label} in the editor`
      : ZEN_EDITOR_PITCH.cta;
  const continueLabel = carryDraft
    ? "Open this draft in the editor"
    : "Continue in the editor…";
  const handoffNavigate = () => {
    continueToEditor({ text: draftText, samples: sampleList });
  };

  useEffect(() => {
    registerToolHandoffSource({ text: draftText, samples: sampleList });
    return () => registerToolHandoffSource(null);
  }, [draftText, sampleList]);

  const updateLine = (index: number, value: string) => {
    setLines((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const resetSample = () => {
    setLines([...sampleLines]);
    setPasteText("");
  };

  const clearAll = () => {
    setLines(Array.from({ length: lineCount }, () => ""));
    setPasteText("");
  };

  const applyPasteDraft = () => {
    if (!pasteText.trim()) return;
    setLines(
      applyLinesFromPaste(
        Array.from({ length: lineCount }, () => ""),
        pasteText,
        0,
      ),
    );
  };

  return (
    <div className="mt-8 font-[family-name:var(--font-ui)]">
      <MeterStatus
        pattern={entry.pattern}
        allOk={allOk}
        stressAware={stressAware}
        continueTo={writePath}
        continueLabel={continueLabel}
        onContinue={handoffNavigate}
      />

      <div
        className={cn(
          "mt-8 rounded-xl border border-border/70 px-4 py-6 transition-colors duration-200 sm:px-7 sm:py-8",
          "bg-[color-mix(in_oklch,var(--lyriic-wash-b),transparent_35%)]",
          allOk && "border-[var(--lyriic-match)]/40",
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
                  <div className="flex w-10 shrink-0 flex-col items-end pb-2">
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
                    <span className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
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
                      placeholder={`${result.target} syllables…`}
                    />
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-col gap-1.5">
                        <SyllableTicks
                          count={result.empty ? 0 : result.count}
                          target={result.target}
                        />
                        {stressAware && result.stressTicks ? (
                          <StressTicks
                            expected={result.stressTicks}
                            mask={
                              result.syllableOk ? result.stressMask : null
                            }
                          />
                        ) : null}
                      </div>
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
                        {result.empty
                          ? `Need ${result.target}`
                          : result.ok
                            ? "Matches"
                            : result.status === "stress"
                              ? "Stress off"
                              : formatDelta(result.delta)}
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
          {pasteOpen ? "Hide paste-all" : "Paste all lines"}
        </button>
        {pasteOpen ? (
          <div className="mt-3">
            <label
              htmlFor={`${baseId}-paste`}
              className="block text-sm text-foreground"
            >
              Paste a draft
              <span className="ml-1.5 font-normal text-muted-foreground">
                — splits on newlines into the line slots
              </span>
            </label>
            <textarea
              id={`${baseId}-paste`}
              value={pasteText}
              onChange={(event) => setPasteText(event.target.value)}
              rows={Math.min(lineCount + 1, 8)}
              spellCheck={false}
              className="mt-2 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 font-[family-name:var(--font-editor)] text-base leading-relaxed text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/80"
              placeholder={sampleLines.join("\n") || "Line one\nLine two"}
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

      {page?.formNotes[0] ? (
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          {page.formNotes[0]}
        </p>
      ) : null}

      <ToolEditorPitch
        title={ZEN_EDITOR_PITCH.title}
        body={ZEN_EDITOR_PITCH.body}
        cta={editorCta}
        to={writePath}
        onPrimaryNavigate={handoffNavigate}
        carryHint={carryDraft ? CARRY_HINT : undefined}
        secondary={{
          label: "Open a blank canvas",
          to: "/write",
        }}
      />
    </div>
  );
}
