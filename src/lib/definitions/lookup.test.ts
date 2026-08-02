import { afterEach, describe, expect, it } from "vitest";

import {
  __setDefinitionsForTests,
  loadDefinitions,
  lookupDefinitions,
} from "./lookup";

describe("definition form resolution", () => {
  afterEach(() => {
    __setDefinitionsForTests(null);
  });

  it("falls back to an inflectional base when the surface has no senses", async () => {
    __setDefinitionsForTests({
      run: [
        {
          usage: "v",
          source: "oewn",
          gloss: "move fast by using one's feet",
        },
      ],
    });
    const result = await loadDefinitions("running");
    expect(result.lemma).toBe("run");
    expect(result.senses).toHaveLength(1);
    expect(result.senses[0]?.gloss).toContain("move fast");
  });

  it("prefers the surface form when it has senses", async () => {
    __setDefinitionsForTests({
      running: [
        { usage: "a", source: "oewn", gloss: "in operation" },
      ],
      run: [
        { usage: "v", source: "oewn", gloss: "move fast" },
      ],
    });
    const result = await loadDefinitions("running");
    expect(result.lemma).toBe("running");
    expect(result.senses[0]?.gloss).toBe("in operation");
  });

  it("strips punctuation from the query", async () => {
    __setDefinitionsForTests({
      hello: [{ usage: "n", source: "oewn", gloss: "a greeting" }],
    });
    const result = await loadDefinitions("hello!");
    expect(result.lemma).toBe("hello");
    expect(result.senses).toHaveLength(1);
  });

  it("lookupDefinitions mirrors loadDefinitions under tests", () => {
    __setDefinitionsForTests({
      leave: [{ usage: "v", source: "oewn", gloss: "go away" }],
    });
    const result = lookupDefinitions("leaves");
    expect(result.lemma).toBe("leave");
    expect(result.senses[0]?.gloss).toBe("go away");
  });
});
