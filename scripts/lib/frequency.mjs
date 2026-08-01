/**
 * Zipf frequency via Python wordfreq (build-time only).
 * Requires: pip install wordfreq
 */

import { spawnSync } from "node:child_process";

/**
 * @param {Iterable<string>} words
 * @returns {Map<string, number>}
 */
export function zipfFrequencies(words) {
  const list = [...new Set(words)];
  if (list.length === 0) return new Map();

  const payload = `${JSON.stringify(list)}\n`;
  const result = spawnSync(
    "python3",
    [
      "-c",
      [
        "import json,sys",
        "from wordfreq import zipf_frequency",
        "words=json.load(sys.stdin)",
        "print(json.dumps([zipf_frequency(w,'en') for w in words]))",
      ].join("; "),
    ],
    {
      input: payload,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  );

  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim();
    throw new Error(
      `wordfreq lookup failed (install with: pip install wordfreq)\n${err}`,
    );
  }

  /** @type {number[]} */
  const scores = JSON.parse(result.stdout);
  /** @type {Map<string, number>} */
  const map = new Map();
  for (let i = 0; i < list.length; i += 1) {
    map.set(list[i], scores[i] ?? 0);
  }
  return map;
}

/**
 * Sort lemmas by descending Zipf, then shorter, then alpha.
 *
 * @param {string[]} words
 * @param {Map<string, number>} freq
 * @param {number} limit
 * @returns {string[]}
 */
export function selectByFrequency(words, freq, limit) {
  const seen = new Set();
  /** @type {string[]} */
  const clean = [];
  for (const word of words) {
    if (!word || seen.has(word)) continue;
    seen.add(word);
    clean.push(word);
  }
  clean.sort((a, b) => {
    const fa = freq.get(a) ?? 0;
    const fb = freq.get(b) ?? 0;
    if (fb !== fa) return fb - fa;
    if (a.length !== b.length) return a.length - b.length;
    return a.localeCompare(b);
  });
  return clean.slice(0, limit);
}
