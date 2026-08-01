import { getMeterCatalogEntry } from "@/lib/meters/presets";
import { writerDocumentMeta } from "@/lib/meters/seed";

/** Static shell for prerender / crawlers. Client hydrates the live editor. */
export function WriterSeoPage({ slug }: { slug: string }) {
  const entry = getMeterCatalogEntry(slug);
  const meta = writerDocumentMeta(slug);
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 font-[family-name:var(--font-ui)]">
      <h1 className="font-[family-name:var(--font-brand)] text-3xl tracking-tight text-foreground">
        {entry.label} writer
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {meta?.description ?? entry.description}
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        Open this page in your browser to write with live syllable counts and
        meter guides. Drafts stay local on your device.
      </p>
    </article>
  );
}
