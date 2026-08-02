import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { AboutPoemEditor } from "@/components/pages/AboutPoemEditor";
import { Button } from "@/components/ui/button";
import {
  ABOUT_CLOSE_LINE,
  ABOUT_FEATURES,
  ABOUT_HERO,
  ABOUT_ORIGIN_URL,
  ABOUT_STANCE,
  ABOUT_WHY,
  type AboutPoem,
} from "@/content/about";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

/** Quiet chapter eyebrow (What it does). */
const groupLabelClass =
  "font-[family-name:var(--font-brand)] text-sm tracking-[0.12em] text-foreground/75 uppercase sm:text-base";

/** Large display poem label. */
const poemLabelClass =
  "font-[family-name:var(--font-brand)] tracking-[-0.02em] text-foreground";

/** Chapter-lead size (Why, Stance). */
const poemLabelLeadClass =
  "text-[2rem] leading-none sm:text-[2.25rem]";

/** Feature-block size under “What it does”. */
const poemLabelFeatureClass =
  "text-[2rem] leading-none sm:text-[2.25rem]";

/** Quiet subtitle under the label — SEO + human context. */
const poemSummaryClass =
  "mt-3 max-w-xl font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground text-pretty sm:mt-4 sm:text-lg";

function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /**
   * `ssr` — visible for prerender; `wait` — opacity 0 below fold;
   * `in` — play enter animation; `settled` — drop animation class so no
   * leftover transform traps `position: fixed` word-tool anchors.
   */
  const [phase, setPhase] = useState<"ssr" | "wait" | "in" | "settled">("ssr");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setPhase("settled"));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPhase("in");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(el);

    const raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
      if (inView) {
        setPhase("in");
        observer.disconnect();
      } else {
        setPhase("wait");
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        phase === "wait" && "opacity-0",
        phase === "in" &&
        "motion-safe:animate-[lyriic-section-in_0.55s_ease-out_both]",
        className,
      )}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && phase === "in") {
          setPhase("settled");
        }
      }}
    >
      {children}
    </div>
  );
}

function PoemSection({
  poem,
  lead = false,
}: {
  poem: AboutPoem;
  /** Larger display type for chapter-lead poems. */
  lead?: boolean;
}) {
  const labelId = `about-label-${poem.label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <section aria-labelledby={labelId}>
      <h2
        id={labelId}
        className={cn(
          poemLabelClass,
          lead ? poemLabelLeadClass : poemLabelFeatureClass,
        )}
      >
        {poem.label}
      </h2>
      <p className={poemSummaryClass}>{poem.summary}</p>
      <AboutPoemEditor
        className="mt-6 sm:mt-8"
        text={poem.text}
        settings={poem.settings}
        documentKey={`about-${poem.label}`}
        aria-label={`${poem.label}: ${poem.text.replace(/\n/g, " / ")}`}
      />
    </section>
  );
}

/** Home landing (`/`) and always-available alias (`/about`). Canonical is `/`. */
export function AboutPage() {
  useDocumentMeta({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    isPartOf: {
      "@type": "WebSite",
      name: "lyriic",
      url: SITE_URL,
    },
  };

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col">
      <AppHeader
        variant="flow"
        brandAs="link"
        className="[&_a]:text-foreground/40"
      />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 sm:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero — brand first, then subtitle context, then annotated verse. */}
        <section className="flex min-h-[calc(100dvh-5.5rem)] flex-col justify-center py-10 sm:py-14">
          <h1
            className={cn(
              "font-[family-name:var(--font-brand)] text-5xl tracking-[0.18em] text-foreground sm:text-6xl",
              "motion-safe:animate-[lyriic-brand-settle_0.9s_ease-out_both]",
            )}
          >
            lyriic
          </h1>

          <p
            className={cn(
              "mt-5 max-w-md font-[family-name:var(--font-ui)] text-base leading-relaxed text-muted-foreground text-pretty sm:mt-6 sm:text-lg",
              "motion-safe:animate-[lyriic-section-in_0.7s_ease-out_0.12s_both]",
            )}
          >
            {ABOUT_HERO.summary}
          </p>

          <div className="mt-8 sm:mt-10">
            <AboutPoemEditor
              text={ABOUT_HERO.text}
              settings={ABOUT_HERO.settings}
              documentKey="about-hero"
              aria-label={ABOUT_HERO.text}
              eager
            />
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-ui)] sm:mt-12">
            <Button asChild>
              <Link to="/write">Open the editor</Link>
            </Button>
            <a
              href="#why"
              className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Read the poems
            </a>
          </p>
        </section>

        <div className="space-y-24 sm:space-y-32">
          <Reveal>
            <div id="why">
              <p className={groupLabelClass}>Why we built it</p>
              <div className="mt-10 space-y-16 sm:mt-12 sm:space-y-24">
                <PoemSection poem={ABOUT_WHY} lead />
              </div>
              <p className="mt-12 font-[family-name:var(--font-ui)] text-sm text-muted-foreground sm:mt-14">
                <a
                  href={ABOUT_ORIGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:text-foreground hover:underline"
                >
                  How it was built
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <p className={groupLabelClass}>What it does</p>
              <div className="mt-10 space-y-16 sm:mt-12 sm:space-y-24">
                {ABOUT_FEATURES.map((poem) => (
                  <PoemSection key={poem.label} poem={poem} />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <PoemSection poem={ABOUT_STANCE} lead />
          </Reveal>

          <Reveal>
            <section
              aria-label="Open the editor"
              className="border-t border-border/70 pt-14 sm:pt-16"
            >
              <p className="font-[family-name:var(--font-editor)] text-[1.125rem] text-foreground sm:text-[1.25rem]">
                {ABOUT_CLOSE_LINE}
              </p>
              <p className="mt-2 font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
                Free. No account. Private in your browser.
              </p>
              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-ui)]">
                <Button asChild>
                  <Link to="/write">Open the editor</Link>
                </Button>
                <Link
                  to="/tools"
                  className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Browse tools
                </Link>
                <Link
                  to="/faq"
                  className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  FAQ
                </Link>
              </p>
            </section>
          </Reveal>
        </div>
      </main >

      <AppFooter variant="flow" />
    </div >
  );
}
