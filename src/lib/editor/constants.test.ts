import { describe, expect, it } from "vitest";

import {
  CONTENT_PAD_BOTTOM_MARKS_EM,
  CONTENT_PAD_TOP_MARKS_EM,
  LINE_GAP_COMPACT_EM,
  LINE_GAP_EM,
  MARK_BAND_BOTTOM_EM,
  MARK_BAND_TOP_EM,
  STRESS_CLEARANCE_EM,
  STRESS_CLEARANCE_MARK_EM,
  STRESS_MARK_EM,
  STRESS_MARK_OFF_EM,
  TEXT_LEADING,
  TICK_HANG_EM,
  TICK_HEIGHT_EM,
  TICK_OVER_HEIGHT_EM,
  TICK_TARGET_HEIGHT_EM,
  WRAP_LEADING,
} from "./constants";

describe("mark geometry bands", () => {
  it("derives WRAP_LEADING from text leading + mark bands", () => {
    expect(WRAP_LEADING).toBe(
      TEXT_LEADING + MARK_BAND_TOP_EM + MARK_BAND_BOTTOM_EM,
    );
  });

  it("keeps top band large enough for stress marks + clearance", () => {
    expect(MARK_BAND_TOP_EM).toBeGreaterThanOrEqual(
      STRESS_MARK_EM + STRESS_CLEARANCE_EM,
    );
    expect(CONTENT_PAD_TOP_MARKS_EM).toBe(MARK_BAND_TOP_EM);
  });

  it("keeps bottom band large enough for hung target ticks", () => {
    expect(MARK_BAND_BOTTOM_EM).toBeGreaterThanOrEqual(
      TICK_HANG_EM + TICK_TARGET_HEIGHT_EM,
    );
    expect(CONTENT_PAD_BOTTOM_MARKS_EM).toBe(MARK_BAND_BOTTOM_EM);
  });

  it("sizes line gap to clear hung ticks between hard lines", () => {
    expect(LINE_GAP_EM).toBeGreaterThanOrEqual(
      TICK_HANG_EM + TICK_TARGET_HEIGHT_EM,
    );
    expect(LINE_GAP_EM).toBeGreaterThan(LINE_GAP_COMPACT_EM);
  });

  it("keeps CSS mark-relative clearance in sync with editor-em clearance", () => {
    expect(STRESS_CLEARANCE_MARK_EM).toBeCloseTo(
      STRESS_CLEARANCE_EM / STRESS_MARK_EM,
      5,
    );
  });

  it("keeps tick size ordering: base < over < target", () => {
    expect(TICK_HEIGHT_EM).toBeLessThan(TICK_OVER_HEIGHT_EM);
    expect(TICK_OVER_HEIGHT_EM).toBeLessThanOrEqual(TICK_TARGET_HEIGHT_EM);
    expect(STRESS_MARK_OFF_EM).toBeGreaterThan(STRESS_MARK_EM);
  });
});
