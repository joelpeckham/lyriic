import { ToolPage } from "@/components/pages/ToolPage";
import { RhymeFinderTool } from "@/components/tools/RhymeFinderTool";
import { getToolBySlug } from "@/content/tools";

const tool = getToolBySlug("rhyme-finder")!;

export function RhymeFinderPage() {
  return (
    <ToolPage tool={tool} showCta={false}>
      <RhymeFinderTool />
    </ToolPage>
  );
}
