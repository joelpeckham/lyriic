import { Link } from "react-router-dom";

import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import {
  listPoemPages,
  POEMS_INDEX_DESCRIPTION,
  POEMS_INDEX_H1,
  POEMS_INDEX_INTRO,
  POEMS_INDEX_TITLE,
  type ComposedPoemPage,
} from "@/content/poems";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_URL } from "@/lib/seo";

function groupByAuthor(pages: ComposedPoemPage[]) {
  const map = new Map<string, ComposedPoemPage[]>();
  for (const page of pages) {
    const list = map.get(page.author) ?? [];
    list.push(page);
    map.set(page.author, list);
  }
  return [...map.entries()]
    .map(([author, poems]) => ({
      author,
      poems: poems.sort((a, b) => a.poemTitle.localeCompare(b.poemTitle)),
    }))
    .sort((a, b) => a.author.localeCompare(b.author));
}

export function PoemsIndexPage() {
  useDocumentMeta({
    title: POEMS_INDEX_TITLE,
    description: POEMS_INDEX_DESCRIPTION,
    path: "/poems",
  });

  const pages = listPoemPages().sort((a, b) =>
    a.poemTitle.localeCompare(b.poemTitle),
  );
  const groups = groupByAuthor(pages);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: POEMS_INDEX_H1,
    description: POEMS_INDEX_DESCRIPTION,
    url: `${SITE_URL}/poems`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: pages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.poemTitle,
        url: `${SITE_URL}${page.path}`,
      })),
    },
  };

  return (
    <ContentPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="font-[family-name:var(--font-brand)] text-3xl tracking-tight text-foreground sm:text-4xl">
        {POEMS_INDEX_H1}
      </h1>
      <p className="mt-3 font-[family-name:var(--font-ui)] text-base text-muted-foreground">
        {POEMS_INDEX_INTRO}
      </p>

      {pages.length === 0 ? (
        <p className="mt-10 font-[family-name:var(--font-ui)] text-base text-muted-foreground">
          Analyses are being added. Check back soon, or open the{" "}
          <Link
            to="/tools"
            className="text-foreground underline-offset-2 hover:underline"
          >
            poetry tools
          </Link>
          .
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <section key={group.author}>
              <h2 className="font-[family-name:var(--font-brand)] text-xl tracking-tight text-foreground">
                {group.author}
              </h2>
              <ul className="mt-3 space-y-3 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
                {group.poems.map((poem) => (
                  <li key={poem.slug}>
                    <Link
                      to={poem.path}
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      {poem.poemTitle}
                    </Link>
                    <span className="text-muted-foreground">
                      {" "}
                      — {poem.intro.split(/(?<=\.)\s/)[0] ?? "Analysis"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </ContentPageLayout>
  );
}
