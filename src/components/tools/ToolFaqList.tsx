import { Link } from "react-router-dom";

import type { ToolFaq } from "@/content/tools";
import { SITE_URL } from "@/lib/seo";

type ToolFaqListProps = {
  faqs: ToolFaq[];
  path: string;
};

export function ToolFaqList({ faqs, path }: ToolFaqListProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.href
          ? `${item.plain} ${item.hrefLabel ?? item.href}: ${SITE_URL}${item.href}`
          : item.plain,
      },
    })),
    url: `${SITE_URL}${path}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="mt-12 font-[family-name:var(--font-brand)] text-lg tracking-tight text-foreground">
        Common questions
      </h2>
      <dl className="mt-6 space-y-6 font-[family-name:var(--font-ui)]">
        {faqs.map((item) => (
          <div key={item.q}>
            <dt className="text-base font-medium text-foreground">{item.q}</dt>
            <dd className="mt-2 text-base leading-relaxed text-muted-foreground">
              {item.plain}
              {item.href ? (
                <>
                  {" "}
                  <Link
                    to={item.href}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    {item.hrefLabel ?? item.href}
                  </Link>
                </>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
