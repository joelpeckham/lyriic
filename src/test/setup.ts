import { beforeAll } from "vitest";

import { loadDict } from "@/lib/syllables/dict";

/** Eagerly load syllable dict so tests see dict hits (production loads lazily). */
beforeAll(async () => {
  await loadDict();
}, 60_000);
