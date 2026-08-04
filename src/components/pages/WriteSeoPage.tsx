/**
 * Static shell for bare `/write` prerender / crawlers.
 * Hidden under `html.js #root .seo-shell` until the live editor mounts.
 */
export function WriteSeoPage() {
  return (
    <article className="seo-shell">
      <h1>lyriic editor</h1>
      <p>
        A free, local-first zen editor for writing poetry and lyrics in meter.
        Per-line syllable counts, optional meter rulers, and quiet rhyme and
        synonym helpers — all in your browser.
      </p>
      <p>
        Open this page with JavaScript enabled to write. Drafts stay local on
        your device.
      </p>
    </article>
  );
}
