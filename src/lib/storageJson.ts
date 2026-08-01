/** Tiny localStorage JSON helpers shared by prefs + projects. No store framework. */

export function isQuotaExceededError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

export type ReadJsonResult =
  | { status: "missing" | "unavailable" }
  | { status: "ok"; raw: string; value: unknown }
  | { status: "corrupt"; raw: string };

export function readJson(
  storage: Pick<Storage, "getItem"> | null,
  key: string,
): ReadJsonResult {
  if (!storage) return { status: "unavailable" };
  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    return { status: "unavailable" };
  }
  if (!raw) return { status: "missing" };
  try {
    return { status: "ok", raw, value: JSON.parse(raw) as unknown };
  } catch {
    return { status: "corrupt", raw };
  }
}

export type WriteJsonResult =
  | { ok: true }
  | { ok: false; reason: "quota" | "unavailable"; error: unknown };

export function writeJson(
  storage: Pick<Storage, "setItem"> | null,
  key: string,
  value: unknown,
): WriteJsonResult {
  if (!storage) return { ok: false, reason: "unavailable", error: null };
  try {
    storage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: isQuotaExceededError(error) ? "quota" : "unavailable",
      error,
    };
  }
}
