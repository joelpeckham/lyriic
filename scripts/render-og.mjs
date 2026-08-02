/**
 * Build the OG gallery and screenshot each card into public/og/.
 * Home also overwrites public/og.jpg for the legacy default URL.
 */
import { createServer } from "node:http";
import { mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distOg = join(root, "dist-og");
const outDir = join(root, "public", "og");

const OG_WIDTH = 1200;

function buildOg() {
  const result = spawnSync(
    "pnpm",
    ["exec", "vite", "build", "--config", "vite.og.config.ts"],
    { cwd: root, stdio: "inherit", shell: process.platform === "win32" },
  );
  if (result.status !== 0) {
    throw new Error("vite.og build failed");
  }
}

function contentType(filePath) {
  switch (extname(filePath)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".woff2":
      return "font/woff2";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".bin":
      return "application/octet-stream";
    default:
      return "application/octet-stream";
  }
}

function serveDist() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url ?? "/", "http://127.0.0.1");
        let pathname = decodeURIComponent(url.pathname);
        if (pathname === "/") pathname = "/og.html";

        const filePath = join(distOg, pathname.replace(/^\//, ""));
        if (!filePath.startsWith(distOg)) {
          res.writeHead(403);
          res.end("Forbidden");
          return;
        }

        const data = readFileSync(filePath);
        res.writeHead(200, { "Content-Type": contentType(filePath) });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Failed to bind OG preview server"));
        return;
      }
      resolve({ server, port: address.port });
    });
  });
}

async function main() {
  buildOg();
  mkdirSync(outDir, { recursive: true });

  const { server, port } = await serveDist();
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: OG_WIDTH + 64, height: 4000 },
      deviceScaleFactor: 1,
    });

    await page.goto(`http://127.0.0.1:${port}/og.html`, {
      waitUntil: "networkidle",
    });
    await page.waitForSelector('html[data-og-ready="true"]', {
      timeout: 60_000,
    });
    // Stress/ruler geometry is measured post-paint; wait for marks on the first card.
    await page.waitForSelector("[data-og-id] .lyriic-stress-mark", {
      timeout: 30_000,
    });

    const ids = await page.$$eval("[data-og-id]", (nodes) =>
      nodes.map((node) => node.getAttribute("data-og-id")).filter(Boolean),
    );

    if (ids.length === 0) {
      throw new Error("No [data-og-id] cards found in OG gallery");
    }

    for (const id of ids) {
      const locator = page.locator(`[data-og-id="${id}"]`);
      await locator.scrollIntoViewIfNeeded();
      const pngPath = join(outDir, `${id}.png`);
      await locator.screenshot({
        path: pngPath,
        type: "png",
      });

      const stat = statSync(pngPath);
      console.log(`Wrote ${pngPath} (${stat.size} bytes)`);

      if (id === "home") {
        const jpegPath = join(root, "public", "og.jpg");
        await locator.screenshot({
          path: jpegPath,
          type: "jpeg",
          quality: 90,
        });
        console.log(`Wrote ${jpegPath}`);
      }
    }

    console.log(`Rendered ${ids.length} OG images → ${outDir}`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
