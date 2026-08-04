import { Suspense, useEffect, useRef, useState } from "react";

import { PoemEditor } from "@/components/editor/PoemEditor";
import {
  CONTENT_PAD_BOTTOM_MARKS_EM,
  CONTENT_PAD_TOP_MARKS_EM,
  COUNT_GUTTER_REM,
  LINE_GAP_COMPACT_EM,
  LINE_GAP_EM,
  WRAP_LEADING,
} from "@/lib/editor/constants";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import type { EditorSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

const DefinitionSheet = lazyWithRetry(() =>
  import("@/components/DefinitionSheet").then((m) => ({
    default: m.DefinitionSheet,
  })),
);

/** About demos stay below editor prefs — a step under SettingsSheet S/M. */
const ABOUT_FONT_S = 1;
const ABOUT_FONT_M = 1.25;

/** Smaller on narrow screens; S from the Tailwind `sm` breakpoint up. */
function useAboutEmbedFontSize(): number {
  const [size, setSize] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 640px)").matches
      ? ABOUT_FONT_M
      : ABOUT_FONT_S,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setSize(mq.matches ? ABOUT_FONT_M : ABOUT_FONT_S);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return size;
}

type AboutPoemEditorProps = {
  text: string;
  settings: EditorSettings;
  /** Stable remount key for this demo instance. */
  documentKey: string;
  /** Accessible name for the verse block. */
  "aria-label"?: string;
  className?: string;
  /**
   * When true, mount the live editor as soon as the client hydrates
   * (hero). Otherwise wait until near the viewport.
   */
  eager?: boolean;
};

function StaticVerseFallback({
  text,
  marksActive,
  className,
}: {
  text: string;
  /** Match live embed padding / gap for the demo’s overlay settings. */
  marksActive: boolean;
  className?: string;
}) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  return (
    <div
      className={cn(
        "font-[family-name:var(--font-editor)] text-foreground",
        "text-[1.125rem] sm:text-[1.25rem]",
        className,
      )}
      style={{
        lineHeight: WRAP_LEADING,
        // Match embed PoemEditor content pad so first paint doesn’t jump.
        paddingTop: marksActive ? `${CONTENT_PAD_TOP_MARKS_EM}em` : "0.35em",
        paddingBottom: marksActive
          ? `${CONTENT_PAD_BOTTOM_MARKS_EM}em`
          : "0.5em",
      }}
      aria-hidden="true"
    >
      {lines.map((line, index) => (
        <p
          key={`${index}-${line}`}
          className="m-0"
          style={{
            paddingRight: `${COUNT_GUTTER_REM + 0.5}em`,
            paddingBottom:
              index < lines.length - 1
                ? marksActive
                  ? `${LINE_GAP_EM}em`
                  : `${LINE_GAP_COMPACT_EM}em`
                : undefined,
          }}
        >
          {line.length > 0 ? line : "\u00a0"}
        </p>
      ))}
    </div>
  );
}

/**
 * About-page poem surface: static verse for SSR / first paint, then a real
 * compact PoemEditor once the block is near the viewport (or immediately when
 * `eager` on the client).
 */
export function AboutPoemEditor({
  text: initialText,
  settings,
  documentKey,
  "aria-label": ariaLabel,
  className,
  eager = false,
}: AboutPoemEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const fontSizeRem = useAboutEmbedFontSize();
  const marksActive =
    settings.showRulers || settings.showStress || settings.showMeterBreaks;
  const [text, setText] = useState(initialText);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [stressOverrides, setStressOverrides] = useState<
    Record<string, number>
  >({});
  const [definitionOpen, setDefinitionOpen] = useState(false);
  const [definitionWord, setDefinitionWord] = useState<string | null>(null);
  const [definitionMounted, setDefinitionMounted] = useState(false);
  // Client-only: document is undefined during prerender, so SSR stays static.
  const [live, setLive] = useState(
    () => eager && typeof document !== "undefined",
  );

  function openDefinition(word: string): void {
    setDefinitionMounted(true);
    setDefinitionWord(word.trim() || null);
    setDefinitionOpen(true);
  }

  useEffect(() => {
    if (live) return;

    const el = hostRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.01 },
    );
    observer.observe(el);

    // Already-in-view check via rAF so we don't setState sync in the effect body.
    const raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.15 && rect.bottom > -80) {
        setLive(true);
        observer.disconnect();
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [live]);

  return (
    <div
      ref={hostRef}
      role="group"
      aria-label={ariaLabel}
      className={cn("relative w-full", className)}
    >
      {live ? (
        <PoemEditor
          key={documentKey}
          documentKey={documentKey}
          value={text}
          onChange={setText}
          settings={settings}
          overrides={overrides}
          onSetOverride={(word, count) => {
            setOverrides((prev) => ({ ...prev, [word]: count }));
          }}
          onClearOverride={(word) => {
            setOverrides((prev) => {
              if (!(word in prev)) return prev;
              const next = { ...prev };
              delete next[word];
              return next;
            });
          }}
          stressOverrides={stressOverrides}
          onSetStressOverride={(word, primaryIndex) => {
            setStressOverrides((prev) => ({ ...prev, [word]: primaryIndex }));
          }}
          onClearStressOverride={(word) => {
            setStressOverrides((prev) => {
              if (!(word in prev)) return prev;
              const next = { ...prev };
              delete next[word];
              return next;
            });
          }}
          variant="embed"
          autoFocus={false}
          fontSizeRem={fontSizeRem}
          onOpenDefinition={openDefinition}
        />
      ) : (
        <StaticVerseFallback text={text} marksActive={marksActive} />
      )}
      {definitionMounted ? (
        <Suspense fallback={null}>
          <DefinitionSheet
            open={definitionOpen}
            onOpenChange={(open) => {
              setDefinitionOpen(open);
              if (!open) setDefinitionWord(null);
            }}
            initialWord={definitionWord}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
