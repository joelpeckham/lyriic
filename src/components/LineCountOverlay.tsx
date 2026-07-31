import type { MeterStatus } from "@/lib/meters/buildMeteredLine";
import { cn } from "@/lib/utils";

type LineCountOverlayProps = {
  total: number;
  target: number | null;
  status: MeterStatus;
  lineHasText: boolean;
  statusId: string;
};

function statusPhrase(status: MeterStatus, target: number | null): string {
  if (target === null) return "";
  if (status === "exact") return ", on meter";
  if (status === "over") return ", over target";
  if (status === "under") return ", under target";
  return "";
}

export function LineCountOverlay({
  total,
  target,
  status,
  lineHasText,
  statusId,
}: LineCountOverlayProps) {
  const label =
    target !== null
      ? `${total} of ${target} syllables${statusPhrase(status, target)}`
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
