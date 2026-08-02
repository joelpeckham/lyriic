/**
 * Prerender content routes into dist/ after vite build.
 * Uses react-dom/server via Vite SSR (no Chromium).
 * "/" gets the About landing (keeps WebApplication JSON-LD in the template).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

function ogImageForPath(path) {
  if (path === "/" || path === "") return "https://lyriic.com/og.jpg";
  const toolMatch = /^\/tools\/([^/]+)\/?$/.exec(path);
  if (toolMatch) return `https://lyriic.com/og/${toolMatch[1]}.png`;
  return "https://lyriic.com/og.jpg";
}

function ogImageTypeForUrl(imageUrl) {
  return imageUrl.endsWith(".png") ? "image/png" : "image/jpeg";
}

function routeToFile(route) {
  if (route === "/" || route === "") return join(dist, "index.html");
  const trimmed = route.replace(/^\//, "");
  return join(dist, trimmed, "index.html");
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Replace content= on a meta tag identified by name or property. */
function upsertMeta(html, attr, key, content) {
  const escaped = escapeAttr(content);
  const re = new RegExp(
    `(<meta\\b[^>]*?\\b${attr}=["']${key}["'][^>]*?\\bcontent=["'])([^"']*)(["'])`,
    "is",
  );
  if (re.exec(html)) {
    return html.replace(re, `$1${escaped}$3`);
  }
  // Insert before </head> if missing.
  return html.replace(
    /<\/head>/i,
    `    <meta ${attr}="${key}" content="${escaped}" />\n  </head>`,
  );
}

function upsertCanonical(html, href) {
  const escaped = escapeAttr(href);
  const re =
    /(<link\b[^>]*?\brel=["']canonical["'][^>]*?\bhref=["'])([^"']*)(["'])/is;
  if (re.exec(html)) {
    return html.replace(re, `$1${escaped}$3`);
  }
  return html.replace(
    /<\/head>/i,
    `    <link rel="canonical" href="${escaped}" />\n  </head>`,
  );
}

function setTitle(html, title) {
  return html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`,
  );
}

function injectRoot(html, appHtml) {
  const start = html.indexOf('<div id="root">');
  if (start === -1) {
    throw new Error('dist/index.html missing <div id="root">');
  }
  const afterOpen = start + '<div id="root">'.length;
  // Template #root holds only the seo-shell article; its </div> is the last
  // before <noscript> (or end of body).
  const noscript = html.indexOf("<noscript", afterOpen);
  const searchUntil = noscript === -1 ? html.length : noscript;
  const end = html.lastIndexOf("</div>", searchUntil);
  if (end === -1 || end < afterOpen) {
    throw new Error("Could not locate #root closing tag in dist/index.html");
  }
  return html.slice(0, afterOpen) + appHtml + html.slice(end);
}

function stripHomeJsonLd(html) {
  return html.replace(
    /<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"WebApplication",\s*"name":\s*"lyriic",[\s\S]*?<\/script>\s*/,
    "",
  );
}

function stripNoscript(html) {
  return html.replace(/<noscript>[\s\S]*?<\/noscript>\s*/i, "");
}

function applyHead(html, { title, description, canonical, path }) {
  const image = ogImageForPath(path ?? "/");
  const imageType = ogImageTypeForUrl(image);
  let out = setTitle(html, title);
  out = upsertMeta(out, "name", "description", description);
  out = upsertMeta(out, "property", "og:title", title);
  out = upsertMeta(out, "property", "og:description", description);
  out = upsertMeta(out, "property", "og:url", canonical);
  out = upsertMeta(out, "property", "og:image", image);
  out = upsertMeta(out, "property", "og:image:width", "1200");
  out = upsertMeta(out, "property", "og:image:height", "630");
  out = upsertMeta(out, "property", "og:image:type", imageType);
  out = upsertMeta(out, "property", "og:type", "website");
  out = upsertMeta(out, "property", "og:site_name", "lyriic");
  out = upsertMeta(out, "property", "og:locale", "en_US");
  out = upsertMeta(out, "name", "twitter:card", "summary_large_image");
  out = upsertMeta(out, "name", "twitter:title", title);
  out = upsertMeta(out, "name", "twitter:description", description);
  out = upsertMeta(out, "name", "twitter:image", image);
  out = upsertCanonical(out, canonical);
  return out;
}

async function main() {
  const templatePath = join(dist, "index.html");
  const template = readFileSync(templatePath, "utf8");

  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const { listComposedFormToolPages } = await vite.ssrLoadModule(
      "/src/content/formCheckers/index.ts",
    );
    const { WRITER_PRERENDER_SLUGS } = await vite.ssrLoadModule(
      "/src/lib/meters/seed.ts",
    );
    const { render } = await vite.ssrLoadModule("/src/prerender/render.tsx");

    const formRoutes = listComposedFormToolPages().map((page) => page.path);
    const writerRoutes = WRITER_PRERENDER_SLUGS.map((slug) => `/write/${slug}`);

    const ROUTES = [
      "/",
      "/about",
      "/faq",
      "/privacy",
      "/tools",
      "/tools/syllable-counter",
      "/tools/rhyme-finder",
      ...formRoutes,
      ...writerRoutes,
    ];

    for (const route of ROUTES) {
      const result = render(route);
      let html = injectRoot(template, result.html);
      html = applyHead(html, result);
      // Home keeps WebApplication JSON-LD + noscript; /about is an alias.
      if (route !== "/") {
        html = stripHomeJsonLd(html);
        html = stripNoscript(html);
      }

      const out = routeToFile(route);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, html);
      console.log(`Prerendered ${route} → ${out}`);
    }
  } finally {
    await vite.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
