import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll } from "vitest";

import {
  decodeLexicon,
  decodeStress,
  decodeVariants,
} from "@/lib/data/dictPackCodec";
import { __setLexiconForTests } from "@/lib/data/lexicon";
import { __setStressForTests } from "@/lib/data/stress";
import { __setVariantsForTests } from "@/lib/data/variants";

const packsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../lib/data/packs",
);

/** Eagerly load lexicon + stress + variants so tests see dict hits. */
beforeAll(() => {
  const lexBuf = readFileSync(join(packsDir, "lexicon.bin"));
  __setLexiconForTests(decodeLexicon(new Uint8Array(lexBuf)));
  const stressBuf = readFileSync(join(packsDir, "stress.bin"));
  __setStressForTests(decodeStress(new Uint8Array(stressBuf)));
  const variantsBuf = readFileSync(join(packsDir, "variants.bin"));
  __setVariantsForTests(decodeVariants(new Uint8Array(variantsBuf)));
}, 60_000);
