import type { WordSyllableCount } from "./types";

const cache = new Map<string, WordSyllableCount>();

export function getMemo(key: string): WordSyllableCount | undefined {
  return cache.get(key);
}

export function setMemo(key: string, value: WordSyllableCount): void {
  cache.set(key, value);
}

export function clearMemo(): void {
  cache.clear();
}
