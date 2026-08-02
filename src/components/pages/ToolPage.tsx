import type { ReactNode } from "react";

import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import { MoreToolsNav } from "@/components/tools/MoreToolsNav";
import { ToolFaqList } from "@/components/tools/ToolFaqList";
import type { ToolPageContent } from "@/content/tools";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_URL } from "@/lib/seo";

type ToolPageProps = {
  tool: ToolPageContent;
  children: ReactNode;
};

export function ToolPage({ tool, children }: ToolPageProps) {
  useDocumentMeta({
    title: tool.title,
    description: tool.description,
    path: tool.path,
  });

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `lyriic ${tool.h1}`,
    url: `${SITE_URL}${tool.path}`,
    description: tool.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isPartOf: {
      "@type": "WebApplication",
      name: "lyriic",
      url: `${SITE_URL}/`,
    },
  };

  return (
    <ContentPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      <h1 className="font-[family-name:var(--font-brand)] text-3xl tracking-tight text-foreground sm:text-4xl">
        {tool.h1}
      </h1>
      <p className="mt-3 font-[family-name:var(--font-ui)] text-base text-muted-foreground">
        {tool.intro}
      </p>

      {children}

      <div className="mt-10 space-y-4 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
        {tool.body.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <ToolFaqList faqs={tool.faqs} path={tool.path} />

      <MoreToolsNav currentPath={tool.path} />
    </ContentPageLayout>
  );
}
