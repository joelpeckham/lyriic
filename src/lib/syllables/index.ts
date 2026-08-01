export { countLine, countLines, countLinesIncremental } from "./countLine";
export { clearMemo, countWord } from "./countWord";
export {
  dictSize,
  getDictRevision,
  isDictReady,
  loadDict,
  lookupDict,
  subscribeDictReady,
} from "./dict";
export { countHeuristic } from "./heuristic";
export {
  isValidOverrideCount,
  normalizeOverrideKey,
  normalizeOverridesRecord,
} from "./overrides";
export { tokenizeLine } from "./tokenize";
export type {
  LineSyllableCount,
  SyllableProvider,
  SyllableSource,
  WordSyllableCount,
  WordToken,
} from "./types";
