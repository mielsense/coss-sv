<script module lang="ts">
  import type { DialogPartProps } from "./dialog-part.svelte";
  export type DialogFooterProps = DialogPartProps & { variant?: "default" | "bare" };
</script>

<script lang="ts">
  import { cn } from "@/utils.js";
  import DialogPart from "./dialog-part.svelte";
  let {
    class: className,
    ref = $bindable(null),
    variant = "default",
    ...props
  }: DialogFooterProps = $props();
  const classes = $derived(
    cn(
      "flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end sm:rounded-b-[calc(var(--radius-2xl)-1px)]",
      variant === "default" && "border-t bg-muted/72 py-4",
      variant === "bare" &&
        "in-[[data-slot=dialog-popup]:has([data-slot=dialog-panel])]:pt-3 pt-4 pb-6",
      className,
    ),
  );
</script>

<DialogPart bind:ref baseClass={classes} dataSlot="dialog-footer" {...props} />
