import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { AboutPoemEditor } from "@/components/pages/AboutPoemEditor";
import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import { ToolFaqList } from "@/components/tools/ToolFaqList";
import type { ComposedPoemPage } from "@/content/poems";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_URL } from "@/lib/seo";

type PoemPageProps = {
  page: ComposedPoemPage;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-[family-name:var(--font-brand)] text-xl tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-3 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function PoemPage({ page }: PoemPageProps) {
  useDocumentMeta({
    title: page.title,
    description: page.description,
    path: page.path,
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    url: `${SITE_URL}${page.path}`,
    about: {
      "@type": "CreativeWork",
      name: page.poemTitle,
      author: {
        "@type": "Person",
        name: page.author,
      },
      datePublished: String(page.yearPublished),
    },
    isPartOf: {
      "@type": "WebSite",
      name: "lyriic",
      url: `${SITE_URL}/`,
    },
  };

  return (
    <ContentPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <p className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
        <Link
          to="/poems"
          className="underline-offset-2 hover:text-foreground hover:underline"
        >
          Poem analyses
        </Link>
        <span aria-hidden="true"> · </span>
        <span>{page.author}</span>
      </p>

      <h1 className="mt-3 font-[family-name:var(--font-brand)] text-3xl tracking-tight text-foreground sm:text-4xl">
        {page.h1}
      </h1>
      <p className="mt-2 font-[family-name:var(--font-ui)] text-base text-muted-foreground">
        {page.poemTitle}
        <span aria-hidden="true"> — </span>
        {page.author}
        {page.yearPublished ? (
          <>
            <span aria-hidden="true"> · </span>
            {page.yearPublished}
          </>
        ) : null}
      </p>
      <p className="mt-3 font-[family-name:var(--font-ui)] text-base text-muted-foreground">
        {page.intro}
      </p>

      <div className="mt-8 rounded-lg border border-border/60 bg-card/40 px-3 py-4 sm:px-5 sm:py-5">
        <AboutPoemEditor
          text={page.text}
          settings={page.editorSettings}
          documentKey={`poem-${page.slug}`}
          aria-label={`${page.poemTitle} by ${page.author}`}
          eager
          readOnly
        />
      </div>
      <p className="mt-2 font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
        {page.isExcerpt && page.excerptNote ? (
          <>
            {page.excerptNote}{" "}
            <a
              href={page.fullTextSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              {page.fullTextSource.label}
            </a>
          </>
        ) : (
          <>
            Text from{" "}
            <a
              href={page.fullTextSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              {page.fullTextSource.label}
            </a>
            . Public domain in the US ({page.publicDomainBasis}).
          </>
        )}
      </p>

      {page.summary.length > 0 ? (
        <Section title="Summary">
          {page.summary.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </Section>
      ) : null}

      {page.meaning.length > 0 ? (
        <Section title="Meaning and interpretation">
          {page.meaning.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </Section>
      ) : null}

      {page.themes.length > 0 ? (
        <Section title="Themes">
          <ul className="space-y-4">
            {page.themes.map((item) => (
              <li key={item.theme}>
                <p className="font-medium text-foreground">{item.theme}</p>
                <p className="mt-1">{item.discussion}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {page.formAndMeter.length > 0 ? (
        <Section title="Form and meter">
          {page.formAndMeter.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </Section>
      ) : null}

      {page.literaryDevices.length > 0 ? (
        <Section title="Literary devices">
          <ul className="space-y-4">
            {page.literaryDevices.map((item) => (
              <li key={`${item.device}-${item.example?.slice(0, 24) ?? ""}`}>
                <p className="font-medium text-foreground">{item.device}</p>
                {item.example ? (
                  <p className="mt-1 font-[family-name:var(--font-editor)] italic">
                    {item.example}
                  </p>
                ) : null}
                <p className="mt-1">{item.discussion}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {page.historicalContext.length > 0 ? (
        <Section title="Historical context">
          {page.historicalContext.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </Section>
      ) : null}

      {page.criticalViews.length > 0 ? (
        <Section title="What critics say">
          <ul className="space-y-6">
            {page.criticalViews.map((view) => (
              <li key={`${view.source}-${view.quote.slice(0, 32)}`}>
                <blockquote className="border-l-2 border-border pl-4">
                  <p className="font-[family-name:var(--font-editor)] italic text-foreground">
                    “{view.quote}”
                  </p>
                  <footer className="mt-2 text-sm not-italic">
                    {view.author ? `${view.author}, ` : null}
                    <a
                      href={view.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline-offset-2 hover:underline"
                    >
                      {view.source}
                    </a>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <ToolFaqList faqs={page.faqs} path={page.path} />

      {page.sources.length > 0 ? (
        <Section title="References">
          <ul className="list-disc space-y-2 pl-5">
            {page.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-2 hover:underline"
                >
                  {source.label}
                </a>
                {source.publisher ? (
                  <span className="text-muted-foreground">
                    {" "}
                    — {source.publisher}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <p className="mt-12 font-[family-name:var(--font-ui)] text-base text-muted-foreground">
        <Link
          to="/write"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          {page.cta}
        </Link>
      </p>
    </ContentPageLayout>
  );
}
