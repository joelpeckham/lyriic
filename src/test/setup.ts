import { beforeAll } from "vitest";

import { loadDict } from "@/lib/syllables/dict";

/** Eagerly load CMU so syllable tests see dict hits (production loads lazily). */
beforeAll(async () => {
  await loadDict();
});
