import { Link } from "react-router-dom";

import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import {
  isFormCheckerSlug,
  listComposedFormToolPages,
  listComposedFormToolsByGroup,
  type ComposedFormToolPage,
} from "@/content/formCheckers";
import { TOOL_PAGES } from "@/content/tools";
import {
  POPULAR_FORM_METER_IDS,
  TOOLS_INDEX_DESCRIPTION,
  TOOLS_INDEX_INTRO,
  TOOLS_INDEX_TITLE,
} from "@/content/toolsIndex";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_URL } from "@/lib/seo";

function popularFormPages(): ComposedFormToolPage[] {
  const byMeter = new Map(
    listComposedFormToolPages().map((page) => [page.meterId, page] as const),
  );
  return POPULAR_FORM_METER_IDS.flatMap((meterId) => {
    const page = byMeter.get(meterId);
    return page ? [page] : [];
  });
}

function utilityTools() {
  return TOOL_PAGES.filter((tool) => !isFormCheckerSlug(tool.slug));
}

const linkClass =
  "underline-offset-2 hover:text-foreground hover:underline";

const sectionLabelClass =
  "text-xs tracking-[0.14em] text-muted-foreground uppercase";

export function ToolsIndexPage() {
  useDocumentMeta({
    title: TOOLS_INDEX_TITLE,
    description: TOOLS_INDEX_DESCRIPTION,
    path: "/tools",
  });

  const utilities = utilityTools();
  const popular = popularFormPages();
  const groups = listComposedFormToolsByGroup();

  const listItems = [
    ...utilities.map((tool, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: tool.h1,
      url: `${SITE_URL}${tool.path}`,
    })),
    ...listComposedFormToolPages().map((page, index) => ({
      "@type": "ListItem" as const,
      position: utilities.length + index + 1,
      name: page.h1,
      url: `${SITE_URL}${page.path}`,
    })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tools",
    description: TOOLS_INDEX_DESCRIPTION,
    url: `${SITE_URL}/tools`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listItems,
    },
  };

  return (
    <ContentPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="font-[family-name:var(--font-brand)] text-3xl tracking-tight text-foreground sm:text-4xl">
        Tools
      </h1>
      <p className="mt-3 font-[family-name:var(--font-ui)] text-base text-muted-foreground">
        {TOOLS_INDEX_INTRO}
      </p>

      <nav
        aria-label="All tools"
        className="mt-10 font-[family-name:var(--font-ui)] text-sm text-muted-foreground"
      >
        <section>
          <p className={sectionLabelClass}>Utilities</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {utilities.map((tool) => (
              <li key={tool.path}>
                <Link to={tool.path} className={linkClass}>
                  {tool.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {popular.length > 0 ? (
          <section className="mt-8">
            <p className={sectionLabelClass}>Popular forms</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {popular.map((page) => (
                <li key={page.path}>
                  <Link to={page.path} className={linkClass}>
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {groups.map((group) => (
          <section key={group.group} className="mt-8">
            <p className={sectionLabelClass}>{group.label}</p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
              {group.pages.map((page) => (
                <li key={page.path}>
                  <Link to={page.path} className={linkClass}>
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </ContentPageLayout>
  );
}
