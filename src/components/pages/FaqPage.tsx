import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_URL } from "@/lib/seo";

const FAQ_TITLE = "FAQ — lyriic";
const FAQ_DESCRIPTION =
  "Answers about lyriic: syllable counting, meter rulers, synonyms and rhymes, and local-first drafts in your browser.";

type FaqItem = {
  q: string;
  plain: string;
  a: ReactNode;
};

const faqs: FaqItem[] = [
  {
    q: "What is lyriic?",
    plain:
      "lyriic is a zen text editor for writing in meter — poetry, lyrics, or any line that needs a syllable count. It stays quiet so you can stay with the words.",
    a: (
      <>
        lyriic is a zen text editor for writing in meter — poetry, lyrics, or
        any line that needs a syllable count. It stays quiet so you can stay
        with the words.
      </>
    ),
  },
  {
    q: "How are syllables counted?",
    plain:
      "Counts follow the CMU Pronouncing Dictionary primary pronunciation. Hyphenated compounds are split and summed. Unfamiliar words use a spelling heuristic. Per-draft overrides are available in Settings.",
    a: (
      <>
        Counts follow the{" "}
        <a
          href="http://www.speech.cs.cmu.edu/cgi-bin/cmudict"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          CMU Pronouncing Dictionary
        </a>{" "}
        primary pronunciation (stress-marked phones). Hyphenated compounds are
        split and summed. Unfamiliar words fall back to a spelling heuristic.
        For ambiguous words (like poetic <em>fire</em> as one syllable), set a
        per-draft override in Settings → Syllable overrides.
      </>
    ),
  },
  {
    q: "What are meter rulers?",
    plain:
      "Optional ticks at syllable boundaries. Presets include Haiku, iambic pentameter, and common meter, or a custom target.",
    a: (
      <>
        Optional ticks at syllable boundaries help you see the beat of a line.
        Pick a preset — Haiku (5/7/5), iambic pentameter (10), common meter
        (8/6) — or set a custom target. Choose None to hide rulers.
      </>
    ),
  },
  {
    q: "How do synonyms and rhymes work?",
    plain:
      "⌘' for synonyms, ⌘; for rhymes. Suggestions are sorted by syllable count and highlighted when they match your meter target. Dictionaries ship with the app.",
    a: (
      <>
        Place the caret in a word and press ⌘&apos; for synonyms or ⌘; for
        rhymes. Suggestions are sorted by syllable count; ones that match your
        meter target are highlighted. Everything runs from dictionaries bundled
        with the app.
      </>
    ),
  },
  {
    q: "Where are my drafts stored?",
    plain:
      "Locally in your browser — no account, no cloud sync. Drafts and preferences stay on this device.",
    a: (
      <>
        Locally in your browser — no account, no cloud sync. Drafts and
        preferences stay on this device. See the{" "}
        <Link
          to="/privacy"
          className="underline underline-offset-2 hover:text-foreground"
        >
          privacy policy
        </Link>{" "}
        for details.
      </>
    ),
  },
  {
    q: "Can I change the look of the editor?",
    plain:
      "Yes. Settings include system, light, or dark theme, higher contrast, and editor font size (S–XL).",
    a: (
      <>
        Yes. Open Settings for system, light, or dark theme, higher contrast,
        and editor font size (S–XL).
      </>
    ),
  },
  {
    q: "Does writing leave my browser?",
    plain:
      "No. Syllable counts, thesaurus, and rhyme helpers run client-side. Poem text is not sent to a server for editing. You can keep writing offline after assets load.",
    a: (
      <>
        No. Syllable counts, thesaurus, and rhyme helpers run client-side. Your
        poem text is not sent to a server for editing. After the app assets
        load, you can keep writing offline.
      </>
    ),
  },
];

export function FaqPage() {
  useDocumentMeta({
    title: FAQ_TITLE,
    description: FAQ_DESCRIPTION,
    path: "/faq",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.plain,
      },
    })),
    url: `${SITE_URL}/faq`,
  };

  return (
    <ContentPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="font-[family-name:var(--font-brand)] text-3xl tracking-tight text-foreground sm:text-4xl">
        FAQ
      </h1>
      <p className="mt-3 font-[family-name:var(--font-ui)] text-base text-muted-foreground">
        Quick answers about writing in meter with lyriic.
      </p>

      <dl className="mt-10 space-y-8 font-[family-name:var(--font-ui)]">
        {faqs.map((item) => (
          <div key={item.q}>
            <dt className="text-base font-medium text-foreground">{item.q}</dt>
            <dd className="mt-2 text-base leading-relaxed text-muted-foreground">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </ContentPageLayout>
  );
}
