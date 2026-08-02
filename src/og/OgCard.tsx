import { PoemLines, type PoemLine } from "@/components/editor/PoemLines";
import { Button } from "@/components/ui/button";
import { GRAIN_TILE_PX, createGrainDataUrl } from "@/lib/grain";
import { cn } from "@/lib/utils";

const ogGrainUrl =
  typeof document !== "undefined" ? createGrainDataUrl() : "";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export type OgCardProps = {
  id: string;
  lines: readonly PoemLine[];
  cta: string;
};

/**
 * Fixed 1200×630 Open Graph composition: quiet poem hero with stress +
 * syllable overlays, CTA button, minimal brand lockup.
 */
export function OgCard({ id, lines, cta }: OgCardProps) {
  return (
    <div
      data-og-id={id}
      className={cn(
        "relative isolate overflow-hidden text-foreground",
        "bg-[linear-gradient(165deg,var(--lyriic-wash-c),var(--background)_45%,var(--lyriic-wash-a))]",
      )}
      style={{ width: OG_WIDTH, height: OG_HEIGHT }}
    >
      {/* Local grain so the card screenshots cleanly without the page Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[var(--lyriic-grain-opacity)]"
        style={{
          backgroundImage: ogGrainUrl ? `url(${ogGrainUrl})` : undefined,
          backgroundRepeat: "repeat",
          backgroundSize: `${GRAIN_TILE_PX}px ${GRAIN_TILE_PX}px`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col px-16 py-12">
        <header className="flex items-baseline justify-between gap-6">
          <p className="font-[family-name:var(--font-brand)] text-lg tracking-[0.18em] text-foreground/55">
            lyriic
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col justify-center py-4">
          <PoemLines
            lines={lines}
            fontSizeRem={2.35}
            showStress
            showRulers
            className="w-fit max-w-[56rem]"
          />
        </div>

        <footer className="flex justify-end">
          <Button
            type="button"
            size="lg"
            tabIndex={-1}
            className="pointer-events-none h-11 px-5 text-base"
          >
            {cta}
          </Button>
        </footer>
      </div>
    </div>
  );
}
