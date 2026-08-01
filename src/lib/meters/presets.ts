import {
  buildStressFromFeet,
  stressPatternsForCycle,
  type BinaryStressPattern,
  type CustomFootId,
  type FootId,
} from "./feet";

export type { BinaryStressPattern } from "./feet";

export type MeterGroupId =
  | "free"
  | "accentual"
  | "ballad"
  | "syllable"
  | "custom";

export const METER_GROUP_LABELS: Record<MeterGroupId, string> = {
  free: "Free",
  accentual: "Accentual-syllabic",
  ballad: "Song / ballad",
  syllable: "Syllable forms",
  custom: "Custom",
};

export type MeterConfig = {
  readonly id: string;
  readonly label: string;
  /** Target syllables per line in cycle order. Empty = no targets. */
  readonly pattern: readonly number[];
  /**
   * Expected binary stress per line in cycle order (same length as that
   * line’s syllable target). Empty / omitted = syllable-count only.
   */
  readonly stressPatterns?: readonly BinaryStressPattern[];
  /** Soft expected lines per stanza/poem; null/undefined = unbounded. */
  readonly stanzaLines?: number | null;
  readonly description: string;
};

/** Catalog entry shown in Settings (excludes runtime-only custom resolution). */
export type MeterCatalogEntry = MeterConfig & {
  readonly group: MeterGroupId;
};

/** @deprecated Use catalog string ids. Kept for gradual call-site migration. */
export type MeterPresetId = string;

/** @deprecated Prefer MeterCatalogEntry / MeterConfig. */
export type MeterPreset = MeterCatalogEntry;

function accentual(
  id: string,
  label: string,
  foot: FootId,
  feetPerLine: number,
  description: string,
  stanzaLines?: number | null,
): MeterCatalogEntry {
  const stress = buildStressFromFeet(foot, feetPerLine);
  return {
    id,
    label,
    group: "accentual",
    pattern: [stress.length],
    stressPatterns: [stress],
    description,
    stanzaLines: stanzaLines ?? null,
  };
}

function ballad(
  id: string,
  label: string,
  pattern: readonly number[],
  description: string,
  stanzaLines: number | null = 4,
): MeterCatalogEntry {
  const stressPatterns = stressPatternsForCycle("iamb", pattern);
  return {
    id,
    label,
    group: "ballad",
    pattern,
    stressPatterns,
    description,
    stanzaLines,
  };
}

function syllableForm(
  id: string,
  label: string,
  pattern: readonly number[],
  description: string,
  stanzaLines?: number | null,
): MeterCatalogEntry {
  return {
    id,
    label,
    group: "syllable",
    pattern,
    description,
    stanzaLines: stanzaLines ?? pattern.length,
  };
}

export const METER_CATALOG: readonly MeterCatalogEntry[] = [
  {
    id: "none",
    label: "None",
    group: "free",
    pattern: [],
    description: "Syllable counts only",
    stanzaLines: null,
  },

  // Accentual-syllabic
  accentual(
    "iambic-trimeter",
    "Iambic trimeter",
    "iamb",
    3,
    "6 syllables, unstressed–stressed",
  ),
  accentual(
    "iambic-tetrameter",
    "Iambic tetrameter",
    "iamb",
    4,
    "8 syllables, unstressed–stressed",
  ),
  accentual(
    "iambic-pentameter",
    "Iambic pentameter",
    "iamb",
    5,
    "10 syllables, unstressed–stressed feet",
  ),
  {
    id: "blank-verse",
    label: "Blank verse",
    group: "accentual",
    pattern: [10],
    stressPatterns: [buildStressFromFeet("iamb", 5)],
    description: "Unrhymed iambic pentameter",
    stanzaLines: null,
  },
  {
    id: "sonnet",
    label: "Sonnet (iambic pentameter)",
    group: "accentual",
    pattern: [10],
    stressPatterns: [buildStressFromFeet("iamb", 5)],
    description: "14 lines of iambic pentameter",
    stanzaLines: 14,
  },
  accentual(
    "iambic-hexameter",
    "Iambic hexameter",
    "iamb",
    6,
    "12 syllables, unstressed–stressed",
  ),
  accentual(
    "trochaic-tetrameter",
    "Trochaic tetrameter",
    "trochee",
    4,
    "8 syllables, stressed–unstressed",
  ),
  accentual(
    "trochaic-octameter",
    "Trochaic octameter",
    "trochee",
    8,
    "16 syllables, stressed–unstressed",
  ),
  accentual(
    "anapestic-trimeter",
    "Anapestic trimeter",
    "anapest",
    3,
    "9 syllables, two light then strong",
  ),
  accentual(
    "anapestic-tetrameter",
    "Anapestic tetrameter",
    "anapest",
    4,
    "12 syllables, two light then strong",
  ),
  accentual(
    "dactylic-tetrameter",
    "Dactylic tetrameter",
    "dactyl",
    4,
    "12 syllables, strong then two light",
  ),
  accentual(
    "dactylic-hexameter",
    "Dactylic hexameter",
    "dactyl",
    6,
    "18 syllables, strong then two light",
  ),
  accentual(
    "amphibrachic-tetrameter",
    "Amphibrachic tetrameter",
    "amphibrach",
    4,
    "12 syllables, light–strong–light",
  ),
  {
    id: "heroic-couplet",
    label: "Heroic couplet",
    group: "accentual",
    pattern: [10],
    stressPatterns: [buildStressFromFeet("iamb", 5)],
    description: "Paired lines of iambic pentameter",
    stanzaLines: 2,
  },

  // Song / ballad
  ballad(
    "common-meter",
    "Common meter",
    [8, 6],
    "8 / 6 iambic ballad stanza",
    4,
  ),
  ballad("long-meter", "Long meter", [8, 8], "8 / 8 iambic hymn stanza", 4),
  ballad("short-meter", "Short meter", [6, 6], "6 / 6 iambic hymn stanza", 4),
  {
    id: "eights-and-sevens",
    label: "8s & 7s",
    group: "ballad",
    pattern: [8, 7],
    // Classic 8.7.8.7 hymn meter is trochaic (odd lines end strong).
    stressPatterns: stressPatternsForCycle("trochee", [8, 7]),
    description: "8 / 7 trochaic hymn meter",
    stanzaLines: 4,
  },
  {
    id: "ballad-stanza",
    label: "Ballad stanza",
    group: "ballad",
    pattern: [8, 6, 8, 6],
    stressPatterns: stressPatternsForCycle("iamb", [8, 6, 8, 6]),
    description: "Common-meter quatrain cycle",
    stanzaLines: 4,
  },

  // Syllable forms
  syllableForm("haiku", "Haiku", [5, 7, 5], "5 / 7 / 5", 3),
  syllableForm("senryu", "Senryu", [5, 7, 5], "5 / 7 / 5 (senryu)", 3),
  syllableForm("tanka", "Tanka", [5, 7, 5, 7, 7], "5 / 7 / 5 / 7 / 7", 5),
  syllableForm("katauta", "Katauta", [5, 7, 7], "5 / 7 / 7", 3),
  syllableForm("sedoka", "Sedoka", [5, 7, 7, 5, 7, 7], "Paired katauta", 6),
  syllableForm(
    "cinquain",
    "Cinquain",
    [2, 4, 6, 8, 2],
    "2 / 4 / 6 / 8 / 2",
    5,
  ),
  syllableForm(
    "nonet",
    "Nonet",
    [9, 8, 7, 6, 5, 4, 3, 2, 1],
    "9 down to 1",
    9,
  ),
  syllableForm(
    "etheree",
    "Etheree",
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "1 up to 10",
    10,
  ),
  syllableForm(
    "limerick",
    "Limerick",
    [8, 8, 5, 5, 8],
    "8 / 8 / 5 / 5 / 8 syllable shape",
    5,
  ),

  {
    id: "custom",
    label: "Custom",
    group: "custom",
    pattern: [8],
    description: "Your syllable cycle and optional foot",
    stanzaLines: null,
  },
] as const;

/** @deprecated Use METER_CATALOG. */
export const METER_PRESETS = METER_CATALOG;

const CATALOG_BY_ID = new Map(
  METER_CATALOG.map((entry) => [entry.id, entry] as const),
);

export function isMeterCatalogId(value: string): boolean {
  return CATALOG_BY_ID.has(value);
}

/** @deprecated Use isMeterCatalogId. */
export function isMeterPresetId(value: string): boolean {
  return isMeterCatalogId(value);
}

export function getMeterCatalogEntry(id: string): MeterCatalogEntry {
  return CATALOG_BY_ID.get(id) ?? CATALOG_BY_ID.get("none")!;
}

/** @deprecated Use getMeterCatalogEntry. */
export function getMeterPreset(id: string): MeterCatalogEntry {
  return getMeterCatalogEntry(id);
}

export function listMeterCatalogByGroup(): {
  group: MeterGroupId;
  label: string;
  entries: MeterCatalogEntry[];
}[] {
  const order: MeterGroupId[] = [
    "free",
    "accentual",
    "ballad",
    "syllable",
    "custom",
  ];
  return order.map((group) => ({
    group,
    label: METER_GROUP_LABELS[group],
    entries: METER_CATALOG.filter((entry) => entry.group === group),
  }));
}

export type ResolveMeterInput = {
  meter: string;
  customPattern: readonly number[];
  customFoot: CustomFootId;
};

export function resolveMeterConfig(input: ResolveMeterInput): MeterConfig {
  if (input.meter === "custom") {
    const pattern =
      input.customPattern.length > 0 ? [...input.customPattern] : [8];
    const stressPatterns = stressPatternsForCycle(input.customFoot, pattern);
    return {
      id: "custom",
      label: "Custom",
      pattern,
      stressPatterns,
      stanzaLines: null,
      description: formatCustomDescription(pattern, input.customFoot),
    };
  }

  const entry = getMeterCatalogEntry(input.meter);
  return {
    id: entry.id,
    label: entry.label,
    pattern: entry.pattern,
    stressPatterns: entry.stressPatterns,
    stanzaLines: entry.stanzaLines,
    description: entry.description,
  };
}

function formatCustomDescription(
  pattern: readonly number[],
  foot: CustomFootId,
): string {
  const cycle = pattern.join(" / ");
  if (foot === "none") return `${cycle} syllables`;
  return `${cycle} syllables, ${foot}`;
}

export function targetForLine(
  pattern: readonly number[],
  lineIndex: number,
): number | null {
  if (pattern.length === 0) return null;
  return pattern[lineIndex % pattern.length] ?? null;
}

/** Expected binary stress for a line, or null when the meter is syllable-only. */
export function stressPatternForLine(
  stressPatterns: readonly BinaryStressPattern[] | undefined,
  lineIndex: number,
): BinaryStressPattern | null {
  if (!stressPatterns || stressPatterns.length === 0) return null;
  return stressPatterns[lineIndex % stressPatterns.length] ?? null;
}

/** True when resolved meter validates stress as well as syllable count. */
export function isStressAwareMeterConfig(config: MeterConfig): boolean {
  return Boolean(config.stressPatterns && config.stressPatterns.length > 0);
}

/** True when a catalog/custom id resolves to a stress-aware meter. */
export function isStressAwareMeter(
  id: string,
  customPattern: readonly number[] = [8],
  customFoot: CustomFootId = "none",
): boolean {
  return isStressAwareMeterConfig(
    resolveMeterConfig({ meter: id, customPattern, customFoot }),
  );
}

/** Settings overlays to enable when opting into a metered writer. */
export function overlaysForMeterSeed(config: MeterConfig): {
  showCounts: boolean;
  showRulers: boolean;
  showStress: boolean;
  showMeterBreaks: boolean;
} {
  const stressAware = isStressAwareMeterConfig(config);
  return {
    showCounts: true,
    showRulers: config.pattern.length > 0,
    showStress: true,
    showMeterBreaks: stressAware,
  };
}
