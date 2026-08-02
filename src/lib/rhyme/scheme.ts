import { rhymeLetterForLine } from "@/lib/meters/presets";
import { tokenizeLine } from "@/lib/syllables/tokenize";

import {
  isRhymeIndexReady,
  rhymeKeyIds,
  wordsRhyme,
} from "./lookup";

export type RhymeLineStatus =
  | "empty"
  | "unknown"
  | "open"
  | "match"
  | "endMatch"
  | "mismatch";

export type RhymeSchemeLine = {
  readonly letter: string | null;
  /** 0-based palette index from A–Z (X and null → -1). */
  readonly colorIndex: number;
  readonly status: RhymeLineStatus;
  readonly endWord: string | null;
};

const UNRHYMED = "X";

type PeerMatchStatus = "match" | "endMatch" | "mismatch";

/** Last dictionary-normalized word on a poetic line, or null if none. */
export function endWordOfLine(line: string): string | null {
  const tokens = tokenizeLine(line);
  if (tokens.length === 0) return null;
  return tokens[tokens.length - 1]?.word ?? null;
}

/** Short label for rhyme-dot tooltips (scheme letter + status). */
export function rhymeSchemeLineTitle(line: RhymeSchemeLine): string {
  const letter = line.letter ?? "?";
  if (line.status === "mismatch") {
    return `Rhyme ${letter} — does not match peers`;
  }
  if (line.status === "match") {
    return `Rhyme ${letter} — perfect`;
  }
  if (line.status === "endMatch") {
    return `Rhyme ${letter} — end rhyme`;
  }
  if (line.status === "unknown") {
    return `Rhyme ${letter} — word not in dictionary`;
  }
  if (letter === "X") return "Unrhymed line";
  return `Rhyme ${letter}`;
}

function letterColorIndex(letter: string | null): number {
  if (!letter || letter === UNRHYMED) return -1;
  const upper = letter.toUpperCase();
  const code = upper.charCodeAt(0);
  if (code < 65 || code > 90) return -1;
  return code - 65;
}

/** Prefer perfect over end over mismatch when summarizing an anchor's peers. */
function bestPeerStatus(
  prev: PeerMatchStatus | undefined,
  next: PeerMatchStatus,
): PeerMatchStatus {
  const rank: Record<PeerMatchStatus, number> = {
    match: 3,
    endMatch: 2,
    mismatch: 1,
  };
  if (!prev) return next;
  return rank[next] > rank[prev] ? next : prev;
}

function classifyPair(a: string, b: string): PeerMatchStatus {
  if (wordsRhyme(a, b, "perfect")) return "match";
  if (wordsRhyme(a, b, "end")) return "endMatch";
  return "mismatch";
}

function hasAnyRhymeKeys(word: string): boolean {
  return (
    rhymeKeyIds(word, "perfect").length > 0 ||
    rhymeKeyIds(word, "end").length > 0
  );
}

/**
 * Compare end words of each line against a cycling scheme pattern.
 * Same letter ⇒ should rhyme within one pattern period. Perfect beats end;
 * neither ⇒ mismatch. `X` is unrhymed. Blank lines do not consume scheme
 * slots; anchors reset each period so multi-couplet / multi-stanza drafts
 * match independently.
 */
export function analyzeRhymeScheme(
  lines: readonly string[],
  schemePattern: string,
): RhymeSchemeLine[] {
  const packReady =
    isRhymeIndexReady("perfect") && isRhymeIndexReady("end");
  const endWords = lines.map(endWordOfLine);
  const period = schemePattern.length;

  // schemeSlot → doc line index of the first non-empty line for that letter
  // in the current period. Cleared every `period` non-empty lines.
  const anchorByLetter = new Map<string, number>();
  // schemeSlot key → peer status (for retroactive anchor coloring).
  const peerStatus = new Map<string, PeerMatchStatus>();
  // schemeSlot key → doc index of the period's anchor for that letter.
  const periodAnchors = new Map<string, number>();

  let schemeSlot = 0;
  const results: RhymeSchemeLine[] = [];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] ?? "";
    const endWord = endWords[index] ?? null;

    if (!line.trim() || !endWord) {
      results.push({
        letter: null,
        colorIndex: -1,
        status: "empty",
        endWord: null,
      });
      continue;
    }

    if (period > 0 && schemeSlot > 0 && schemeSlot % period === 0) {
      anchorByLetter.clear();
    }

    const letterRaw = rhymeLetterForLine(schemePattern, schemeSlot);
    const letter = letterRaw ? letterRaw.toUpperCase() : null;
    const colorIndex = letterColorIndex(letter);
    const periodIndex = period > 0 ? Math.floor(schemeSlot / period) : 0;
    const slotKey = `${periodIndex}:${letter ?? ""}`;
    schemeSlot += 1;

    if (!letter || letter === UNRHYMED) {
      results.push({
        letter: letter ?? UNRHYMED,
        colorIndex: -1,
        status: "open",
        endWord,
      });
      continue;
    }

    if (!packReady) {
      results.push({ letter, colorIndex, status: "unknown", endWord });
      continue;
    }

    if (!hasAnyRhymeKeys(endWord)) {
      results.push({ letter, colorIndex, status: "unknown", endWord });
      continue;
    }

    const anchor = anchorByLetter.get(letter);
    if (anchor === undefined) {
      anchorByLetter.set(letter, index);
      periodAnchors.set(slotKey, index);
      results.push({ letter, colorIndex, status: "open", endWord });
      continue;
    }

    const anchorWord = endWords[anchor];
    if (!anchorWord) {
      results.push({ letter, colorIndex, status: "open", endWord });
      continue;
    }

    const status = classifyPair(endWord, anchorWord);
    peerStatus.set(slotKey, bestPeerStatus(peerStatus.get(slotKey), status));
    results.push({ letter, colorIndex, status, endWord });
  }

  return results.map((row, index) => {
    if (!row.letter || row.letter === UNRHYMED) return row;
    if (row.status !== "open") return row;
    // Find which period-slot this open row anchored.
    for (const [slotKey, anchorIndex] of periodAnchors) {
      if (anchorIndex !== index) continue;
      const peer = peerStatus.get(slotKey);
      if (!peer) return row;
      return { ...row, status: peer };
    }
    return row;
  });
}
