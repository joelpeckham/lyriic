import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

type ToolCtaProps = {
  label: string;
};

export function ToolCta({ label }: ToolCtaProps) {
  return (
    <p className="mt-10">
      <Button asChild size="lg">
        <Link to="/">{label}</Link>
      </Button>
    </p>
  );
}
