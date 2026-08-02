import { describe, expect, it } from "vitest";

import {
  ABOUT_FEATURES,
  ABOUT_HERO,
  ABOUT_STANCE,
  ABOUT_WHY,
  type AboutPoem,
} from "./about";
import { resolveMeterConfig } from "@/lib/meters/presets";
import { countLine } from "@/lib/syllables";

const poems: AboutPoem[] = [
  ABOUT_HERO,
  ABOUT_WHY,
  ...ABOUT_FEATURES,
  ABOUT_STANCE,
];

describe("about page verse samples", () => {
  it.each(poems.map((poem) => [poem.label, poem] as const))(
    "%s lines match meter targets (or intentional over)",
    (_label, poem) => {
      const lines = poem.text.replace(/\r\n/g, "\n").split("\n");
      const config = resolveMeterConfig({
        meter: poem.settings.meter,
        customPattern: poem.settings.customPattern,
        customFoot: poem.settings.customFoot,
        customRhymePattern: poem.settings.customRhymePattern,
      });
      expect(config.pattern.length).toBeGreaterThan(0);

      for (let i = 0; i < lines.length; i++) {
        const total = countLine(lines[i] ?? "").total;
        const target = config.pattern[i % config.pattern.length]!;
        if (poem.label === "When it runs long") {
          expect(total).toBeGreaterThan(target);
        } else {
          expect(total).toBe(target);
        }
      }
    },
  );
});
