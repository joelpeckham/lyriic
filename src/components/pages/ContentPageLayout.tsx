import type { ReactNode } from "react";

import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";

type ContentPageLayoutProps = {
  children: ReactNode;
};

export function ContentPageLayout({ children }: ContentPageLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col">
      <AppHeader variant="flow" brandAs="link" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-8">
        {children}
      </main>

      <AppFooter variant="flow" />
    </div>
  );
}
