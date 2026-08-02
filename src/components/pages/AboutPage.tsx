import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { AboutPoemEditor } from "@/components/pages/AboutPoemEditor";
import { Button } from "@/components/ui/button";
import {
  ABOUT_CLOSE_LINE,
  ABOUT_DESCRIPTION,
  ABOUT_FEATURES,
  ABOUT_HERO,
  ABOUT_ORIGIN_URL,
  ABOUT_STANCE,
  ABOUT_TITLE,
  ABOUT_WHY,
  type AboutPoem,
} from "@/content/about";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/utils";

const sectionLabelClass =
  "font-[family-name:var(--font-ui)] text-xs tracking-[0.14em] text-muted-foreground uppercase";

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

function PoemSection({ poem }: { poem: AboutPoem }) {
  return (
    <section aria-label={poem.label}>
      <p className={sectionLabelClass}>{poem.label}</p>
      <p className="sr-only">{poem.summary}</p>
      <AboutPoemEditor
        className="mt-4"
        text={poem.text}
        settings={poem.settings}
        documentKey={`about-${poem.label}`}
        aria-label={`${poem.label}: ${poem.text.replace(/\n/g, " / ")}`}
      />
    </section>
  );
}

export function AboutPage() {
  useDocumentMeta({
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    path: "/about",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: `${SITE_URL}/about`,
    isPartOf: {
      "@type": "WebSite",
      name: "lyriic",
      url: SITE_URL,
    },
  };

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col">
      <AppHeader variant="flow" brandAs="link" />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 sm:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero — brand first, annotated verse as the visual. */}
        <section className="flex min-h-[calc(100dvh-5.5rem)] flex-col justify-center py-8 sm:py-12">
          <h1
            className={cn(
              "font-[family-name:var(--font-brand)] text-5xl tracking-[0.18em] text-foreground sm:text-6xl md:text-7xl",
              "motion-safe:animate-[lyriic-brand-settle_0.9s_ease-out_both]",
            )}
          >
            lyriic
          </h1>

          <div className="mt-10 max-w-3xl sm:mt-14">
            <AboutPoemEditor
              text={ABOUT_HERO.text}
              settings={ABOUT_HERO.settings}
              documentKey="about-hero"
              aria-label={ABOUT_HERO.text}
              eager
            />
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-ui)]">
            <Button asChild>
              <Link to="/">Open the editor</Link>
            </Button>
            <a
              href="#why"
              className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Read the poems
            </a>
          </p>
        </section>

        <div className="mx-auto max-w-3xl space-y-16 sm:space-y-20">
          <Reveal>
            <div id="why">
              <PoemSection poem={ABOUT_WHY} />
              <p className="mt-3 font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
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
            <div className="space-y-14">
              <p className={sectionLabelClass}>What it does</p>
              {ABOUT_FEATURES.map((poem) => (
                <PoemSection key={poem.label} poem={poem} />
              ))}
            </div>
          </Reveal>

          <Reveal>
            <PoemSection poem={ABOUT_STANCE} />
          </Reveal>

          <Reveal>
            <section aria-label="Open the editor" className="border-t border-border/70 pt-10">
              <p className="font-[family-name:var(--font-editor)] text-xl text-foreground sm:text-2xl">
                {ABOUT_CLOSE_LINE}
              </p>
              <p className="mt-2 font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
                Free. No account. Private in your browser.
              </p>
              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-ui)]">
                <Button asChild>
                  <Link to="/">Open the editor</Link>
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
      </main>

      <AppFooter variant="flow" />
    </div>
  );
}
