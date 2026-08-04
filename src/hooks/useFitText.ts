import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

export type FitTextOptions = {
  /** Minimum font size in rem. */
  minRem?: number;
  /** Maximum font size in rem. */
  maxRem?: number;
  /** Root font size used to convert rem → px (defaults to 16). */
  rootPx?: number;
};

function letterSpacingForRem(
  fontRem: number,
  minRem: number,
  maxRem: number,
): string {
  const t = (fontRem - minRem) / Math.max(0.001, maxRem - minRem);
  return `${(-0.01 - 0.03 * t).toFixed(3)}em`;
}

/**
 * Scale a single-line text element to fill its container width.
 * Caller owns the element ref; returns fontSize / letterSpacing styles.
 */
export function useFitText(
  ref: RefObject<HTMLElement | null>,
  text: string,
  options: FitTextOptions = {},
): CSSProperties {
  const { minRem = 1.75, maxRem = 3.75, rootPx = 16 } = options;
  const [fontRem, setFontRem] = useState(maxRem);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const available = parent.clientWidth;
      if (available <= 0) return;

      const minPx = minRem * rootPx;
      const maxPx = maxRem * rootPx;

      // Start large; shrink until it fits (binary search).
      // Apply candidate letter-spacing during measure so tighter tracking
      // cannot leave a few px of overflow after state commits.
      let lo = minPx;
      let hi = maxPx;
      let best = minPx;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        const midRem = mid / rootPx;
        el.style.fontSize = `${mid}px`;
        el.style.letterSpacing = letterSpacingForRem(midRem, minRem, maxRem);
        if (el.scrollWidth <= available) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      // Final apply via state (rem) so React owns the style.
      const nextRem = Math.max(minRem, Math.min(maxRem, best / rootPx));
      setFontRem((prev) =>
        Math.abs(prev - nextRem) < 0.01 ? prev : nextRem,
      );
    };

    fit();
    const ro = new ResizeObserver(fit);
    const parent = el.parentElement;
    if (parent) ro.observe(parent);
    return () => ro.disconnect();
  }, [ref, text, minRem, maxRem, rootPx]);

  return {
    fontSize: `${fontRem}rem`,
    letterSpacing: letterSpacingForRem(fontRem, minRem, maxRem),
  };
}
