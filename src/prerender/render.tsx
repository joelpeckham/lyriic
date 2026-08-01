/**
 * SSR entry for static prerender of marketing / tool routes.
 * Loaded via Vite `ssrLoadModule` from scripts/prerender.mjs.
 */
import { renderToString } from "react-dom/server";
import { Route, Routes, StaticRouter } from "react-router-dom";

import { FaqPage } from "@/components/pages/FaqPage";
import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { ToolPage } from "@/components/pages/ToolPage";
import { HaikuCheckerTool } from "@/components/tools/HaikuCheckerTool";
import { RhymeFinderTool } from "@/components/tools/RhymeFinderTool";
import { SyllableCounterTool } from "@/components/tools/SyllableCounterTool";
import {
  FAQ_DESCRIPTION,
  FAQ_TITLE,
} from "@/content/faq";
import {
  PRIVACY_DESCRIPTION,
  PRIVACY_TITLE,
} from "@/content/privacy";
import { getToolBySlug, type ToolPageContent } from "@/content/tools";
import { absoluteUrl } from "@/lib/seo";

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

function metaForRoute(route: string): {
  title: string;
  description: string;
  path: string;
} {
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

  const match = /^\/tools\/([^/]+)$/.exec(route);
  const tool = match ? getToolBySlug(match[1]!) : undefined;
  if (!tool) {
    throw new Error(`Unknown prerender route: ${route}`);
  }
  return {
    title: tool.title,
    description: tool.description,
    path: tool.path,
  };
}

function ToolBody({ tool }: { tool: ToolPageContent }) {
  switch (tool.slug) {
    case "syllable-counter":
      return <SyllableCounterTool />;
    case "haiku-checker":
      return <HaikuCheckerTool />;
    case "rhyme-finder":
      return <RhymeFinderTool />;
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
  const tool = toolMatch ? getToolBySlug(toolMatch[1]!) : undefined;

  return (
    <StaticRouter location={route}>
      <Routes>
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route
          path="/tools/:slug"
          element={
            tool ? (
              <ToolPage tool={tool}>
                <ToolBody tool={tool} />
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
