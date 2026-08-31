import type { ClassValue } from "clsx";
import { cn } from "@/utils.js";
import type { ToggleSize, ToggleVariant } from "../toggle/toggle-variants.js";

export type ToggleGroupStyleOptions = {
  class?: ClassValue;
  orientation?: "horizontal" | "vertical";
  size?: ToggleSize;
  variant?: ToggleVariant;
};

const baseClass =
  "flex w-fit *:focus-visible:z-10 dark:*:[[data-slot=separator]:has(+[data-slot=toggle]:hover)]:before:bg-input/64 dark:*:[[data-slot=separator]:has(+[data-slot=toggle][data-pressed])]:before:bg-input dark:*:[[data-slot=toggle]:hover+[data-slot=separator]]:before:bg-input/64 dark:*:[[data-slot=toggle][data-pressed]+[data-slot=separator]]:before:bg-input";

const horizontalOutlineClass =
  "*:not-first:rounded-s-none *:not-last:rounded-e-none *:not-first:border-s-0 *:not-last:border-e-0 *:not-first:not-data-[slot=separator]:before:-start-[0.5px] *:not-last:not-data-[slot=separator]:before:-end-[0.5px] *:not-first:before:rounded-s-none *:not-last:before:rounded-e-none";

const verticalOutlineClass =
  "flex-col *:not-first:rounded-t-none *:not-last:rounded-b-none *:not-first:border-t-0 *:not-last:border-b-0 *:not-first:not-data-[slot=separator]:before:-top-[0.5px] *:not-last:not-data-[slot=separator]:before:-bottom-[0.5px] *:not-first:before:rounded-t-none *:not-last:before:rounded-b-none *:data-[slot=toggle]:not-last:before:hidden dark:*:last:before:hidden dark:*:first:before:block";

export function toggleGroupClasses(options: ToggleGroupStyleOptions = {}): string {
  const { class: className, orientation = "horizontal", variant = "default" } = options;

  return cn(
    baseClass,
    orientation === "horizontal"
      ? "*:pointer-coarse:after:min-w-auto"
      : "*:pointer-coarse:after:min-h-auto",
    variant === "default"
      ? "gap-0.5"
      : orientation === "horizontal"
        ? horizontalOutlineClass
        : verticalOutlineClass,
    className,
  );
}
