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
};

/**
 * Bridges imperative CM rhyme dots (`.lyriic-rhyme-dot[data-tooltip]`) to a
 * shadcn/Radix hover Tooltip. Dots stay in the overlay; this only owns chrome.
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

    const clearOpenTimer = () => {
      if (openTimer !== null) {
        window.clearTimeout(openTimer);
        openTimer = null;
      }
    };

    const close = () => {
      clearOpenTimer();
      setOpen(false);
      setHover(null);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const dot = target.closest(".lyriic-rhyme-dot");
      if (!(dot instanceof HTMLElement) || !root.contains(dot)) return;
      const related = event.relatedTarget;
      if (related instanceof Node && dot.contains(related)) return;

      const label = dot.dataset.tooltip;
      if (!label) return;

      const rect = dot.getBoundingClientRect();
      clearOpenTimer();
      setHover({
        label,
        left: rect.left,
        top: rect.top,
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      });
      openTimer = window.setTimeout(() => {
        openTimer = null;
        setOpen(true);
      }, OPEN_DELAY_MS);
    };

    const onPointerOut = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const dot = target.closest(".lyriic-rhyme-dot");
      if (!(dot instanceof HTMLElement) || !root.contains(dot)) return;
      const related = event.relatedTarget;
      if (related instanceof Node && dot.contains(related)) return;
      close();
    };

    root.addEventListener("pointerover", onPointerOver);
    root.addEventListener("pointerout", onPointerOut);
    // Capture scroll from the CM scroller (or any ancestor).
    root.addEventListener("scroll", close, true);

    return () => {
      clearOpenTimer();
      root.removeEventListener("pointerover", onPointerOver);
      root.removeEventListener("pointerout", onPointerOut);
      root.removeEventListener("scroll", close, true);
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
