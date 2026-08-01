import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getMeterCatalogEntry } from "@/lib/meters/presets";
import {
  parseMeterSeed,
  settingsFromMeterSeed,
} from "@/lib/meters/seed";
import type { EditorSettings } from "@/lib/settings";

type ApplySeed = (
  settings: EditorSettings,
  options?: { name?: string; reuseEmpty?: boolean },
) => void;

/**
 * Apply a one-shot meter seed from `/write/:slug` and/or `?meter=`.
 * Strips consumed query params; keeps the pretty write path.
 */
export function useMeterSeed(
  slug: string | undefined,
  applyMeterSeed: ApplySeed,
): void {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appliedKey = useRef<string | null>(null);
  const applyRef = useRef(applyMeterSeed);

  useLayoutEffect(() => {
    applyRef.current = applyMeterSeed;
  }, [applyMeterSeed]);

  useEffect(() => {
    const seed = parseMeterSeed(slug, searchParams);
    if (!seed) return;

    const key = `${slug ?? ""}|${searchParams.toString()}`;
    if (appliedKey.current === key) return;
    appliedKey.current = key;

    const settings = settingsFromMeterSeed(seed);
    if (!settings) return;

    const entry = getMeterCatalogEntry(seed.meterId);
    applyRef.current(settings, {
      name: entry.label,
      reuseEmpty: true,
    });

    // Drop meter/overlay query flags; keep /write/:slug when present.
    if (
      searchParams.has("meter") ||
      searchParams.has("counts") ||
      searchParams.has("rulers") ||
      searchParams.has("stress") ||
      searchParams.has("breaks")
    ) {
      const next = new URLSearchParams(searchParams);
      next.delete("meter");
      next.delete("counts");
      next.delete("rulers");
      next.delete("stress");
      next.delete("breaks");
      const search = next.toString();
      navigate(
        {
          pathname: slug ? `/write/${slug}` : "/",
          search: search ? `?${search}` : "",
        },
        { replace: true },
      );
    }
  }, [slug, searchParams, navigate]);
}
