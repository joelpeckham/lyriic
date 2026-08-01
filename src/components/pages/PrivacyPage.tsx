import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const PRIVACY_TITLE = "Privacy — lyriic";
const PRIVACY_DESCRIPTION =
  "lyriic is local-first: drafts stay in your browser. No accounts, no analytics, no third-party trackers.";

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
        Effective July 31, 2026
      </p>
      <p className="mt-6 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
        lyriic is a client-only writing tool. This page explains what stays on
        your device and what does not leave your browser.
      </p>

      <div className="mt-10 space-y-8 font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-medium text-foreground">
            What lyriic stores
          </h2>
          <p className="mt-2">
            Drafts (poem text, settings, and syllable overrides) are saved in
            your browser&apos;s local storage under the key{" "}
            <code className="text-foreground/80">lyriic.projects.v1</code>.
            Appearance preferences (theme, contrast, font size, and related
            flags) use{" "}
            <code className="text-foreground/80">lyriic.prefs.v1</code>. There
            is no account and no cloud sync — data stays on this device unless
            you clear site data or your browser removes it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">
            What we do not collect
          </h2>
          <p className="mt-2">
            lyriic does not run analytics, advertising pixels, or third-party
            trackers. Writing, syllable counts, synonym lookups, and rhyme
            helpers run in your browser. Poem text is not sent to a server for
            editing. Dictionaries ship with the app bundle and load locally.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">
            Hosting and network
          </h2>
          <p className="mt-2">
            The website is served as static files (currently via Vercel). Your
            browser requests those assets like any other site. The app is built
            so editing does not require outbound API calls for its core
            features. Hosting providers may log standard technical request data
            (such as IP address and user agent) as part of delivering the site;
            that is outside the editor&apos;s local storage model described
            above.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">
            Sale of data
          </h2>
          <p className="mt-2">
            We do not sell personal information. There is no personal profile
            stored by lyriic on a server to sell.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground">Contact</h2>
          <p className="mt-2">
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
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
}
