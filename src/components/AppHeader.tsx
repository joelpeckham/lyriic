import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const brandClass =
  "font-[family-name:var(--font-brand)] text-lg tracking-[0.18em] text-foreground/80";

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
          "transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none",
        )}
      >
        lyriic
      </Link>
    );

  return (
    <header
      data-slot="app-header"
      data-lyriic-header={variant}
      className={cn(
        "flex items-start justify-between gap-4",
        // Overlay: let clicks pass through empty chrome into verse; only the
        // brand and action controls capture hits (and own cursor:default).
        // Rest faded while writing; full opacity on hover / focus-within.
        // Higher contrast: no fade (Tailwind + data-slot hook for index.css).
        variant === "overlay" &&
          "pointer-events-none absolute inset-x-0 top-0 z-20 pt-[max(1rem,env(safe-area-inset-top,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pb-4 pl-[max(1rem,env(safe-area-inset-left,0px))] opacity-45 transition-opacity hover:opacity-100 focus-within:opacity-100 contrast-more:opacity-100 [html[data-contrast=more]_&]:opacity-100",
        variant === "flow" && "p-4",
        className,
      )}
    >
      <div
        className={
          variant === "overlay" ? "pointer-events-auto cursor-default" : undefined
        }
      >
        {brand}
      </div>
      {actions ? (
        <div
          className={cn(
            "flex min-w-0 items-center justify-end gap-1",
            variant === "overlay" && "pointer-events-auto cursor-default",
          )}
        >
          {actions}
        </div>
      ) : null}
    </header>
  );
}
