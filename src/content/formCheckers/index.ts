import {
  getMeterCatalogEntry,
  listFormCheckerMeters,
  stressExplainerIdForEntry,
  type MeterGroupId,
} from "@/lib/meters/presets";
import { writerPath } from "@/lib/meters/seed";

import { amphibrachicTetrameterForm } from "./forms/amphibrachic-tetrameter";
import { anapesticTetrameterForm } from "./forms/anapestic-tetrameter";
import { anapesticTrimeterForm } from "./forms/anapestic-trimeter";
import { balladStanzaForm } from "./forms/ballad-stanza";
import { blankVerseForm } from "./forms/blank-verse";
import { cinquainForm } from "./forms/cinquain";
import { commonMeterForm } from "./forms/common-meter";
import { dactylicHexameterForm } from "./forms/dactylic-hexameter";
import { dactylicTetrameterForm } from "./forms/dactylic-tetrameter";
import { eightsAndSevensForm } from "./forms/eights-and-sevens";
import { ethereeForm } from "./forms/etheree";
import { haikuForm } from "./forms/haiku";
import { heroicCoupletForm } from "./forms/heroic-couplet";
import { iambicHexameterForm } from "./forms/iambic-hexameter";
import { iambicPentameterForm } from "./forms/iambic-pentameter";
import { iambicTetrameterForm } from "./forms/iambic-tetrameter";
import { iambicTrimeterForm } from "./forms/iambic-trimeter";
import { katautaForm } from "./forms/katauta";
import { limerickForm } from "./forms/limerick";
import { longMeterForm } from "./forms/long-meter";
import { nonetForm } from "./forms/nonet";
import { sedokaForm } from "./forms/sedoka";
import { senryuForm } from "./forms/senryu";
import { shortMeterForm } from "./forms/short-meter";
import { sonnetForm } from "./forms/sonnet";
import { tankaForm } from "./forms/tanka";
import { trochaicOctameterForm } from "./forms/trochaic-octameter";
import { trochaicTetrameterForm } from "./forms/trochaic-tetrameter";
import {
  getFootExplainer,
  getMeterExplainer,
  getStressExplainer,
} from "./shared";
import type { ComposedFormToolPage, FormCheckerContent } from "./types";
import { formCheckerPath, formCheckerSlug } from "./types";

const FORM_CONTENTS: FormCheckerContent[] = [
  iambicTrimeterForm,
  iambicTetrameterForm,
  iambicPentameterForm,
  blankVerseForm,
  sonnetForm,
  iambicHexameterForm,
  trochaicTetrameterForm,
  trochaicOctameterForm,
  anapesticTrimeterForm,
  anapesticTetrameterForm,
  dactylicTetrameterForm,
  dactylicHexameterForm,
  amphibrachicTetrameterForm,
  heroicCoupletForm,
  commonMeterForm,
  longMeterForm,
  shortMeterForm,
  eightsAndSevensForm,
  balladStanzaForm,
  haikuForm,
  senryuForm,
  tankaForm,
  katautaForm,
  sedokaForm,
  cinquainForm,
  nonetForm,
  ethereeForm,
  limerickForm,
];

const BY_METER_ID = new Map(
  FORM_CONTENTS.map((form) => [form.meterId, form] as const),
);

const BY_SLUG = new Map(
  FORM_CONTENTS.map((form) => [formCheckerSlug(form.meterId), form] as const),
);

export function listFormCheckerContents(): FormCheckerContent[] {
  return FORM_CONTENTS;
}

export function getFormCheckerByMeterId(
  meterId: string,
): FormCheckerContent | undefined {
  return BY_METER_ID.get(meterId);
}

export function getFormCheckerBySlug(
  slug: string,
): FormCheckerContent | undefined {
  return BY_SLUG.get(slug);
}

export function isFormCheckerSlug(slug: string): boolean {
  return BY_SLUG.has(slug);
}

export function meterIdFromCheckerSlug(slug: string): string | undefined {
  return getFormCheckerBySlug(slug)?.meterId;
}

export function composeFormToolPage(
  form: FormCheckerContent,
): ComposedFormToolPage {
  const entry = getMeterCatalogEntry(form.meterId);
  const meterExplainerId = form.meterExplainerId ?? form.meterId;
  const stressExplainerId =
    form.stressExplainerId ?? stressExplainerIdForEntry(entry) ?? undefined;
  const footExplainerId = form.footExplainerId ?? entry.footId;

  return {
    path: formCheckerPath(form.meterId),
    slug: formCheckerSlug(form.meterId),
    meterId: form.meterId,
    group: entry.group,
    label: entry.label,
    pattern: entry.pattern,
    status: form.status,
    title: form.title,
    description: form.description,
    h1: form.h1,
    intro: form.intro,
    history: form.history,
    famousPoems: form.famousPoems,
    formNotes: form.formNotes,
    faqs: form.faqs,
    sampleLines: form.sampleLines,
    cta: form.cta,
    writePath: writerPath(form.meterId),
    meterExplainer: form.meterExplainer ?? getMeterExplainer(meterExplainerId),
    footExplainer: getFootExplainer(footExplainerId),
    stressExplainer: getStressExplainer(stressExplainerId),
    verificationNotes: form.verificationNotes ?? [],
  };
}

export function listComposedFormToolPages(): ComposedFormToolPage[] {
  return FORM_CONTENTS.map(composeFormToolPage);
}

export function getComposedFormToolPageBySlug(
  slug: string,
): ComposedFormToolPage | undefined {
  const form = getFormCheckerBySlug(slug);
  return form ? composeFormToolPage(form) : undefined;
}

export function getComposedFormToolPageByMeterId(
  meterId: string,
): ComposedFormToolPage | undefined {
  const form = getFormCheckerByMeterId(meterId);
  return form ? composeFormToolPage(form) : undefined;
}

/** Group composed form pages for “More tools” nav. */
export function listComposedFormToolsByGroup(): {
  group: MeterGroupId;
  label: string;
  pages: ComposedFormToolPage[];
}[] {
  const order: MeterGroupId[] = ["syllable", "ballad", "accentual"];
  const labels: Record<MeterGroupId, string> = {
    free: "General",
    accentual: "Accentual-syllabic",
    ballad: "Song / ballad",
    syllable: "Syllable forms",
  };
  const pages = listComposedFormToolPages();
  return order
    .map((group) => ({
      group,
      label: labels[group],
      pages: pages.filter((page) => page.group === group),
    }))
    .filter((section) => section.pages.length > 0);
}

/** Assert registry covers every catalog form-checker meter. */
export function assertFormCheckerCoverage(): void {
  const expected = new Set(listFormCheckerMeters().map((e) => e.id));
  const actual = new Set(FORM_CONTENTS.map((f) => f.meterId));
  for (const id of expected) {
    if (!actual.has(id)) {
      throw new Error(`Missing form checker content for meter: ${id}`);
    }
  }
  for (const id of actual) {
    if (!expected.has(id)) {
      throw new Error(`Extra form checker content for unknown meter: ${id}`);
    }
  }
}

export type { ComposedFormToolPage, FormCheckerContent } from "./types";
export { formCheckerPath, formCheckerSlug } from "./types";
export { ZEN_EDITOR_PITCH } from "./zenPitch";
