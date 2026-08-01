import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useEffectEvent,
} from "react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

export type RhymeSyllableGroup = {
  syllables: number;
  words: string[];
};

type FlatItem =
  | { kind: "header"; syllables: number; count: number; key: string }
  | { kind: "word"; word: string; key: string };

type RhymeWordBankProps = {
  groups: RhymeSyllableGroup[];
  query: string;
  totalShown: number;
};

const ROW_HEIGHT = 36;
const OVERSCAN = 12;

export function RhymeWordBank({
  groups,
  query,
  totalShown,
}: RhymeWordBankProps) {
  const listId = useId();
  const [copied, setCopied] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(480);
  const [cols, setCols] = useState(4);

  const flat = useMemo(() => flattenGroups(groups), [groups]);
  const layout = useMemo(
    () => layoutFlatItems(flat, cols),
    [flat, cols],
  );

  const onResize = useEffectEvent(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setViewportHeight(el.clientHeight);
    const width = el.clientWidth;
    setCols(Math.max(2, Math.min(8, Math.floor(width / 110))));
  });

  useEffect(() => {
    onResize();
    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => onResize());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const startRow = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN,
  );
  const endRow = Math.min(
    layout.rowCount,
    Math.ceil((scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN,
  );

  const visible = layout.rows.slice(startRow, endRow);

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
        ref={scrollerRef}
        id={listId}
        aria-label={`Rhymes for ${query}, grouped by syllable count`}
        className="relative max-h-[min(70vh,36rem)] overflow-y-auto"
        onScroll={(event) => {
          setScrollTop(event.currentTarget.scrollTop);
        }}
      >
        <div
          className="relative w-full"
          style={{ height: layout.rowCount * ROW_HEIGHT }}
        >
          {visible.map((row, i) => {
            const rowIndex = startRow + i;
            return (
              <div
                key={row.key}
                className="absolute right-0 left-0"
                style={{
                  top: rowIndex * ROW_HEIGHT,
                  height: ROW_HEIGHT,
                }}
              >
                {row.kind === "header" ? (
                  <h3
                    id={`${listId}-s${row.syllables}`}
                    className="flex h-full items-baseline gap-2 border-b border-border/50 font-[family-name:var(--font-brand)] text-sm tracking-wide text-[var(--lyriic-subtle)]"
                  >
                    <span>
                      {row.syllables} syllable
                      {row.syllables === 1 ? "" : "s"}
                    </span>
                    <span className="font-[family-name:var(--font-ui)] font-normal text-muted-foreground tabular-nums">
                      {row.count}
                    </span>
                  </h3>
                ) : (
                  <div
                    className="grid h-full gap-x-0.5"
                    style={{
                      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    }}
                  >
                    {row.words.map((word) => {
                      const isCopied = copied === word;
                      return (
                        <button
                          key={word}
                          type="button"
                          onClick={() => copyWord(word)}
                          className={cn(
                            "truncate rounded-md px-2 py-1 text-left font-[family-name:var(--font-editor)] text-[0.95rem] leading-snug text-foreground sm:text-base",
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function flattenGroups(groups: RhymeSyllableGroup[]): FlatItem[] {
  const items: FlatItem[] = [];
  for (const group of groups) {
    items.push({
      kind: "header",
      syllables: group.syllables,
      count: group.words.length,
      key: `h-${group.syllables}`,
    });
    for (const word of group.words) {
      items.push({ kind: "word", word, key: `w-${group.syllables}-${word}` });
    }
  }
  return items;
}

type LayoutRow =
  | { kind: "header"; syllables: number; count: number; key: string }
  | { kind: "words"; words: string[]; key: string };

function layoutFlatItems(
  flat: FlatItem[],
  cols: number,
): { rows: LayoutRow[]; rowCount: number } {
  const rows: LayoutRow[] = [];
  let wordBuf: string[] = [];
  let wordRow = 0;

  function flushWords() {
    if (wordBuf.length === 0) return;
    rows.push({
      kind: "words",
      words: wordBuf,
      key: `r-${rows.length}-${wordRow}`,
    });
    wordBuf = [];
    wordRow += 1;
  }

  for (const item of flat) {
    if (item.kind === "header") {
      flushWords();
      rows.push({
        kind: "header",
        syllables: item.syllables,
        count: item.count,
        key: item.key,
      });
      continue;
    }
    wordBuf.push(item.word);
    if (wordBuf.length >= cols) flushWords();
  }
  flushWords();
  return { rows, rowCount: rows.length };
}
