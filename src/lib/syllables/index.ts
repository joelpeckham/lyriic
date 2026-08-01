export { countLine, countLines, countLinesIncremental } from "./countLine";
export { clearMemo, countWord } from "./countWord";
export {
  getDictRevision,
  lookupDict,
  subscribeDictReady,
} from "@/lib/data/lexicon";
export { countHeuristic } from "./heuristic";
export {
  isValidOverrideCount,
  normalizeOverrideKey,
  normalizeOverridesRecord,
} from "./overrides";
export { tokenizeLine } from "./tokenize";
export type {
  LineSyllableCount,
  SyllableSource,
  WordSyllableCount,
  WordToken,
} from "./types";
