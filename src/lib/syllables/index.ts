export { countLine, countLines, countLinesIncremental } from "./countLine";
export { countWord } from "./countWord";
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
  clearAllOverrides,
  clearOverride,
  getOverride,
  getOverrides,
  isValidOverrideCount,
  normalizeOverrideKey,
  normalizeOverridesRecord,
  overridesToRecord,
  replaceOverrides,
  setOverride,
} from "./overrides";
export { clearMemo } from "./memo";
export { tokenizeLine } from "./tokenize";
export type {
  LineSyllableCount,
  SyllableProvider,
  SyllableSource,
  WordSyllableCount,
  WordToken,
} from "./types";
