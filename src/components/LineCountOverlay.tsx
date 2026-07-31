import type { MeterStatus } from "@/lib/meters/buildMeteredLine";
import { cn } from "@/lib/utils";

type LineCountOverlayProps = {
  total: number;
  target: number | null;
  status: MeterStatus;
  lineHasText: boolean;
  statusId: string;
};

export function LineCountOverlay({
  total,
  target,
  status,
  lineHasText,
  statusId,
}: LineCountOverlayProps) {
  const label =
    target !== null
      ? `${total} of ${target} syllables`
      : `${total} syllables`;

  return (
    <>
      <span id={statusId} className="sr-only">
        {lineHasText || total > 0 ? label : "Empty line"}
      </span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 right-0 pt-1.5 font-[family-name:var(--font-ui)] text-xs tabular-nums transition-colors",
          status === "exact" && "text-[var(--lyriic-match)]",
          status === "over" && "text-[var(--lyriic-over)]",
          status !== "exact" &&
            status !== "over" &&
            "text-muted-foreground/55",
        )}
      >
        {total > 0 || lineHasText ? total : ""}
        {target !== null && total > 0 ? (
          <span className="text-muted-foreground/35">/{target}</span>
        ) : null}
      </span>
    </>
  );
}
