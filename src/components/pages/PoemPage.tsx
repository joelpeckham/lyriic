import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { AboutPoemEditor } from "@/components/pages/AboutPoemEditor";
import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import { ToolEditorPitch } from "@/components/tools/ToolEditorPitch";
import { ToolFaqList } from "@/components/tools/ToolFaqList";
import { ZEN_EDITOR_PITCH } from "@/content/formCheckers/zenPitch";
import type {
  ComposedPoemPage,
  PoemBlock,
  PoemCitation,
} from "@/content/poems";
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

function citationNumber(
  citations: PoemCitation[],
  id: string,
): number | null {
  const index = citations.findIndex((c) => c.id === id);
  return index >= 0 ? index + 1 : null;
}

function CiteSuperscripts({
  cites,
  citations,
}: {
  cites: string[];
  citations: PoemCitation[];
}) {
  return (
    <>
      {cites.map((id) => {
        const n = citationNumber(citations, id);
        if (n === null) return null;
        const cite = citations[n - 1];
        return (
          <sup key={id} className="ml-0.5">
            <a
              href={`#cite-${id}`}
              title={cite.source}
              className="text-foreground underline-offset-2 hover:underline"
            >
              [{n}]
            </a>
          </sup>
        );
      })}
    </>
  );
}

function PoemBlocks({
  blocks,
  page,
  excerptOffset,
}: {
  blocks: PoemBlock[];
  page: ComposedPoemPage;
  excerptOffset: number;
}) {
  let excerptIndex = excerptOffset;
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "excerpt") {
          const key = `poem-${page.slug}-ex-${excerptIndex}`;
          const eager = excerptIndex === 0;
          excerptIndex += 1;
          return (
            <div
              key={key}
              className="rounded-lg border border-border/60 bg-card/40 px-3 py-3 sm:px-4 sm:py-4"
            >
              <AboutPoemEditor
                text={block.lines}
                settings={page.editorSettings}
                documentKey={key}
                aria-label={`Excerpt from ${page.poemTitle} by ${page.author}`}
                eager={eager}
                readOnly
              />
            </div>
          );
        }
        return (
          <p key={`p-${i}-${block.text.slice(0, 32)}`}>
            {block.text}
            {block.cites?.length ? (
              <CiteSuperscripts cites={block.cites} citations={page.citations} />
            ) : null}
          </p>
        );
      })}
    </>
  );
}

function countExcerpts(blocks: PoemBlock[]): number {
  return blocks.filter((b) => b.type === "excerpt").length;
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

  let excerptCursor = 0;

  const renderBlocks = (blocks: PoemBlock[]) => {
    const offset = excerptCursor;
    excerptCursor += countExcerpts(blocks);
    return (
      <PoemBlocks blocks={blocks} page={page} excerptOffset={offset} />
    );
  };

  const citeById = new Map(page.citations.map((c) => [c.id, c] as const));

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
      <p className="mt-3 font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
        Full text from{" "}
        <a
          href={page.fullTextSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline-offset-2 hover:underline"
        >
          {page.fullTextSource.label}
        </a>
        . Public domain in the US ({page.publicDomainBasis}).
      </p>

      {page.summary.length > 0 ? (
        <Section title="Summary">{renderBlocks(page.summary)}</Section>
      ) : null}

      {page.meaning.length > 0 ? (
        <Section title="Meaning and interpretation">
          {renderBlocks(page.meaning)}
        </Section>
      ) : null}

      {page.themes.length > 0 ? (
        <Section title="Themes">
          <ul className="space-y-6">
            {page.themes.map((item) => (
              <li key={item.theme}>
                <p className="font-medium text-foreground">{item.theme}</p>
                <div className="mt-2 space-y-3">
                  {renderBlocks(item.blocks)}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {page.formAndMeter.length > 0 ? (
        <Section title="Form and meter">
          {renderBlocks(page.formAndMeter)}
        </Section>
      ) : null}

      {page.literaryDevices.length > 0 ? (
        <Section title="Literary devices">
          <ul className="space-y-6">
            {page.literaryDevices.map((item) => (
              <li key={item.device}>
                <p className="font-medium text-foreground">{item.device}</p>
                <div className="mt-2 space-y-3">
                  {renderBlocks(item.blocks)}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {page.historicalContext.length > 0 ? (
        <Section title="Historical context">
          {renderBlocks(page.historicalContext)}
        </Section>
      ) : null}

      {page.criticalViews.length > 0 ? (
        <Section title="What critics say">
          <ul className="space-y-6">
            {page.criticalViews.map((view) => {
              const cite = citeById.get(view.citeId);
              if (!cite?.quote) return null;
              return (
                <li key={view.citeId}>
                  <blockquote className="border-l-2 border-border pl-4">
                    <p className="font-[family-name:var(--font-editor)] italic text-foreground">
                      “{cite.quote}”
                    </p>
                    <footer className="mt-2 text-sm not-italic">
                      {cite.author ? `${cite.author}, ` : null}
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline-offset-2 hover:underline"
                      >
                        {cite.source}
                      </a>
                    </footer>
                  </blockquote>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      <ToolFaqList faqs={page.faqs} path={page.path} />

      {page.citations.length > 0 ? (
        <Section title="References">
          <ol className="list-decimal space-y-2 pl-5">
            {page.citations.map((cite) => (
              <li key={cite.id} id={`cite-${cite.id}`}>
                <a
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline-offset-2 hover:underline"
                >
                  {cite.author ? `${cite.author}, ` : null}
                  {cite.source}
                </a>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      <ToolEditorPitch
        title={ZEN_EDITOR_PITCH.title}
        body={ZEN_EDITOR_PITCH.body}
        cta={page.cta}
        to={page.writePath}
      />
    </ContentPageLayout>
  );
}
