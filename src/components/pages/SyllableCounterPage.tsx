import { ToolPage } from "@/components/pages/ToolPage";
import { SyllableCounterTool } from "@/components/tools/SyllableCounterTool";
import { getToolBySlug } from "@/content/tools";

const tool = getToolBySlug("syllable-counter")!;

export function SyllableCounterPage() {
  return (
    <ToolPage tool={tool} showCta={false}>
      <SyllableCounterTool />
    </ToolPage>
  );
}
