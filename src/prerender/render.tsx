/**
 * SSR entry for static prerender of marketing / tool routes.
 * Loaded via Vite `ssrLoadModule` from scripts/prerender.mjs.
 */
import { renderToString } from "react-dom/server";
import { Route, Routes, StaticRouter } from "react-router-dom";

import { AboutPage } from "@/components/pages/AboutPage";
import { FaqPage } from "@/components/pages/FaqPage";
import { FormToolPage } from "@/components/pages/FormToolPage";
import { PoemPage } from "@/components/pages/PoemPage";
import { PoemsIndexPage } from "@/components/pages/PoemsIndexPage";
import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { ToolPage } from "@/components/pages/ToolPage";
import { ToolsIndexPage } from "@/components/pages/ToolsIndexPage";
import { WriteSeoPage } from "@/components/pages/WriteSeoPage";
import { WriterSeoPage } from "@/components/pages/WriterSeoPage";
import { FormCheckerTool } from "@/components/tools/FormCheckerTool";
import { RhymeCheckerTool } from "@/components/tools/RhymeCheckerTool";
import { RhymeFinderTool } from "@/components/tools/RhymeFinderTool";
import { SyllableCounterTool } from "@/components/tools/SyllableCounterTool";
import {
  FAQ_DESCRIPTION,
  FAQ_TITLE,
} from "@/content/faq";
import {
  getComposedFormToolPageBySlug,
  isFormCheckerSlug,
  meterIdFromCheckerSlug,
} from "@/content/formCheckers";
import {
  getPoemPageBySlug,
  isPoemSlug,
  POEMS_INDEX_DESCRIPTION,
  POEMS_INDEX_TITLE,
} from "@/content/poems";
import {
  PRIVACY_DESCRIPTION,
  PRIVACY_TITLE,
} from "@/content/privacy";
import { getToolBySlug, type ToolPageContent } from "@/content/tools";
import {
  TOOLS_INDEX_DESCRIPTION,
  TOOLS_INDEX_TITLE,
} from "@/content/toolsIndex";
import { WRITER_PRERENDER_SLUGS, writerDocumentMeta } from "@/lib/meters/seed";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  WRITE_DESCRIPTION,
  WRITE_TITLE,
  absoluteUrl,
} from "@/lib/seo";

export type RenderResult = {
  html: string;
  title: string;
  description: string;
  path: string;
  canonical: string;
};

/** Memory localStorage so PrefsProvider / prefs helpers never touch real storage. */
function installMemoryLocalStorage(): void {
  if (typeof globalThis.localStorage !== "undefined") return;

  const store = new Map<string, string>();
  const memory: Storage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: memory,
    configurable: true,
  });
}

installMemoryLocalStorage();

export function metaForRoute(route: string): {
  title: string;
  description: string;
  path: string;
} {
  if (route === "/" || route === "" || route === "/about") {
    // /about is a human alias; canonical stays on home.
    return {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      path: "/",
    };
  }
  if (route === "/faq") {
    return {
      title: FAQ_TITLE,
      description: FAQ_DESCRIPTION,
      path: "/faq",
    };
  }
  if (route === "/privacy") {
    return {
      title: PRIVACY_TITLE,
      description: PRIVACY_DESCRIPTION,
      path: "/privacy",
    };
  }
  if (route === "/tools") {
    return {
      title: TOOLS_INDEX_TITLE,
      description: TOOLS_INDEX_DESCRIPTION,
      path: "/tools",
    };
  }
  if (route === "/poems") {
    return {
      title: POEMS_INDEX_TITLE,
      description: POEMS_INDEX_DESCRIPTION,
      path: "/poems",
    };
  }

  const poemMatch = /^\/poems\/([^/]+)$/.exec(route);
  if (poemMatch) {
    const poemSlug = poemMatch[1]!;
    const page = getPoemPageBySlug(poemSlug);
    if (!page) {
      throw new Error(`Unknown poem prerender route: ${route}`);
    }
    return {
      title: page.title,
      description: page.description,
      path: page.path,
    };
  }

  if (route === "/write") {
    return {
      title: WRITE_TITLE,
      description: WRITE_DESCRIPTION,
      path: "/write",
    };
  }

  const writeMatch = /^\/write\/([^/]+)$/.exec(route);
  if (writeMatch) {
    const slug = writeMatch[1]!;
    const meta = writerDocumentMeta(slug);
    if (!meta) {
      throw new Error(`Unknown writer prerender route: ${route}`);
    }
    return meta;
  }

  const match = /^\/tools\/([^/]+)$/.exec(route);
  const slug = match?.[1];
  if (slug && isFormCheckerSlug(slug)) {
    const page = getComposedFormToolPageBySlug(slug);
    if (!page) {
      throw new Error(`Unknown form checker prerender route: ${route}`);
    }
    return {
      title: page.title,
      description: page.description,
      path: page.path,
    };
  }

  const tool = slug ? getToolBySlug(slug) : undefined;
  if (!tool) {
    throw new Error(`Unknown prerender route: ${route}`);
  }
  return {
    title: tool.title,
    description: tool.description,
    path: tool.path,
  };
}

function UtilityToolBody({ tool }: { tool: ToolPageContent }) {
  switch (tool.slug) {
    case "syllable-counter":
      return <SyllableCounterTool />;
    case "rhyme-finder":
      return <RhymeFinderTool />;
    case "rhyme-checker":
      return <RhymeCheckerTool />;
    default:
      return (
        <div className="mt-8 min-h-40" aria-label={`${tool.h1} tool`}>
          <p className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
            Interactive tool loads in the browser.
          </p>
        </div>
      );
  }
}

function App({ route }: { route: string }) {
  const toolMatch = /^\/tools\/([^/]+)$/.exec(route);
  const slug = toolMatch?.[1];
  const formPage =
    slug && isFormCheckerSlug(slug)
      ? getComposedFormToolPageBySlug(slug)
      : undefined;
  const formMeterId = slug ? meterIdFromCheckerSlug(slug) : undefined;
  const tool = slug && !formPage ? getToolBySlug(slug) : undefined;
  const writeMatch = /^\/write\/([^/]+)$/.exec(route);
  const writeSlug = writeMatch?.[1];
  const poemMatch = /^\/poems\/([^/]+)$/.exec(route);
  const poemSlug = poemMatch?.[1];
  const poemPage =
    poemSlug && isPoemSlug(poemSlug) ? getPoemPageBySlug(poemSlug) : undefined;

  return (
    <StaticRouter location={route}>
      <Routes>
        <Route path="/" element={<AboutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/tools" element={<ToolsIndexPage />} />
        <Route path="/poems" element={<PoemsIndexPage />} />
        <Route
          path="/poems/:slug"
          element={poemPage ? <PoemPage page={poemPage} /> : null}
        />
        <Route path="/write" element={<WriteSeoPage />} />
        <Route
          path="/write/:slug"
          element={
            writeSlug && WRITER_PRERENDER_SLUGS.includes(writeSlug) ? (
              <WriterSeoPage slug={writeSlug} />
            ) : null
          }
        />
        <Route
          path="/tools/:slug"
          element={
            formPage && formMeterId ? (
              <FormToolPage page={formPage}>
                <FormCheckerTool meterId={formMeterId} />
              </FormToolPage>
            ) : tool ? (
              <ToolPage tool={tool}>
                <UtilityToolBody tool={tool} />
              </ToolPage>
            ) : null
          }
        />
      </Routes>
    </StaticRouter>
  );
}

export function render(route: string): RenderResult {
  const meta = metaForRoute(route);
  const html = renderToString(<App route={route} />);
  if (!html.includes("<h1")) {
    throw new Error(`Prerender produced no h1 for ${route}`);
  }
  return {
    html,
    title: meta.title,
    description: meta.description,
    path: meta.path,
    canonical: absoluteUrl(meta.path),
  };
}
