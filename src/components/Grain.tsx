import { useState } from "react";

import { GRAIN_TILE_PX, createGrainDataUrl } from "@/lib/grain";

/**
 * Full-document film grain: canvas noise tiled behind content so it scrolls
 * with the page instead of floating as a fixed viewport overlay.
 */
export function Grain() {
  const [url] = useState(createGrainDataUrl);

  if (!url) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-(--lyriic-grain-opacity)"
      style={{
        backgroundImage: `url(${url})`,
        backgroundRepeat: "repeat",
        backgroundSize: `${GRAIN_TILE_PX}px ${GRAIN_TILE_PX}px`,
      }}
    />
  );
}
