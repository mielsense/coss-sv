<script module lang="ts">
  import type { DialogPartProps } from "../dialog/dialog-part.svelte";
  export type AlertDialogFooterProps = DialogPartProps & { variant?: "default" | "bare" };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";
  import DialogPart from "../dialog/dialog-part.svelte";
  let {
    class: className,
    ref = $bindable(null),
    variant = "default",
    ...props
  }: AlertDialogFooterProps = $props();
  const classes = $derived(
    cn(
      "flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end sm:rounded-b-[calc(var(--radius-2xl)-1px)]",
      variant === "default" && "border-t bg-muted/72 py-4",
      variant === "bare" && "pb-6",
      className,
    ),
  );
</script>

<DialogPart bind:ref baseClass={classes} dataSlot="alert-dialog-footer" {...props} />
