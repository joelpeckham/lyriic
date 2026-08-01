/**
 * Download helper for dictionary build sources.
 */

import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

/**
 * @param {string} url
 * @param {string} destPath
 * @returns {Promise<void>}
 */
export async function ensureDownloaded(url, destPath) {
  if (existsSync(destPath)) return;
  mkdirSync(dirname(destPath), { recursive: true });
  console.log(`Fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed ${res.status} ${res.statusText}: ${url}`);
  }
  if (!res.body) {
    throw new Error(`Download returned empty body: ${url}`);
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(destPath));
  console.log(`  → ${destPath}`);
}
