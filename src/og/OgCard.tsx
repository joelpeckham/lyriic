import { PoemLines, type PoemLine } from "@/components/editor/PoemLines";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      {/* Local grain so the card screenshots cleanly without page ::before */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[var(--lyriic-grain-opacity)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
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
