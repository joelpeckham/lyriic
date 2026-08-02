import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

type AppFooterProps = {
  /** Absolute overlay for the editor canvas; in-flow for content pages. */
  variant?: "overlay" | "flow";
  className?: string;
};

const linkClass =
  "cursor-pointer underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none";

export function AppFooter({
  variant = "flow",
  className,
}: AppFooterProps) {
  return (
    <footer
      className={cn(
        "font-[family-name:var(--font-ui)] text-xs text-muted-foreground",
        // Overlay: clicks pass through empty chrome into verse; only the nav
        // captures hits (and owns cursor:default over the link cluster).
        variant === "overlay" &&
          "pointer-events-none absolute inset-x-0 bottom-0 z-20 pt-3 pr-[max(1rem,env(safe-area-inset-right,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))]",
        variant === "flow" && "mt-auto px-4 py-6",
        className,
      )}
    >
      <nav
        aria-label="Site"
        className={cn(
          "mx-auto flex w-fit flex-wrap items-center justify-center gap-x-3 gap-y-1",
          variant === "overlay" &&
            "pointer-events-auto cursor-default opacity-55 transition-opacity hover:opacity-100 focus-within:opacity-100",
        )}
      >
        <Link to="/tools" className={linkClass}>
          Tools
        </Link>
        <span aria-hidden="true" className="text-foreground/25">
          ·
        </span>
        <Link to="/faq" className={linkClass}>
          FAQ
        </Link>
        <span aria-hidden="true" className="text-foreground/25">
          ·
        </span>
        <Link to="/privacy" className={linkClass}>
          Privacy
        </Link>
        {variant !== "overlay" ? (
          <>
            <span aria-hidden="true" className="text-foreground/25">
              ·
            </span>
            <span>
              Made by{" "}
              <a
                href="https://jpeckham.com"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                jpeckham.com
              </a>
            </span>
          </>
        ) : null}
      </nav>
    </footer>
  );
}
