import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { loadLexicon } from "@/lib/data/lexicon";
import { loadStress } from "@/lib/data/stress";
import { OgCard } from "@/og/OgCard";
import { listOgSpecs } from "@/og/specs";

import "@/fonts.css";
import "@/index.css";

async function ready(): Promise<void> {
  await loadLexicon();
  await loadStress().catch(() => {});
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  // Extra frames so PoemLines can measure stress/ruler geometry after paint.
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
  document.documentElement.dataset.ogReady = "true";
}

export function Gallery() {
  const specs = listOgSpecs();

  return (
    <div className="flex flex-col gap-8 bg-neutral-400 p-8">
      <p className="font-[family-name:var(--font-ui)] text-sm text-neutral-800">
        OG gallery — {specs.length} cards · capture via{" "}
        <code>pnpm build:og</code>
      </p>
      {specs.map((spec) => (
        <div key={spec.id} className="shadow-lg">
          <OgCard id={spec.id} lines={spec.lines} cta={spec.cta} />
        </div>
      ))}
    </div>
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("#root missing in og.html");
}

// Force light paper for consistent social previews.
document.documentElement.classList.remove("dark");

createRoot(root).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
);

void ready();
