import { Link } from "react-router-dom";

import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import { HaikuCheckerTool } from "@/components/tools/HaikuCheckerTool";
import { ToolFaqList } from "@/components/tools/ToolFaqList";
import { getToolBySlug, TOOL_PAGES } from "@/content/tools";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_URL } from "@/lib/seo";

const tool = getToolBySlug("haiku-checker")!;

export function HaikuCheckerPage() {
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

      <HaikuCheckerTool />

      <div className="mt-10 space-y-4 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
        {tool.body.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <ToolFaqList faqs={tool.faqs} path={tool.path} />

      <nav
        aria-label="More tools"
        className="mt-12 font-[family-name:var(--font-ui)] text-sm text-muted-foreground"
      >
        <p className="font-medium text-foreground">More tools</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {TOOL_PAGES.filter((page) => page.path !== tool.path).map((page) => (
            <li key={page.path}>
              <Link
                to={page.path}
                className="underline-offset-2 hover:text-foreground hover:underline"
              >
                {page.h1}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </ContentPageLayout>
  );
}
