import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import { ToolFaqList } from "@/components/tools/ToolFaqList";
import {
  listComposedFormToolsByGroup,
  type ComposedFormToolPage,
} from "@/content/formCheckers";
import type { Explainer } from "@/content/formCheckers/types";
import { TOOL_PAGES } from "@/content/tools";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_URL } from "@/lib/seo";

type FormToolPageProps = {
  page: ComposedFormToolPage;
  children: ReactNode;
};

function ExplainerSection({ explainer }: { explainer: Explainer }) {
  return (
    <section className="mt-10">
      <h2 className="font-[family-name:var(--font-brand)] text-xl tracking-tight text-foreground">
        {explainer.title}
      </h2>
      <div className="mt-3 space-y-3 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
        {explainer.body.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function FormToolPage({ page, children }: FormToolPageProps) {
  useDocumentMeta({
    title: page.title,
    description: page.description,
    path: page.path,
  });

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `lyriic ${page.h1}`,
    url: `${SITE_URL}${page.path}`,
    description: page.description,
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

  const groups = listComposedFormToolsByGroup();
  const utilityTools = TOOL_PAGES.filter(
    (tool) => !tool.slug.endsWith("-checker"),
  );

  return (
    <ContentPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      <h1 className="font-[family-name:var(--font-brand)] text-3xl tracking-tight text-foreground sm:text-4xl">
        {page.h1}
      </h1>
      <p className="mt-3 font-[family-name:var(--font-ui)] text-base text-muted-foreground">
        {page.intro}
      </p>

      {children}

      {page.history.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-brand)] text-xl tracking-tight text-foreground">
            A short history
          </h2>
          <div className="mt-3 space-y-3 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
            {page.history.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      {page.famousPoems.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-brand)] text-xl tracking-tight text-foreground">
            Famous poems
          </h2>
          <ul className="mt-3 space-y-4 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
            {page.famousPoems.map((poem) => (
              <li key={`${poem.title}-${poem.author ?? ""}`}>
                <p className="text-foreground">
                  <span className="font-medium">{poem.title}</span>
                  {poem.author ? (
                    <span className="text-muted-foreground">
                      {" "}
                      — {poem.author}
                    </span>
                  ) : null}
                </p>
                {poem.excerpt ? (
                  <p className="mt-1 whitespace-pre-line italic">
                    {poem.excerpt}
                  </p>
                ) : null}
                {poem.note ? <p className="mt-1 text-sm">{poem.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {page.meterExplainer ? (
        <ExplainerSection explainer={page.meterExplainer} />
      ) : null}
      {page.footExplainer ? (
        <ExplainerSection explainer={page.footExplainer} />
      ) : null}
      {page.stressExplainer ? (
        <ExplainerSection explainer={page.stressExplainer} />
      ) : null}

      {page.formNotes.length > 1 ? (
        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-brand)] text-xl tracking-tight text-foreground">
            Notes on this form
          </h2>
          <div className="mt-3 space-y-3 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
            {page.formNotes.slice(1).map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      <ToolFaqList faqs={page.faqs} path={page.path} />

      <nav
        aria-label="More tools"
        className="mt-12 font-[family-name:var(--font-ui)] text-sm text-muted-foreground"
      >
        <p className="font-medium text-foreground">More tools</p>
        {utilityTools.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {utilityTools.map((tool) => (
              <li key={tool.path}>
                <Link
                  to={tool.path}
                  className="underline-offset-2 hover:text-foreground hover:underline"
                >
                  {tool.h1}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        {groups.map((group) => (
          <div key={group.group} className="mt-5">
            <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {group.pages
                .filter((other) => other.path !== page.path)
                .map((other) => (
                  <li key={other.path}>
                    <Link
                      to={other.path}
                      className="underline-offset-2 hover:text-foreground hover:underline"
                    >
                      {other.h1}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>
    </ContentPageLayout>
  );
}
