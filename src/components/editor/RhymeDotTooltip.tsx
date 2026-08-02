import { useEffect, useState, type RefObject } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const OPEN_DELAY_MS = 200;

type HoverState = {
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /** Stable id so tap can toggle the same dot. */
  dotKey: string;
};

function dotKeyFor(dot: HTMLElement): string {
  return `${dot.dataset.tooltip ?? ""}@${Math.round(dot.offsetTop)}:${Math.round(dot.offsetLeft)}`;
}

function rectState(dot: HTMLElement): HoverState {
  const rect = dot.getBoundingClientRect();
  return {
    label: dot.dataset.tooltip ?? "",
    left: rect.left,
    top: rect.top,
    width: Math.max(1, rect.width),
    height: Math.max(1, rect.height),
    dotKey: dotKeyFor(dot),
  };
}

/**
 * Bridges imperative CM rhyme dots (`.lyriic-rhyme-dot[data-tooltip]`) to a
 * shadcn/Radix Tooltip. Hover opens with delay; tap/click toggles.
 */
export function RhymeDotTooltip({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const [hover, setHover] = useState<HoverState | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let openTimer: number | null = null;
    /** When true, ignore pointerout dismiss (tap-pinned open). */
    let pinned = false;
    let pinnedKey = "";

    const clearOpenTimer = () => {
      if (openTimer !== null) {
        window.clearTimeout(openTimer);
        openTimer = null;
      }
    };

    const close = () => {
      clearOpenTimer();
      pinned = false;
      pinnedKey = "";
      setOpen(false);
      setHover(null);
    };

    const openFromDot = (dot: HTMLElement, immediate: boolean) => {
      const label = dot.dataset.tooltip;
      if (!label) return;
      const next = rectState(dot);
      clearOpenTimer();
      setHover(next);
      if (immediate) {
        setOpen(true);
        return;
      }
      openTimer = window.setTimeout(() => {
        openTimer = null;
        setOpen(true);
      }, OPEN_DELAY_MS);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const dot = target.closest(".lyriic-rhyme-dot");
      if (!(dot instanceof HTMLElement) || !root.contains(dot)) return;
      const related = event.relatedTarget;
      if (related instanceof Node && dot.contains(related)) return;
      if (!dot.dataset.tooltip) return;

      // Coarse pointers use tap toggle; skip hover-open (avoids sticky ghosts).
      if (event.pointerType === "touch") return;

      pinned = false;
      pinnedKey = "";
      openFromDot(dot, false);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (pinned) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const dot = target.closest(".lyriic-rhyme-dot");
      if (!(dot instanceof HTMLElement) || !root.contains(dot)) return;
      const related = event.relatedTarget;
      if (related instanceof Node && dot.contains(related)) return;
      close();
    };

    const onPointerUp = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const dot = target.closest(".lyriic-rhyme-dot");
      if (!(dot instanceof HTMLElement) || !root.contains(dot)) return;
      if (!dot.dataset.tooltip) return;

      // Mouse already gets hover; click still toggles for keyboard/trackpad users.
      const key = dotKeyFor(dot);
      if (pinned && pinnedKey === key) {
        close();
        return;
      }
      pinned = true;
      pinnedKey = key;
      openFromDot(dot, true);
    };

    const onPointerDownOutside = (event: PointerEvent) => {
      if (!pinned) return;
      const target = event.target;
      if (target instanceof Element && target.closest(".lyriic-rhyme-dot")) {
        return;
      }
      close();
    };

    root.addEventListener("pointerover", onPointerOver);
    root.addEventListener("pointerout", onPointerOut);
    root.addEventListener("pointerup", onPointerUp);
    // Capture scroll from the CM scroller (or any ancestor).
    root.addEventListener("scroll", close, true);
    document.addEventListener("pointerdown", onPointerDownOutside, true);

    return () => {
      clearOpenTimer();
      root.removeEventListener("pointerover", onPointerOver);
      root.removeEventListener("pointerout", onPointerOut);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("scroll", close, true);
      document.removeEventListener("pointerdown", onPointerDownOutside, true);
    };
  }, [containerRef]);

  if (!hover) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            setOpen(false);
            setHover(null);
          }
        }}
      >
        <TooltipTrigger asChild>
          <span
            aria-hidden
            className="pointer-events-none fixed z-40"
            style={{
              left: hover.left,
              top: hover.top,
              width: hover.width,
              height: hover.height,
            }}
          />
        </TooltipTrigger>
        <TooltipContent
          side="left"
          sideOffset={8}
          className="max-w-[16rem] text-left leading-relaxed"
        >
          {hover.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
