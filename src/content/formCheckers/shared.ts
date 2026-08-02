import type { FootId } from "@/lib/meters/feet";
import { FOOT_LABELS } from "@/lib/meters/feet";
import {
  listFormCheckerMeters,
  stressExplainerIdForEntry,
} from "@/lib/meters/presets";

import type { Explainer } from "./types";

function stubExplainer(id: string, title: string, blurb: string): Explainer {
  return {
    id,
    title,
    body: [blurb],
    status: "stub",
  };
}

function readyExplainer(
  id: string,
  title: string,
  body: string[],
): Explainer {
  return { id, title, body, status: "ready" };
}

export const FOOT_EXPLAINERS: Record<FootId, Explainer> = {
  iamb: readyExplainer("iamb", "Iamb (da-DUM)", [
    "An iamb is a two-syllable foot with a light beat then a strong one: da-DUM. Everyday words such as “today,” “because,” and “away” often fall into that shape.",
    "Stack iambs and you get iambic meter. Three feet make trimeter (six syllables), four make tetrameter (eight), five make pentameter (ten)—the backbone of blank verse, sonnets, and much English lyric.",
    "When stress-aware checking is on, lyriic marks the expected weak–strong pairs from dictionary stress and compares them to the meter’s contour. Real speech bends the ideal; the marks show the target pattern, not a claim that every poem must be perfectly regular.",
  ]),
  trochee: readyExplainer("trochee", "Trochee (DUM-da)", [
    "A trochee is a two-syllable foot with a strong beat then a light one: DUM-da. Words like “garden,” “poetry,” and “falling” often open on that falling rhythm.",
    "Repeated trochees make trochaic meter—tetrameter (eight syllables) is common in song and children’s verse; longer lines appear in hymns and narrative. English poets often drop or lighten a final weak syllable, so lines may feel truncated compared with a pure foot grid.",
    "With the stress pack loaded, lyriic marks expected strong–weak beats from dictionary stress against that trochaic contour, so you can see where the line matches or drifts.",
  ]),
  anapest: readyExplainer("anapest", "Anapest (da-da-DUM)", [
    "An anapest is a three-syllable foot with two light beats then a strong one: da-da-DUM. Phrases such as “in the dark” or “intervene” show the rising triple feel.",
    "Anapestic meter builds line length by feet: trimeter is nine syllables, tetrameter twelve. The gallop suits comic and narrative verse (think limerick energy or “’Twas the night before Christmas”), though poets freely substitute iambs and other feet.",
    "When stress-aware, lyriic expects that two-weak-then-strong cycle from the dictionary and flags where spoken stress departs from the ideal grid.",
  ]),
  dactyl: readyExplainer("dactyl", "Dactyl (DUM-da-da)", [
    "A dactyl is a three-syllable foot with a strong beat then two light ones: DUM-da-da. The name comes from the Greek for “finger”—one long joint, two shorter. Words like “merrily” and “poetry” (in some pronunciations) sketch the shape.",
    "Dactylic tetrameter runs twelve syllables; classical dactylic hexameter is six feet. English “hexameter” is an approximation of a Greek and Latin quantitative form, and poets often mix in spondees or truncated endings rather than six pure dactyls.",
    "lyriic’s stress-aware view repeats the strong–weak–weak unit across the line and compares dictionary stress to that contour when the stress pack is available.",
  ]),
  amphibrach: readyExplainer("amphibrach", "Amphibrach (da-DUM-da)", [
    "An amphibrach is a three-syllable foot with a light–strong–light contour: da-DUM-da. Words such as “together,” “remember,” and “amazing” often sit in that rocking shape.",
    "It is less common as a named English meter than iambs or anapests, but amphibrachic lines turn up in song, limericks (under some scansions), and comic verse. Four amphibrachs make a twelve-syllable tetrameter line.",
    "When stress checking is enabled, lyriic marks the expected weak–strong–weak cycle from dictionary stress so you can hear the rocking pattern against your draft.",
  ]),
};

function collectStressExplainerIds(): string[] {
  const ids = new Set<string>();
  for (const entry of listFormCheckerMeters()) {
    const id = stressExplainerIdForEntry(entry);
    if (id) ids.add(id);
  }
  return [...ids].sort();
}

function stressTitle(id: string): string {
  const [foot, ...rest] = id.split("-");
  const footLabel =
    foot && foot in FOOT_LABELS
      ? FOOT_LABELS[foot as FootId]
      : (foot ?? "Stress");
  if (rest.length === 1 && /^\d+$/.test(rest[0]!)) {
    return `${footLabel} ${rest[0]}-foot contour`;
  }
  return `${footLabel} stress pattern (${rest.join(" / ")})`;
}

/** Authored stress-contour explainers keyed by stressExplainerId. */
const STRESS_EXPLAINER_BODIES: Record<string, string[]> = {
  "amphibrach-4": [
    "Amphibrachic tetrameter expects four da-DUM-da feet: twelve syllables with strong beats on positions 2, 5, 8, and 11 (weak–strong–weak, repeated).",
    "lyriic checks this contour when the stress pack is loaded. A trailing feminine syllable counts as on-meter; dropped final weaks and harder speech disagreements still surface as stress feedback.",
  ],
  "anapest-3": [
    "Anapestic trimeter expects three da-da-DUM feet: nine syllables with strong beats on positions 3, 6, and 9.",
    "When the stress pack is loaded, lyriic marks that rising triple contour against dictionary stress for each nine-syllable line.",
  ],
  "anapest-4": [
    "Anapestic tetrameter expects four da-da-DUM feet: twelve syllables with strong beats on positions 3, 6, 9, and 12.",
    "lyriic checks this contour when the stress pack is loaded, so you can see where spoken stress matches or leaves the galloping pattern.",
  ],
  "dactyl-4": [
    "Dactylic tetrameter expects four DUM-da-da feet: twelve syllables with strong beats on positions 1, 4, 7, and 10.",
    "With the stress pack loaded, lyriic compares dictionary stress to that falling triple contour. Catalexis (−1/−2 trailing weaks) counts as on-meter; harder disagreements still surface as stress feedback.",
  ],
  "dactyl-6": [
    "Dactylic hexameter, as modeled here, expects six DUM-da-da feet: eighteen syllables with strong beats on positions 1, 4, 7, 10, 13, and 16. Classical hexameter often allows substitutions and a shorter final foot; lyriic’s catalog uses a regular dactylic grid.",
    "When the stress pack is loaded, lyriic checks dictionary stress against that eighteen-slot contour. Catalexis (−1/−2 trailing weaks) counts as on-meter; classical spondees and quantity stay out of scope.",
  ],
  "iamb-3": [
    "Iambic trimeter expects three da-DUM feet: six syllables with strong beats on positions 2, 4, and 6.",
    "lyriic checks this weak–strong contour when the stress pack is loaded. First-foot inversion and a feminine seventh syllable count as on-meter; stronger disagreements still surface as stress feedback.",
  ],
  "iamb-4": [
    "Iambic tetrameter expects four da-DUM feet: eight syllables with strong beats on positions 2, 4, 6, and 8.",
    "When the stress pack is loaded, lyriic marks that rising duple pattern. First-foot inversion and a feminine ninth syllable count as on-meter; stronger disagreements still surface as stress feedback.",
  ],
  "iamb-5": [
    "Iambic pentameter expects five da-DUM feet: ten syllables with strong beats on positions 2, 4, 6, 8, and 10. It is the default contour for blank verse, English sonnets, and heroic couplets in this catalog.",
    "lyriic checks that ten-slot weak–strong grid when the stress pack is loaded. Common literary moves — first-foot inversion and a feminine eleventh syllable — count as on-meter; stronger disagreements still surface as stress feedback.",
  ],
  "iamb-6": [
    "Iambic hexameter (alexandrine-style in English teaching) expects six da-DUM feet: twelve syllables with strong beats on positions 2, 4, 6, 8, 10, and 12.",
    "With the stress pack loaded, lyriic compares dictionary stress to that twelve-syllable iambic contour. First-foot inversion and a feminine thirteenth syllable count as on-meter; stronger disagreements still surface as stress feedback.",
  ],
  "iamb-6-6-8-6": [
    "Short meter (S.M.) is iambic 6 / 6 / 8 / 6: three-foot lines stress positions 2, 4, and 6; the eight-syllable third line adds a fourth foot with strong beats on 2, 4, 6, and 8.",
    "lyriic checks that 6.6.8.6 weak–strong contour when the stress pack is loaded. First-foot inversions and feminine endings count as on-meter; rhyme schemes and tune pairing are not enforced.",
  ],
  "iamb-8-6": [
    "Common meter alternates an eight-syllable iambic line with a six-syllable one. The long line has strong beats on 2, 4, 6, and 8; the short line on 2, 4, and 6.",
    "When the stress pack is loaded, lyriic checks that 8 / 6 iambic contour line by line. First-foot inversions and feminine endings count as on-meter; harder substitutions still surface as stress feedback.",
  ],
  "iamb-8-6-8-6": [
    "A ballad-stanza (common-meter quatrain) cycle is iambic 8 / 6 / 8 / 6: long lines stress even positions through eight syllables; short lines do the same through six.",
    "lyriic checks that repeating contour when the stress pack is loaded. First-foot inversions and feminine endings count as on-meter; rhyme schemes (often ABCB or ABAB) are not enforced.",
  ],
  "iamb-8-8": [
    "Long meter is paired eight-syllable iambic lines. Each line expects four da-DUM feet: strong beats on positions 2, 4, 6, and 8.",
    "With the stress pack loaded, lyriic marks that 8 / 8 iambic contour. First-foot inversions and feminine endings count as on-meter; harder disagreements still surface as stress feedback.",
  ],
  "trochee-4": [
    "Trochaic tetrameter expects four DUM-da feet: eight syllables with strong beats on positions 1, 3, 5, and 7.",
    "lyriic checks this falling duple contour when the stress pack is loaded. Catalexis (seven syllables ending strong) and first-foot inversion count as on-meter; harder disagreements still surface as stress feedback.",
  ],
  "trochee-8": [
    "Trochaic octameter expects eight DUM-da feet: sixteen syllables with strong beats on the odd positions (1, 3, 5, …, 15).",
    "When the stress pack is loaded, lyriic compares dictionary stress to that long falling contour. Catalexis (fifteen syllables ending strong) and first-foot inversion count as on-meter; harder drifts still flag as stress feedback.",
  ],
  "trochee-8-7": [
    "Classic 8s & 7s hymn meter is trochaic: an eight-syllable line (strong on odd positions 1–7) alternating with a seven-syllable line that truncates after a final strong beat (1, 3, 5, 7). Odd lines end strong; the short line is catalectic.",
    "lyriic checks that 8 / 7 trochaic contour when the stress pack is loaded, filling then truncating the foot grid to each line length.",
  ],
};

export const STRESS_EXPLAINERS: Record<string, Explainer> =
  Object.fromEntries(
    collectStressExplainerIds().map((id) => {
      const body = STRESS_EXPLAINER_BODIES[id];
      if (body) {
        return [id, readyExplainer(id, stressTitle(id), body)];
      }
      return [
        id,
        stubExplainer(
          id,
          stressTitle(id),
          `Stub stress-pattern explainer for ${id}. Describe the expected strong/weak contour line by line.`,
        ),
      ];
    }),
  );

/** Meter-level explainers keyed by meterExplainerId (often the meter id). */
export const METER_EXPLAINERS: Record<string, Explainer> =
  Object.fromEntries(
    listFormCheckerMeters().map((entry) => {
      const pattern = entry.pattern.join(" · ");
      return [
        entry.id,
        stubExplainer(
          entry.id,
          `How ${entry.label} works`,
          `Stub meter explainer for ${entry.label} (${pattern}). Describe the line cycle and teaching conventions.`,
        ),
      ];
    }),
  );

/** Shared explainer for English 5-7-5 teaching forms (haiku / senryu). */
METER_EXPLAINERS["syllable-5-7-5"] = readyExplainer(
  "syllable-5-7-5",
  "The 5 · 7 · 5 syllable cycle",
  [
    "In English classrooms and workshops, a three-line poem is often taught as five syllables, then seven, then five—seventeen syllables in all. lyriic’s Haiku and Senryu meters use that same cycle for live syllable checking.",
    "Traditional Japanese haiku is measured in on (sound units, sometimes discussed as morae), not English syllables. An on is often shorter than a typical English syllable, so a 17-on Japanese poem is usually briefer than a padded 5-7-5 English draft. Many contemporary English haiku writers prefer a shorter, image-first shape rather than a strict seventeen-syllable count.",
    "Treat 5 · 7 · 5 here as a useful teaching grid: lyriic counts English syllables from the bundled dictionary and does not model Japanese on, seasonal words (kigo), or cutting words (kireji).",
  ],
);

export function getFootExplainer(id: FootId | undefined): Explainer | null {
  if (!id) return null;
  return FOOT_EXPLAINERS[id] ?? null;
}

export function getStressExplainer(id: string | undefined): Explainer | null {
  if (!id) return null;
  return STRESS_EXPLAINERS[id] ?? null;
}

export function getMeterExplainer(id: string | undefined): Explainer | null {
  if (!id) return null;
  return METER_EXPLAINERS[id] ?? null;
}
