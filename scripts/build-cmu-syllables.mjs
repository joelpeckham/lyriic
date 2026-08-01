/**
 * Rebuild syllable counts from the fused pronunciation corpus.
 * Delegates to build-pronunciation.mjs (Misaki + CMU + WikiPron).
 *
 * Usage: node scripts/build-cmu-syllables.mjs
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const result = spawnSync(
  process.execPath,
  [join(__dirname, "build-pronunciation.mjs")],
  { stdio: "inherit" },
);
process.exitCode = result.status ?? 1;
