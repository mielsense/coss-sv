<script module lang="ts">
import type { DialogPartProps } from "../dialog/dialog-part.svelte";
export type SheetFooterProps = DialogPartProps & { variant?: "default" | "bare" };
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";
import DialogPart from "../dialog/dialog-part.svelte";
let {
  class: className,
  ref = $bindable(null),
  variant = "default",
  ...props
}: SheetFooterProps = $props();
const classes = $derived(
  cn(
    "flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end",
    variant === "default" && "border-t bg-muted/72 py-4",
    variant === "bare" &&
      "in-[[data-slot=sheet-popup]:has([data-slot=sheet-panel])]:pt-3 pt-4 pb-6",
    className,
  ),
);
</script>
<DialogPart bind:ref baseClass={classes} dataSlot="sheet-footer" {...props} />
