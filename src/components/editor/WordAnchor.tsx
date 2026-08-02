import { PopoverAnchor } from "@/components/ui/popover";
import {
  wordToolbarHitCorridors,
  type WordAnchor as WordAnchorRect,
  type WordHitRect,
} from "@/lib/editor/resolveWordTarget";

type WordAnchorProps = {
  anchor: WordAnchorRect;
  /**
   * When true, mount clickable corridor strips for leave detection.
   * Must be false while the popover is closed (closing retention still mounts
   * the glyph anchor) so the editor keeps receiving caret clicks.
   */
  showHitLayer?: boolean;
};

function HitStrip({ rect }: { rect: WordHitRect }) {
  return (
    <span
      aria-hidden
      data-word-hit=""
      className="fixed z-40"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        pointerEvents: "auto",
      }}
    />
  );
}

/**
 * Fixed viewport PopoverAnchor over the word glyph box, plus optional
 * open-state corridor strips (`data-word-hit`) so leave detection can use
 * real DOM without blocking caret clicks on the glyphs.
 */
export function WordAnchor({
  anchor,
  showHitLayer = false,
}: WordAnchorProps) {
  const corridors = showHitLayer ? wordToolbarHitCorridors(anchor) : null;

  return (
    <>
      {corridors ? (
        <>
          <HitStrip rect={corridors.above} />
          <HitStrip rect={corridors.below} />
        </>
      ) : null}
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
    </>
  );
}
