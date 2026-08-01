import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { AppFooter } from "@/components/AppFooter";

type ContentPageLayoutProps = {
  children: ReactNode;
};

export function ContentPageLayout({ children }: ContentPageLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col">
      <header className="px-4 pt-4 pb-2 sm:px-8">
        <Link
          to="/"
          className="font-[family-name:var(--font-brand)] text-lg tracking-[0.18em] text-foreground/80 uppercase transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/80 focus-visible:outline-none"
        >
          lyriic
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-8">
        {children}
      </main>

      <AppFooter variant="flow" />
    </div>
  );
}
