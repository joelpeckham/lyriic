import { Link } from "react-router-dom";

import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import {
  FAQ_DESCRIPTION,
  FAQ_ENTRIES,
  FAQ_INTRO,
  FAQ_TITLE,
} from "@/content/faq";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_URL } from "@/lib/seo";

function FaqAnswer({ question }: { question: string }) {
  switch (question) {
    case "How are syllables counted?":
      return (
        <>
          Counts follow a fused US pronunciation dictionary built from{" "}
          <a
            href="https://github.com/hexgrad/misaki"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Misaki
          </a>
          , the{" "}
          <a
            href="http://www.speech.cs.cmu.edu/cgi-bin/cmudict"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            CMU Pronouncing Dictionary
          </a>
          , and{" "}
          <a
            href="https://github.com/CUNY-CL/wikipron"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            WikiPron
          </a>
          . Hyphenated compounds are split and summed. Unfamiliar words fall
          back to a spelling heuristic. For ambiguous words (like poetic{" "}
          <em>fire</em> as one syllable), set a per-draft override in Settings →
          Syllable overrides.
        </>
      );
    case "Where does the dictionary data come from?":
      return (
        <>
          Syllables and rhymes use Misaki (Apache 2.0), the CMU Pronouncing
          Dictionary (acknowledgment requested by CMU), and WikiPron /
          Wiktionary pronunciations (CC-BY-SA). Synonyms use{" "}
          <a
            href="https://github.com/globalwordnet/english-wordnet"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Open English WordNet
          </a>{" "}
          (CC-BY 4.0) with additional links from Wiktionary (CC-BY-SA).
        </>
      );
    case "Where are my drafts stored?":
      return (
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
      );
    case "How do synonyms and rhymes work?":
      return (
        <>
          Hover or tap a word in the editor to open synonyms, rhymes, and
          syllable tools. Suggestions are sorted by syllable count; ones that
          match your meter target are highlighted. Optional End and Slant
          toggles add stress-ignoring end rhymes and family or assonance near
          rhymes. Everything runs from dictionaries bundled with the app. Try
          the{" "}
          <Link
            to="/tools/rhyme-finder"
            className="underline underline-offset-2 hover:text-foreground"
          >
            rhyme finder
          </Link>{" "}
          or{" "}
          <Link
            to="/tools/syllable-counter"
            className="underline underline-offset-2 hover:text-foreground"
          >
            syllable counter
          </Link>{" "}
          tools.
        </>
      );
    default: {
      const entry = FAQ_ENTRIES.find((item) => item.q === question);
      return <>{entry?.plain}</>;
    }
  }
}

export function FaqPage() {
  useDocumentMeta({
    title: FAQ_TITLE,
    description: FAQ_DESCRIPTION,
    path: "/faq",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ENTRIES.map((item) => ({
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
        {FAQ_INTRO}
      </p>

      <dl className="mt-10 space-y-8 font-[family-name:var(--font-ui)]">
        {FAQ_ENTRIES.map((item) => (
          <div key={item.q}>
            <dt className="text-base font-medium text-foreground">{item.q}</dt>
            <dd className="mt-2 text-base leading-relaxed text-muted-foreground">
              <FaqAnswer question={item.q} />
            </dd>
          </div>
        ))}
      </dl>
    </ContentPageLayout>
  );
}
