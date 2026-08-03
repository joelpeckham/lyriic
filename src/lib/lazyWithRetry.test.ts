import { describe, expect, it, vi } from "vitest";

import { importWithRetry } from "./lazyWithRetry";

describe("importWithRetry", () => {
  it("returns the value on the first successful call", async () => {
    const factory = vi.fn(async () => "ok");
    await expect(importWithRetry(factory)).resolves.toBe("ok");
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("retries once after a failure, then succeeds", async () => {
    vi.useFakeTimers();
    const factory = vi
      .fn()
      .mockRejectedValueOnce(new Error("chunk failed"))
      .mockResolvedValueOnce("ok");

    const promise = importWithRetry(factory);
    await vi.advanceTimersByTimeAsync(300);
    await expect(promise).resolves.toBe("ok");
    expect(factory).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("rethrows after exhausting retries", async () => {
    vi.useFakeTimers();
    const error = new Error("chunk failed");
    const factory = vi.fn().mockRejectedValue(error);

    const promise = importWithRetry(factory, 1);
    // Attach rejection handler before advancing timers so the final throw is not unhandled.
    const expectation = expect(promise).rejects.toBe(error);
    await vi.advanceTimersByTimeAsync(300);
    await expectation;
    expect(factory).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
