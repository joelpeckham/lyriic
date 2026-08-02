import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { RhymeDotTooltip } from "@/components/editor/RhymeDotTooltip";
import { useSyllableLineCounts } from "@/components/editor/useSyllableLineCounts";
import {
  WordToolsPopover,
  type WordToolsTarget,
} from "@/components/editor/WordToolsPopover";
import { useDictRevision } from "@/hooks/useDictRevision";
import { usePrefs } from "@/hooks/usePrefs";
import { useRhymeRevision } from "@/hooks/useRhymeRevision";
import { useStressRevision } from "@/hooks/useStressRevision";
import { useVariantsRevision } from "@/hooks/useVariantsRevision";
import { isStressReady, loadStress } from "@/lib/data/stress";
import { isVariantsReady, loadVariants } from "@/lib/data/variants";
import {
  createPoemExtensions,
  externalValueSync,
} from "@/lib/editor/createPoemExtensions";
import { resolveWordTarget } from "@/lib/editor/resolveWordTarget";
import {
  getSyllableOverlay,
  setMeterOverlayData,
} from "@/lib/editor/syllableOverlay";
import {
  dismissWordToolbar,
  replaceWordRange,
  setWordToolbarSticky,
  type WordLookupRequest,
  type WordTarget,
} from "@/lib/editor/wordInteraction";
import {
  zenEditorTheme,
  type ZenThemeVariant,
} from "@/lib/editor/zenTheme";
import {
  buildMeteredLines,
  formatMeterLabel,
  isStressAwareMeterConfig,
  resolveMeterConfig,
  resolveRhymeScheme,
  type MeteredLine,
} from "@/lib/meters";
import {
  analyzeRhymeScheme,
  isRhymeQueryReady,
  loadRhymeQuery,
} from "@/lib/rhyme";
import type { EditorSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";

type PoemEditorProps = {
  value: string;
  onChange: (value: string) => void;
  settings: EditorSettings;
  /** Active project overrides — threaded into counting + cache invalidation. */
  overrides: Record<string, number>;
  onSetOverride: (word: string, count: number) => void;
  onClearOverride: (word: string) => void;
  stressOverrides: Record<string, number>;
  onSetStressOverride: (word: string, primaryIndex: number) => void;
  onClearStressOverride: (word: string) => void;
  /** Stable document identity (e.g. project id) for full remount. */
  documentKey: string;
  /** Open the dictionary sheet for a word (from thesaurus/rhyme rows). */
  onOpenDefinition?: (word: string) => void;
  /** Parent reads caret/toolbar word when opening the dictionary from chrome. */
  activeWordGetterRef?: MutableRefObject<() => string | null>;
  /** `zen` full canvas (default) vs compact about-page embed. */
  variant?: ZenThemeVariant;
  /** Focus the CM view on mount. Default true for zen; about embeds pass false. */
  autoFocus?: boolean;
  /**
   * Override prefs font size for this instance (rem). About embeds pass a
   * fixed S/M so demos ignore the user’s editor size preference.
   */
  fontSizeRem?: number;
  className?: string;
};

const LIVE_COUNT_DEBOUNCE_MS = 500;

function overridesKey(overrides: Record<string, number>): string {
  return Object.keys(overrides)
    .sort()
    .map((key) => `${key}:${overrides[key]}`)
    .join("|");
}

function tokenSyllablesFor(
  metered: readonly MeteredLine[],
  target: Pick<WordTarget, "lineIndex" | "from" | "lineFrom">,
): number {
  const line = metered[target.lineIndex];
  const localStart = target.from - target.lineFrom;
  return line?.tokens.find((t) => t.start === localStart)?.syllables ?? 0;
}

export function PoemEditor({
  value,
  onChange,
  settings,
  overrides,
  onSetOverride,
  onClearOverride,
  stressOverrides,
  onSetStressOverride,
  onClearStressOverride,
  documentKey,
  onOpenDefinition,
  activeWordGetterRef,
  variant = "zen",
  autoFocus = true,
  fontSizeRem,
  className,
}: PoemEditorProps) {
  const { prefs } = usePrefs();
  const resolvedFontSize = fontSizeRem ?? prefs.fontSize;
  const parentRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const variantRef = useRef(variant);
  const autoFocusRef = useRef(autoFocus);
  const fontSizeRef = useRef(resolvedFontSize);
  const meteredLinesRef = useRef<readonly MeteredLine[]>([]);
  /** Single mutable bridge for CM → React word UI. */
  const wordBridgeRef = useRef({
    setToolbar: (_target: WordTarget | null) => {},
    openLookup: (_request: WordLookupRequest) => {},
  });
  /** Live CM document — counts stay in sync even when parent text is debounced. */
  const [liveText, setLiveText] = useState(value);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [liveCountText, setLiveCountText] = useState("");
  const [wordTarget, setWordTarget] = useState<WordToolsTarget | null>(null);
  const wordTargetRef = useRef<WordToolsTarget | null>(null);

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useLayoutEffect(() => {
    variantRef.current = variant;
    autoFocusRef.current = autoFocus;
    fontSizeRef.current = resolvedFontSize;
  }, [variant, autoFocus, resolvedFontSize]);

  useLayoutEffect(() => {
    wordTargetRef.current = wordTarget;
  }, [wordTarget]);

  useLayoutEffect(() => {
    wordBridgeRef.current.setToolbar = (target) => {
      setWordTarget(target);
    };
    wordBridgeRef.current.openLookup = (request) => {
      setWordTarget({
        ...request,
        tokenSyllables: tokenSyllablesFor(meteredLinesRef.current, request),
      });
    };
  });

  useLayoutEffect(() => {
    if (!activeWordGetterRef) return;
    activeWordGetterRef.current = () => {
      const view = viewRef.current;
      if (view) {
        const atCaret = resolveWordTarget(view);
        if (atCaret?.word) return atCaret.word;
      }
      return wordTargetRef.current?.word ?? null;
    };
  }, [activeWordGetterRef]);

  const overrideRevision = useMemo(
    () => overridesKey(overrides),
    [overrides],
  );
  const stressOverrideRevision = useMemo(
    () => overridesKey(stressOverrides),
    [stressOverrides],
  );
  const dictRevision = useDictRevision();
  const stressPackRevision = useStressRevision();
  const variantsPackRevision = useVariantsRevision();
  const rhymePackRevision = useRhymeRevision();

  const meterConfig = useMemo(
    () =>
      resolveMeterConfig({
        meter: settings.meter,
        customPattern: settings.customPattern,
        customFoot: settings.customFoot,
        customRhymePattern: settings.customRhymePattern,
      }),
    [
      settings.meter,
      settings.customPattern,
      settings.customFoot,
      settings.customRhymePattern,
    ],
  );

  const activeRhymeScheme = useMemo(
    () =>
      resolveRhymeScheme(
        settings.meter,
        settings.rhymeSchemeId,
        settings.customRhymePattern,
      ),
    [settings.meter, settings.rhymeSchemeId, settings.customRhymePattern],
  );

  const needsStress =
    settings.showStress || isStressAwareMeterConfig(meterConfig);
  const hasMeterTarget = meterConfig.pattern.length > 0;
  const needsRhyme =
    settings.showRhymeScheme && activeRhymeScheme !== null;
  // Meter-break marks paint stress glyphs too — same vertical budget.
  const compactLineGap =
    !settings.showRulers && !settings.showStress && !settings.showMeterBreaks;

  // Retry failed pack loads; createLazyBinData clears its promise on error.
  useEffect(() => {
    if (!needsStress || isStressReady()) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const attempt = () => {
      void loadStress().catch(() => {
        if (cancelled) return;
        timer = setTimeout(attempt, 3000);
      });
    };
    attempt();
    return () => {
      cancelled = true;
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [needsStress, stressPackRevision]);

  useEffect(() => {
    if (!hasMeterTarget || isVariantsReady()) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const attempt = () => {
      void loadVariants().catch(() => {
        if (cancelled) return;
        timer = setTimeout(attempt, 3000);
      });
    };
    attempt();
    return () => {
      cancelled = true;
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [hasMeterTarget, variantsPackRevision]);

  useEffect(() => {
    // Scheme overlay needs perfect + end + slant (solid / ring / dashed).
    const schemeOpts = { includeEnd: true, includeSlant: true };
    if (!needsRhyme || isRhymeQueryReady(schemeOpts)) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const attempt = () => {
      void loadRhymeQuery(schemeOpts).catch(() => {
        if (cancelled) return;
        timer = setTimeout(attempt, 3000);
      });
    };
    attempt();
    return () => {
      cancelled = true;
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [needsRhyme, rhymePackRevision]);

  const lineCounts = useSyllableLineCounts(
    liveText,
    documentKey,
    overrideRevision,
    overrides,
    dictRevision,
  );

  const meterOptions = useMemo(
    () => ({
      pattern: meterConfig.pattern,
      stressPatterns: meterConfig.stressPatterns,
      stressOverrides,
      syllableOverrides: overrides,
    }),
    [meterConfig, stressOverrides, overrides],
  );

  const stressRevision = `${stressOverrideRevision}|${stressPackRevision}|${variantsPackRevision}|${dictRevision}`;

  const meteredLines = useMemo(
    () => buildMeteredLines(lineCounts.counts, meterOptions, stressRevision),
    [lineCounts.counts, meterOptions, stressRevision],
  );
  useLayoutEffect(() => {
    meteredLinesRef.current = meteredLines;
  }, [meteredLines]);

  const rhymeLines = useMemo(() => {
    if (!needsRhyme || !activeRhymeScheme) return [];
    // rhymePackRevision keeps analysis in sync after the pack loads.
    void rhymePackRevision;
    return analyzeRhymeScheme(lineCounts.lines, activeRhymeScheme.pattern);
  }, [
    needsRhyme,
    activeRhymeScheme,
    lineCounts.lines,
    rhymePackRevision,
  ]);

  // Create / destroy the editor once per mount (parent remounts on documentKey).
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const themeComp = themeCompartment.current;
    const state = EditorState.create({
      doc: value,
      extensions: [
        themeComp.of(
          zenEditorTheme(fontSizeRef.current, {
            compactLineGap,
            variant: variantRef.current,
          }),
        ),
        ...createPoemExtensions({
          onDocChange: (text, { userEdit }) => {
            setLiveText(text);
            setWordTarget(null);
            if (userEdit) onChangeRef.current(text);
          },
          onActiveLineChange: setActiveLineIndex,
          onWordInteraction: {
            onToolbarChange: (target) => {
              wordBridgeRef.current.setToolbar(target);
            },
            onOpenLookup: (request) => {
              wordBridgeRef.current.openLookup(request);
            },
          },
        }),
      ],
    });

    const view = new EditorView({ state, parent });
    viewRef.current = view;
    if (autoFocusRef.current) view.focus();

    // Literata loads with font-display:swap — remasure so the drawn caret
    // tracks the real glyph box after the fallback → webfont swap.
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) view.requestMeasure();
    });

    return () => {
      cancelled = true;
      view.destroy();
      viewRef.current = null;
    };
    // Mount once per documentKey (parent remounts). Value/theme sync separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only
  }, []);

  // Sync external document changes (project switch uses remount; this covers
  // rare external sets without remounting).
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current === value) {
      setLiveText((prev) => (prev === value ? prev : value));
      return;
    }
    view.dispatch({
      changes: { from: 0, to: current.length, insert: value },
      annotations: externalValueSync.of(true),
    });
    setLiveText(value);
  }, [value]);

  // Font size / line-gap / variant → theme compartment.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: themeCompartment.current.reconfigure(
        zenEditorTheme(resolvedFontSize, { compactLineGap, variant }),
      ),
    });
  }, [resolvedFontSize, compactLineGap, variant]);

  // Push meter overlay data into the editor plugin.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    setMeterOverlayData(view, {
      showCounts: settings.showCounts,
      showRulers: settings.showRulers,
      showStress: settings.showStress,
      showMeterBreaks: settings.showMeterBreaks,
      showRhymeScheme: needsRhyme,
      rhymeLines,
      lines: meteredLines,
      textLines: lineCounts.lines,
    });
    getSyllableOverlay(view)?.redraw(view);
  }, [
    meteredLines,
    lineCounts.lines,
    rhymeLines,
    needsRhyme,
    settings.showCounts,
    settings.showRulers,
    settings.showStress,
    settings.showMeterBreaks,
  ]);

  const safeActiveLineIndex = Math.min(
    activeLineIndex,
    Math.max(0, lineCounts.lines.length - 1),
  );

  // Debounced polite announcement when any meter overlay is on.
  const anyMeterOverlay =
    settings.showCounts ||
    settings.showRulers ||
    settings.showStress ||
    settings.showMeterBreaks ||
    needsRhyme;

  useEffect(() => {
    if (!anyMeterOverlay) return;
    const metered = meteredLines[safeActiveLineIndex];
    if (!metered) return;
    const line = lineCounts.lines[safeActiveLineIndex] ?? "";
    const next = formatMeterLabel(
      metered.total,
      metered.target,
      metered.status,
      line.length > 0,
    );
    const timer = window.setTimeout(() => {
      setLiveCountText(next);
    }, LIVE_COUNT_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [
    safeActiveLineIndex,
    meteredLines,
    lineCounts.lines,
    anyMeterOverlay,
  ]);

  function closeWordUi(): void {
    const view = viewRef.current;
    if (view) dismissWordToolbar(view);
    setWordTarget(null);
  }

  const embed = variant === "embed";

  return (
    <div
      id={embed ? undefined : "poem"}
      tabIndex={-1}
      className={cn(
        "relative mx-auto flex w-full max-w-none outline-none focus-visible:outline-none",
        embed
          ? "h-auto min-h-0 flex-none flex-col"
          : "h-full min-h-0 flex-1 flex-col",
        className,
      )}
      onFocus={(event) => {
        // Skip link focuses #poem; move into the single CM textbox tab stop.
        if (event.target === event.currentTarget) {
          viewRef.current?.focus();
        }
      }}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {anyMeterOverlay ? liveCountText : ""}
      </div>
      <div
        ref={parentRef}
        className={cn("w-full", embed ? "min-h-0" : "min-h-0 flex-1")}
      />
      <RhymeDotTooltip containerRef={parentRef} />
      <WordToolsPopover
        target={wordTarget}
        onClose={closeWordUi}
        onStickyChange={(sticky) => {
          const view = viewRef.current;
          if (view) setWordToolbarSticky(view, sticky);
        }}
        onOpenLookup={(mode) => {
          if (!wordTarget) return;
          setWordTarget({
            ...wordTarget,
            mode,
            tokenSyllables: tokenSyllablesFor(meteredLines, wordTarget),
          });
        }}
        onOpenDefinition={
          onOpenDefinition
            ? (word) => {
                closeWordUi();
                onOpenDefinition(word);
              }
            : undefined
        }
        onReplace={(from, to, insert) => {
          const view = viewRef.current;
          if (!view) return;
          replaceWordRange(view, from, to, insert);
        }}
        onRestoreFocus={() => {
          viewRef.current?.focus();
        }}
        onSetOverride={onSetOverride}
        onClearOverride={onClearOverride}
        onSetStressOverride={onSetStressOverride}
        onClearStressOverride={onClearStressOverride}
        meteredLine={
          wordTarget ? meteredLines[wordTarget.lineIndex] : undefined
        }
        overrides={overrides}
        overrideRevision={overrideRevision}
        stressOverrides={stressOverrides}
        stressOverrideRevision={stressOverrideRevision}
      />
    </div>
  );
}
