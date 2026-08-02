import { useId, useState } from "react";
import { Link } from "react-router-dom";

import {
  listComposedFormToolPages,
  listComposedFormToolsByGroup,
  type ComposedFormToolPage,
} from "@/content/formCheckers";
import { TOOL_PAGES, type ToolPageContent } from "@/content/tools";
import { POPULAR_FORM_METER_IDS } from "@/content/toolsIndex";

type MoreToolsNavProps = {
  /** Current tool path — omitted from lists. */
  currentPath: string;
};

function popularFormPages(): ComposedFormToolPage[] {
  const byMeter = new Map(
    listComposedFormToolPages().map((page) => [page.meterId, page] as const),
  );
  return POPULAR_FORM_METER_IDS.flatMap((meterId) => {
    const page = byMeter.get(meterId);
    return page ? [page] : [];
  });
}

function utilityTools(): ToolPageContent[] {
  return TOOL_PAGES.filter((tool) => !tool.slug.endsWith("-checker"));
}

export function MoreToolsNav({ currentPath }: MoreToolsNavProps) {
  const [allOpen, setAllOpen] = useState(false);
  const panelId = useId();
  const utilities = utilityTools().filter((tool) => tool.path !== currentPath);
  const popular = popularFormPages().filter(
    (page) => page.path !== currentPath,
  );
  const groups = listComposedFormToolsByGroup();

  return (
    <nav
      aria-label="More tools"
      className="mt-12 font-[family-name:var(--font-ui)] text-sm text-muted-foreground"
    >
      <p className="font-medium text-foreground">More tools</p>

      {utilities.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {utilities.map((tool) => (
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

      {popular.length > 0 ? (
        <div className="mt-5">
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Popular forms
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {popular.map((page) => (
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
        </div>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          aria-expanded={allOpen}
          aria-controls={panelId}
          onClick={() => setAllOpen((open) => !open)}
        >
          {allOpen ? "Hide form checkers" : "All form checkers"}
        </button>
        {allOpen ? (
          <div id={panelId} className="mt-3">
            {groups.map((group) => {
              const pages = group.pages.filter(
                (page) => page.path !== currentPath,
              );
              if (pages.length === 0) return null;
              return (
                <div key={group.group} className="mt-4 first:mt-0">
                  <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                    {group.label}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                    {pages.map((page) => (
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
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
