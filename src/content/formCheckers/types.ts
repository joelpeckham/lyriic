import type { FootId } from "@/lib/meters/feet";
import type { MeterGroupId } from "@/lib/meters/presets";

export type ContentStatus = "stub" | "ready";

export type ToolFaq = {
  q: string;
  plain: string;
  /** Optional in-app link shown after the plain answer (e.g. `/write/haiku`). */
  href?: string;
  hrefLabel?: string;
};

export type FamousPoem = {
  title: string;
  author?: string;
  note?: string;
  excerpt?: string;
};

export type Explainer = {
  id: string;
  title: string;
  body: string[];
  status: ContentStatus;
};

/** Authorable per-form SEO slots (before shared explainers are composed in). */
export type FormCheckerContent = {
  meterId: string;
  status: ContentStatus;
  title: string;
  description: string;
  h1: string;
  intro: string;
  history: string[];
  famousPoems: FamousPoem[];
  /** Optional H2 above famous poems (default: "Famous poems"). */
  famousPoemsHeading?: string;
  formNotes: string[];
  faqs: ToolFaq[];
  sampleLines: string[];
  /** CTA button label. */
  cta: string;
  /** Shared meter explainer id (defaults to meterId when omitted). */
  meterExplainerId?: string;
  /**
   * Optional per-form meter explainer. When set, used instead of looking up
   * `METER_EXPLAINERS[meterExplainerId]` — preferred for parallel authoring.
   */
  meterExplainer?: Explainer;
  footExplainerId?: FootId;
  stressExplainerId?: string;
  /**
   * Optional verification notes from content agents
   * (catalog vs traditional form rules).
   */
  verificationNotes?: string[];
};

/** Fully composed page model for ToolPage / SEO mirrors. */
export type ComposedFormToolPage = {
  path: string;
  slug: string;
  meterId: string;
  group: MeterGroupId;
  label: string;
  pattern: readonly number[];
  status: ContentStatus;
  title: string;
  description: string;
  h1: string;
  intro: string;
  history: string[];
  famousPoems: FamousPoem[];
  famousPoemsHeading: string;
  formNotes: string[];
  faqs: ToolFaq[];
  sampleLines: string[];
  cta: string;
  writePath: string;
  meterExplainer: Explainer | null;
  footExplainer: Explainer | null;
  stressExplainer: Explainer | null;
  verificationNotes: string[];
};

export function formCheckerSlug(meterId: string): string {
  return `${meterId}-checker`;
}

export function formCheckerPath(meterId: string): string {
  return `/tools/${formCheckerSlug(meterId)}`;
}
