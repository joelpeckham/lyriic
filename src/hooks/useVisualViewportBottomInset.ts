import { useEffect, useState } from "react";

/**
 * Soft-keyboard / visual-viewport occlusion at the bottom of the layout
 * viewport (px). 0 when the visual viewport fills the window.
 */
export function useVisualViewportBottomInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const next = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setInset((prev) => (prev === next ? prev : next));
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return inset;
}

/** Treat as soft keyboard when the visual viewport shrinks meaningfully. */
export const SOFT_KEYBOARD_INSET_PX = 100;
