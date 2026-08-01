import { formatMeterLabel, type MeterStatus } from "@/lib/meters";
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
  const label = formatMeterLabel(total, target, status, lineHasText);

  return (
    <>
      <span id={statusId} className="sr-only select-none">
        {label}
      </span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 right-0 pt-1.5 select-none font-[family-name:var(--font-ui)] text-xs tabular-nums transition-colors",
          status === "exact" && "text-[var(--lyriic-match)]",
          status === "over" && "text-[var(--lyriic-over)]",
          status !== "exact" &&
            status !== "over" &&
            "text-[var(--lyriic-subtle)]",
        )}
      >
        {total > 0 || lineHasText ? total : ""}
        {target !== null && total > 0 ? (
          <span className="text-[var(--lyriic-subtle-faint)]">/{target}</span>
        ) : null}
      </span>
    </>
  );
}
