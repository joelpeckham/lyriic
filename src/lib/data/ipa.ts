/**
 * Lazy-loaded primary display IPA pack (ipa.bin), aligned with lexicon ids.
 */

import { createLazyBinData, type IpaPack } from "@/lib/data/dictPack";
import { getLexicon, loadLexicon } from "@/lib/data/lexicon";
import { normalizeLookupKey, normalizeWord } from "@/lib/syllables/normalize";

export type { IpaPack };

const store = createLazyBinData<IpaPack>(
  () => import("./packs/ipa.bin?url").then((m) => m.default as string),
  "ipa",
  (decoded) => {
    if (decoded.kind !== "ipa") {
      throw new Error("expected ipa pack");
    }
    const lex = getLexicon();
    if (lex && decoded.data.ipas.length !== lex.words.length) {
      throw new Error(
        `ipa pack length ${decoded.data.ipas.length} !== lexicon ${lex.words.length}`,
      );
    }
    return decoded.data;
  },
);

let revision = 0;
let readyAnnounced = false;
const listeners = new Set<() => void>();

/** Monotonic revision bumped when the IPA pack becomes ready or is replaced in tests. */
export function getIpaRevision(): number {
  return revision;
}

/** Subscribe to IPA-ready / test-inject notifications. Returns unsubscribe. */
export function subscribeIpaReady(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyReady(): void {
  for (const listener of listeners) listener();
}

function announceReady(): void {
  revision += 1;
  readyAnnounced = true;
  notifyReady();
}

function bumpRevision(): void {
  revision += 1;
  notifyReady();
}

/** Lazy-load the IPA pack (requires lexicon for word-id alignment). */
export function loadIpa(): Promise<IpaPack> {
  return loadLexicon().then(() =>
    store.load().then((pack) => {
      const lex = getLexicon();
      if (lex && pack.ipas.length !== lex.words.length) {
        throw new Error(
          `ipa pack length ${pack.ipas.length} !== lexicon ${lex.words.length}`,
        );
      }
      if (!readyAnnounced) announceReady();
      return pack;
    }),
  );
}

export function isIpaReady(): boolean {
  return store.isReady();
}

export function getIpaPack(): IpaPack | null {
  return store.get();
}

/** IPA string for a lexicon word id, or undefined when missing/empty. */
export function ipaForId(id: number): string | undefined {
  const pack = store.get();
  if (!pack || id < 0 || id >= pack.ipas.length) return undefined;
  const ipa = pack.ipas[id];
  return ipa ? ipa : undefined;
}

/**
 * Look up primary display IPA for a word (normalized lookup key).
 * Returns undefined when the pack is unloaded or the word has no IPA.
 */
export function lookupIpa(word: string): string | undefined {
  const lex = getLexicon();
  const pack = store.get();
  if (!lex || !pack) return undefined;

  const key = normalizeLookupKey(normalizeWord(word));
  if (!key) return undefined;

  const id = lex.wordToId.get(key);
  if (id === undefined || id >= pack.ipas.length) return undefined;
  const ipa = pack.ipas[id];
  return ipa ? ipa : undefined;
}

/** Test helper — inject a decoded IPA pack without hitting the binary. */
export function __setIpaForTests(pack: IpaPack | null): void {
  store.__setForTests(pack);
  if (pack === null) {
    readyAnnounced = false;
    bumpRevision();
    return;
  }
  announceReady();
}
