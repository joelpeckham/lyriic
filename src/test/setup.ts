import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll } from "vitest";

import { decodeLexicon, decodeStress } from "@/lib/data/dictPackCodec";
import { __setLexiconForTests } from "@/lib/data/lexicon";
import { __setStressForTests } from "@/lib/data/stress";

const packsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../lib/data/packs",
);

/** Eagerly load lexicon + stress so tests see dict hits (production loads lazily). */
beforeAll(() => {
  const lexBuf = readFileSync(join(packsDir, "lexicon.bin"));
  __setLexiconForTests(decodeLexicon(new Uint8Array(lexBuf)));
  const stressBuf = readFileSync(join(packsDir, "stress.bin"));
  __setStressForTests(decodeStress(new Uint8Array(stressBuf)));
}, 60_000);
