/**
 * Prerender content routes into dist/ after vite build.
 * Skips "/" so the SEO shell in index.html is preserved.
 *
 * Vercel build images lack the shared libs Playwright's Chromium needs
 * (e.g. libnspr4.so), so we launch @sparticuz/chromium there instead.
 */
import { execSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const PORT = 4179;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const onVercel = Boolean(process.env.VERCEL);

const ROUTES = [
  "/faq",
  "/privacy",
  "/tools/syllable-counter",
  "/tools/haiku-checker",
  "/tools/rhyme-finder",
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // retry
    }
    await wait(250);
  }
  throw new Error(`Preview server did not start at ${url}`);
}

function startPreview() {
  const child = spawn(
    process.platform === "win32" ? "pnpm.cmd" : "pnpm",
    ["exec", "vite", "preview", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
    {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    },
  );
  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});
  return child;
}

function routeToFile(route) {
  const trimmed = route.replace(/^\//, "");
  return join(dist, trimmed, "index.html");
}

function ensurePlaywrightChromium() {
  const executable = chromium.executablePath();
  if (existsSync(executable)) return;
  console.log("Playwright Chromium missing; installing…");
  execSync("pnpm exec playwright install chromium", {
    cwd: root,
    stdio: "inherit",
  });
}

async function launchBrowser() {
  if (onVercel) {
    const sparticuz = (await import("@sparticuz/chromium")).default;
    console.log("Launching @sparticuz/chromium for Vercel build…");
    return chromium.launch({
      args: sparticuz.args,
      executablePath: await sparticuz.executablePath(),
      headless: true,
    });
  }

  ensurePlaywrightChromium();
  return chromium.launch({ headless: true });
}

async function main() {
  const preview = startPreview();
  let browser;
  try {
    await waitForServer(ORIGIN);
    browser = await launchBrowser();
    const page = await browser.newPage();

    for (const route of ROUTES) {
      const url = `${ORIGIN}${route}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForSelector("h1", { timeout: 15_000 });
      // Give client meta + JSON-LD a tick to settle.
      await wait(100);
      let html = await page.content();
      // Drop the home-only WebApplication JSON-LD that ships in index.html;
      // route pages inject their own schema in #root.
      html = html.replace(
        /<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"WebApplication",\s*"name":\s*"lyriic",[\s\S]*?<\/script>\s*/,
        "",
      );
      // noscript marketing shell is for the SPA entry, not content routes.
      html = html.replace(/<noscript>[\s\S]*?<\/noscript>\s*/i, "");
      const out = routeToFile(route);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, html);
      console.log(`Prerendered ${route} → ${out}`);
    }
  } finally {
    if (browser) await browser.close();
    preview.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
