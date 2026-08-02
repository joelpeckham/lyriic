import { useId } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

type ToolEditorPitchProps = {
  title: string;
  body: string;
  /** Label for the editor CTA — typically draft-aware from the parent. */
  cta: string;
  /** Editor destination — defaults to `/write`; use `/write/:slug` for seeded meters. */
  to?: string;
  /** Optional secondary text link (e.g. blank canvas). Never stashes. */
  secondary?: {
    label: string;
    to: string;
  };
  /**
   * Runs before primary CTA navigation only (e.g. stash tool draft).
   * Not wired to the secondary “blank canvas” link.
   */
  onPrimaryNavigate?: () => void;
  /** Optional muted line under the primary button (e.g. on-device carry hint). */
  carryHint?: string;
};

export function ToolEditorPitch({
  title,
  body,
  cta,
  to = "/write",
  secondary,
  onPrimaryNavigate,
  carryHint,
}: ToolEditorPitchProps) {
  const headingId = useId();

  return (
    <aside
      className="mt-10 border-t border-border/70 pt-8 font-[family-name:var(--font-ui)]"
      aria-labelledby={headingId}
    >
      <p
        id={headingId}
        className="font-[family-name:var(--font-brand)] text-xl tracking-tight text-foreground"
      >
        {title}
      </p>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
        {body}
      </p>
      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button asChild>
          <Link to={to} onClick={onPrimaryNavigate}>
            {cta}
          </Link>
        </Button>
        {secondary ? (
          <Link
            to={secondary.to}
            className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {secondary.label}
          </Link>
        ) : null}
      </p>
      {carryHint ? (
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          {carryHint}
        </p>
      ) : null}
    </aside>
  );
}
