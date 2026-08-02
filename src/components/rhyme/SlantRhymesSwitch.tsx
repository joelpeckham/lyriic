import { useId, useState } from "react";
import { Info } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SLANT_RHYMES_HELP =
  "Also include slant rhymes: related vowel and coda families (night ↔ side), including one-segment coda add/drop (mind ↔ time, hold ↔ coal). Perfect rhymes are always shown.";

type SlantRhymesSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Compact for the word popover; default for the rhyme finder. */
  size?: "sm" | "default";
  className?: string;
};

export function SlantRhymesSwitch({
  checked,
  onCheckedChange,
  size = "default",
  className,
}: SlantRhymesSwitchProps) {
  const switchId = useId();
  const [helpOpen, setHelpOpen] = useState(false);
  const compact = size === "sm";

  return (
    <div
      className={cn(
        "flex items-center",
        compact ? "gap-1.5 px-0.5" : "gap-2",
        className,
      )}
    >
      <Switch
        id={switchId}
        size={compact ? "sm" : "default"}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-describedby={`${switchId}-help`}
      />
      <Label
        htmlFor={switchId}
        className={cn(
          "cursor-pointer font-normal text-foreground",
          compact ? "text-xs" : "text-sm",
        )}
      >
        Slant rhymes
      </Label>
      <TooltipProvider delayDuration={200}>
        <Tooltip open={helpOpen} onOpenChange={setHelpOpen}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none",
                "hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/80",
                compact ? "size-5" : "size-6",
              )}
              aria-label="About slant rhymes"
              aria-expanded={helpOpen}
              onClick={(event) => {
                // Tap/click toggle for touch; hover still works via Tooltip.
                event.preventDefault();
                setHelpOpen((open) => !open);
              }}
            >
              <Info
                className={compact ? "size-3.5" : "size-4"}
                aria-hidden
              />
            </button>
          </TooltipTrigger>
          <TooltipContent
            id={`${switchId}-help`}
            side="bottom"
            sideOffset={6}
            className="max-w-[16rem] text-left leading-relaxed"
          >
            {SLANT_RHYMES_HELP}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
