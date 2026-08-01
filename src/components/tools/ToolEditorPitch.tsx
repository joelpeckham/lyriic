import { useId } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

type ToolEditorPitchProps = {
  title: string;
  body: string;
  /** Label for the editor CTA — typically `tool.cta`. */
  cta: string;
  /** Editor destination — defaults to home; use `/write/:slug` for seeded meters. */
  to?: string;
};

export function ToolEditorPitch({
  title,
  body,
  cta,
  to = "/",
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
      <p className="mt-4">
        <Button asChild>
          <Link to={to}>{cta}</Link>
        </Button>
      </p>
    </aside>
  );
}
