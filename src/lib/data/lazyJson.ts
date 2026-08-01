/**
 * Shared lazy JSON chunk loader + lookup key normalizer for rhyme/thesaurus.
 */

export function normalizeLookupKey(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, "'");
}

type JsonModule<T> = { default: T };

/**
 * Lazy-load a Vite JSON chunk once; expose sync get/ready + test injection.
 */
export function createLazyJsonData<T>(
  loader: () => Promise<JsonModule<T>>,
): {
  load: () => Promise<T>;
  isReady: () => boolean;
  get: () => T | null;
  __setForTests: (value: T | null) => void;
} {
  let data: T | null = null;
  let dataPromise: Promise<T> | null = null;

  return {
    load() {
      if (data) return Promise.resolve(data);
      if (!dataPromise) {
        dataPromise = loader().then((mod) => {
          data = mod.default;
          return data;
        });
      }
      return dataPromise;
    },
    isReady() {
      return data !== null;
    },
    get() {
      return data;
    },
    __setForTests(value) {
      data = value;
      dataPromise = value ? Promise.resolve(value) : null;
    },
  };
}
