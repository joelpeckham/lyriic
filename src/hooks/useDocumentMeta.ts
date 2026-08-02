import { useEffect } from "react";

import {
  ogImageForPath,
  ogImageTypeForUrl,
  absoluteUrl,
} from "@/lib/seo";

type DocumentMeta = {
  title: string;
  description: string;
  path: string;
};

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
): void {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertCanonical(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

export function useDocumentMeta({
  title,
  description,
  path,
}: DocumentMeta): void {
  useEffect(() => {
    const canonical = absoluteUrl(path);
    const image = ogImageForPath(path);
    const imageType = ogImageTypeForUrl(image);
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:image:type", imageType);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "lyriic");
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertCanonical(canonical);
  }, [title, description, path]);
}
