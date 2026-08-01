import { Link } from "react-router-dom";

export function RhymeEditorPitch() {
  return (
    <aside
      className="mt-10 border-t border-border/70 pt-8 font-[family-name:var(--font-ui)]"
      aria-labelledby="rhyme-editor-pitch"
    >
      <p
        id="rhyme-editor-pitch"
        className="font-[family-name:var(--font-brand)] text-xl tracking-tight text-foreground"
      >
        Don’t leave your line
      </p>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
        In the lyriic editor, hover or tap a word for rhymes sorted by syllable
        count—right beside your draft, with meter-aware highlighting when a
        ruler is on.
      </p>
      <p className="mt-4">
        <Link
          to="/"
          className="font-medium text-foreground underline decoration-[var(--lyriic-subtle-faint)] underline-offset-4 transition-colors hover:decoration-foreground"
        >
          Open the zen editor
        </Link>
        <span className="text-muted-foreground"> — local-first, no account.</span>
      </p>
    </aside>
  );
}
