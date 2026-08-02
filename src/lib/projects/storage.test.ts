import { describe, expect, it } from "vitest";

import { STORAGE_KEY, hasPersistedDraft } from "./storage";

function memoryStorage(
  initial: Record<string, string> = {},
): Pick<Storage, "getItem" | "setItem" | "removeItem"> {
  const map = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
  };
}

describe("hasPersistedDraft", () => {
  it("is false when storage is null", () => {
    expect(hasPersistedDraft(null)).toBe(false);
  });

  it("is false when the projects key is missing", () => {
    expect(hasPersistedDraft(memoryStorage())).toBe(false);
  });

  it("is true when the projects key is present", () => {
    expect(
      hasPersistedDraft(memoryStorage({ [STORAGE_KEY]: "{}" })),
    ).toBe(true);
  });

  it("is true even when the payload is corrupt", () => {
    expect(
      hasPersistedDraft(memoryStorage({ [STORAGE_KEY]: "not-json" })),
    ).toBe(true);
  });

  it("is false when getItem throws", () => {
    expect(
      hasPersistedDraft({
        getItem() {
          throw new Error("denied");
        },
      }),
    ).toBe(false);
  });
});
