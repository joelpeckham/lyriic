import { useEffect, useRef, useState } from "react";

import { PoemEditor } from "@/components/editor/PoemEditor";
import {
  COUNT_GUTTER_REM,
  LINE_GAP_REM,
  WRAP_LEADING,
} from "@/lib/editor/constants";
import type { EditorSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

/** Match SettingsSheet FONT_SIZE_OPTIONS — about demos ignore prefs. */
const ABOUT_FONT_S = 1.25;
const ABOUT_FONT_M = 1.5;

/** S by default; M from the Tailwind `sm` breakpoint up — never L/XL. */
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
  className,
}: {
  text: string;
  className?: string;
}) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  return (
    <div
      className={cn(
        "font-[family-name:var(--font-editor)] text-foreground",
        "text-[1.25rem] sm:text-[1.5rem]",
        className,
      )}
      style={{ lineHeight: WRAP_LEADING }}
      aria-hidden="true"
    >
      {lines.map((line, index) => (
        <p
          key={`${index}-${line}`}
          className="m-0"
          style={{
            paddingRight: `${COUNT_GUTTER_REM + 0.5}rem`,
            paddingBottom:
              index < lines.length - 1 ? `${LINE_GAP_REM}rem` : undefined,
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
  const [text, setText] = useState(initialText);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [stressOverrides, setStressOverrides] = useState<
    Record<string, number>
  >({});
  // Client-only: document is undefined during prerender, so SSR stays static.
  const [live, setLive] = useState(
    () => eager && typeof document !== "undefined",
  );

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
        />
      ) : (
        <StaticVerseFallback text={text} />
      )}
    </div>
  );
}
