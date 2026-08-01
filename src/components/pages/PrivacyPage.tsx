import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import {
  PRIVACY_DESCRIPTION,
  PRIVACY_EFFECTIVE,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  PRIVACY_TITLE,
} from "@/content/privacy";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function PrivacyPage() {
  useDocumentMeta({
    title: PRIVACY_TITLE,
    description: PRIVACY_DESCRIPTION,
    path: "/privacy",
  });

  return (
    <ContentPageLayout>
      <h1 className="font-[family-name:var(--font-brand)] text-3xl tracking-tight text-foreground sm:text-4xl">
        Privacy
      </h1>
      <p className="mt-3 font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
        {PRIVACY_EFFECTIVE}
      </p>
      <p className="mt-6 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
        {PRIVACY_INTRO}
      </p>

      <div className="mt-10 space-y-8 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
        {PRIVACY_SECTIONS.map((section) => (
          <section key={section.h2}>
            <h2 className="text-base font-medium text-foreground">
              {section.h2}
            </h2>
            <p className="mt-2">
              {section.h2 === "What lyriic stores" ? (
                <>
                  Drafts (poem text, settings, and syllable overrides) are saved
                  in your browser&apos;s local storage under the key{" "}
                  <code className="text-foreground/80">lyriic.projects.v1</code>.
                  Appearance preferences (theme, contrast, font size, and
                  related flags) use{" "}
                  <code className="text-foreground/80">lyriic.prefs.v1</code>.
                  There is no account and no cloud sync — data stays on this
                  device unless you clear site data or your browser removes it.
                </>
              ) : section.h2 === "Contact" ? (
                <>
                  Questions about this policy? Reach the maker at{" "}
                  <a
                    href="https://jpeckham.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    jpeckham.com
                  </a>
                  .
                </>
              ) : (
                section.body
              )}
            </p>
          </section>
        ))}
      </div>
    </ContentPageLayout>
  );
}
