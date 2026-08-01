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
 * Same letter ⇒ should rhyme. Perfect beats end; neither ⇒ mismatch.
 * `X` is unrhymed.
 */
export function analyzeRhymeScheme(
  lines: readonly string[],
  schemePattern: string,
): RhymeSchemeLine[] {
  const packReady =
    isRhymeIndexReady("perfect") && isRhymeIndexReady("end");
  const endWords = lines.map(endWordOfLine);

  // First line index that established each letter (excluding X).
  const anchorByLetter = new Map<string, number>();

  const results: RhymeSchemeLine[] = lines.map((line, index) => {
    const letterRaw = rhymeLetterForLine(schemePattern, index);
    const letter = letterRaw ? letterRaw.toUpperCase() : null;
    const colorIndex = letterColorIndex(letter);
    const endWord = endWords[index] ?? null;

    if (!line.trim() || !endWord) {
      return { letter, colorIndex, status: "empty" as const, endWord: null };
    }

    if (!letter || letter === UNRHYMED) {
      return {
        letter: letter ?? UNRHYMED,
        colorIndex: -1,
        status: "open",
        endWord,
      };
    }

    if (!packReady) {
      return { letter, colorIndex, status: "unknown", endWord };
    }

    if (!hasAnyRhymeKeys(endWord)) {
      return { letter, colorIndex, status: "unknown", endWord };
    }

    const anchor = anchorByLetter.get(letter);
    if (anchor === undefined) {
      anchorByLetter.set(letter, index);
      return { letter, colorIndex, status: "open", endWord };
    }

    const anchorWord = endWords[anchor];
    if (!anchorWord) {
      return { letter, colorIndex, status: "open", endWord };
    }

    return {
      letter,
      colorIndex,
      status: classifyPair(endWord, anchorWord),
      endWord,
    };
  });

  // Retroactively mark anchors from their best peer result.
  const peerStatus = new Map<string, PeerMatchStatus>();
  for (const row of results) {
    if (!row.letter || row.letter === UNRHYMED) continue;
    if (
      row.status === "match" ||
      row.status === "endMatch" ||
      row.status === "mismatch"
    ) {
      peerStatus.set(
        row.letter,
        bestPeerStatus(peerStatus.get(row.letter), row.status),
      );
    }
  }

  return results.map((row, index) => {
    if (!row.letter || row.letter === UNRHYMED) return row;
    if (row.status !== "open") return row;
    if (anchorByLetter.get(row.letter) !== index) return row;
    const peer = peerStatus.get(row.letter);
    if (!peer) return row;
    return { ...row, status: peer };
  });
}
