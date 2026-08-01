import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const brandClass =
  "font-[family-name:var(--font-brand)] text-lg tracking-[0.18em] text-foreground/80 uppercase";

type AppHeaderProps = {
  /** Absolute overlay for the editor canvas; in-flow for content pages. */
  variant?: "overlay" | "flow";
  /** Home uses a heading; other pages link back to the editor. */
  brandAs?: "heading" | "link";
  actions?: ReactNode;
  className?: string;
};

export function AppHeader({
  variant = "flow",
  brandAs = "link",
  actions,
  className,
}: AppHeaderProps) {
  const brand =
    brandAs === "heading" ? (
      <h1 className={brandClass}>lyriic</h1>
    ) : (
      <Link
        to="/"
        className={cn(
          brandClass,
          "transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/80 focus-visible:outline-none",
        )}
      >
        lyriic
      </Link>
    );

  return (
    <header
      className={cn(
        "flex items-start justify-between gap-4 p-4",
        variant === "overlay" &&
          "pointer-events-none absolute inset-x-0 top-0 z-20",
        className,
      )}
    >
      {brand}
      {actions ? (
        <div className="pointer-events-auto flex shrink-0 items-center gap-1">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
