import { PopoverAnchor } from "@/components/ui/popover";
import type { WordAnchor as WordAnchorRect } from "@/lib/editor/resolveWordTarget";

/** Fixed viewport span for Popover positioning over a word glyph box. */
export function WordAnchor({ anchor }: { anchor: WordAnchorRect }) {
  return (
    <PopoverAnchor asChild>
      <span
        aria-hidden
        className="pointer-events-none fixed z-40"
        style={{
          left: anchor.left,
          top: anchor.top,
          width: Math.max(1, anchor.right - anchor.left),
          height: Math.max(1, anchor.bottom - anchor.top),
        }}
      />
    </PopoverAnchor>
  );
}
