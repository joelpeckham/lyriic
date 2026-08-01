/**
 * Lazy fetch loader for binary dictionary packs.
 */

import {
  decodePack,
  type DecodedPack,
  type DictPackKind,
} from "./dictPackCodec";

export type {
  Lexicon,
  RhymeModeData,
  StressCode,
  StressPack,
  ThesaurusEntry,
  ThesaurusPack,
} from "./dictPackCodec";

export {
  buildThesaurusByHead,
  packStressPattern,
  resolveDictId,
  unpackStressPattern,
  usageCodeToChar,
} from "./dictPackCodec";

type LazyBinStore<T> = {
  load: () => Promise<T>;
  isReady: () => boolean;
  get: () => T | null;
  __setForTests: (value: T | null) => void;
};

/**
 * Fetch a Vite `?url` binary asset and decode it (worker when available).
 */
export function createLazyBinData<T>(
  urlLoader: () => Promise<string>,
  kind: DictPackKind,
  project: (decoded: DecodedPack) => T,
): LazyBinStore<T> {
  let data: T | null = null;
  let dataPromise: Promise<T> | null = null;

  return {
    load() {
      if (data) return Promise.resolve(data);
      if (!dataPromise) {
        dataPromise = (async () => {
          try {
            const url = await urlLoader();
            const buffer = await fetchBinary(url);
            const decoded = await decodePackAsync(kind, buffer);
            data = project(decoded);
            return data;
          } catch (err) {
            dataPromise = null;
            throw err;
          }
        })();
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

async function fetchBinary(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`failed to fetch dict pack: ${res.status} ${url}`);
  }
  return new Uint8Array(await res.arrayBuffer());
}

async function decodePackAsync(
  kind: DictPackKind,
  buffer: Uint8Array,
): Promise<DecodedPack> {
  if (typeof Worker !== "undefined" && typeof window !== "undefined") {
    try {
      return await decodeInWorker(kind, buffer);
    } catch {
      // fall through to sync decode
    }
  }
  return decodePack(kind, buffer);
}

function decodeInWorker(
  kind: DictPackKind,
  buffer: Uint8Array,
): Promise<DecodedPack> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./dictPackDecode.worker.ts", import.meta.url),
      { type: "module" },
    );
    const copy = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );
    const timer = window.setTimeout(() => {
      worker.terminate();
      reject(new Error("dict pack worker timeout"));
    }, 30_000);
    worker.onmessage = (
      event: MessageEvent<DecodedPack | { error: string }>,
    ) => {
      window.clearTimeout(timer);
      worker.terminate();
      if (event.data && "error" in event.data) {
        reject(new Error(event.data.error));
        return;
      }
      resolve(event.data as DecodedPack);
    };
    worker.onerror = (err) => {
      window.clearTimeout(timer);
      worker.terminate();
      reject(err);
    };
    worker.postMessage({ kind, buffer: copy }, [copy]);
  });
}
