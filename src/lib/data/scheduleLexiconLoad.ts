import { loadLexicon } from "@/lib/data/lexicon";
import { runWhenIdle } from "@/lib/data/runWhenIdle";
import { loadStress } from "@/lib/data/stress";
import { loadVariants } from "@/lib/data/variants";
import { prefetchRhymes } from "@/lib/rhyme/lookup";
import { prefetchThesaurus } from "@/lib/thesaurus/lookup";

type NetworkConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

let scheduled = false;

/** Idle timeout before lexicon fetch — longer on constrained networks. */
function lexiconIdleTimeoutMs(): number {
  const conn = (
    navigator as Navigator & { connection?: NetworkConnection }
  ).connection;
  if (!conn) return 2000;
  if (conn.saveData) return 10_000;
  const type = conn.effectiveType;
  if (type === "slow-2g" || type === "2g" || type === "3g") return 10_000;
  return 2000;
}

/**
 * One-time idle schedule for all shared dict packs.
 * Lexicon first, then variants/stress; thesaurus and rhymes follow on later idle passes.
 * Safe to call from app root; subsequent calls are no-ops.
 */
export function scheduleLexiconLoad(): void {
  if (scheduled || typeof window === "undefined") return;
  scheduled = true;
  runWhenIdle(() => {
    void loadLexicon().then(() => {
      void loadVariants().catch(() => {});
      void loadStress().catch(() => {});
      prefetchThesaurus();
      prefetchRhymes();
    });
  }, lexiconIdleTimeoutMs());
}
