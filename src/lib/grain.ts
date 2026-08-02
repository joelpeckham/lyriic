/** Tile size for the repeating grain texture. */
export const GRAIN_TILE_PX = 256;

/**
 * Procedural grayscale noise as a PNG data URL for use as a repeating
 * background. Call from the browser only (needs canvas).
 */
export function createGrainDataUrl(size = GRAIN_TILE_PX): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imageData = ctx.createImageData(size, size);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}
