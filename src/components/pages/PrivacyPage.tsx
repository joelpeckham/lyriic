import type { ReactNode } from "react";
import { ContentPageLayout } from "@/components/pages/ContentPageLayout";
import {
  PRIVACY_DESCRIPTION,
  PRIVACY_EFFECTIVE,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  PRIVACY_TITLE,
} from "@/content/privacy";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const URL_RE = /(https:\/\/[^\s]+)/g;

function linkifyBody(body: string): ReactNode {
  const parts = body.split(URL_RE);
  return parts.map((part, index) => {
    if (!part.startsWith("https://")) {
      return part;
    }
    const href = part.replace(/[.,;:)]+$/, "");
    const trailing = part.slice(href.length);
    const label = href.replace(/^https:\/\//, "");
    return (
      <span key={`${href}-${index}`}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          {label}
        </a>
        {trailing}
      </span>
    );
  });
}

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
            <p className="mt-2">{linkifyBody(section.body)}</p>
          </section>
        ))}
      </div>
    </ContentPageLayout>
  );
}
