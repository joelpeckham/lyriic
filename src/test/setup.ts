import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll } from "vitest";

import { decodeLexicon } from "@/lib/data/dictPackCodec";
import { __setLexiconDictForTests } from "@/lib/syllables/dict";

const packsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../lib/data/packs",
);

/** Eagerly load syllable lexicon so tests see dict hits (production loads lazily). */
beforeAll(() => {
  const buf = readFileSync(join(packsDir, "lexicon.bin"));
  __setLexiconDictForTests(decodeLexicon(new Uint8Array(buf)));
}, 60_000);
