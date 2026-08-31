<script module lang="ts">
  import type { AlertDialog as ShardsP } from "@shardsui/svelte/alert-dialog";
  import type { ComponentProps } from "svelte";
  export type AlertDialogDescriptionProps = ComponentProps<typeof ShardsP.Description>;
</script>

<script lang="ts">
  import { AlertDialog as P } from "@shardsui/svelte/alert-dialog";
  import { cn } from "@/utils.js";
  let { class: className, ref = $bindable(null), ...props }: AlertDialogDescriptionProps = $props();
</script>

<P.Description
  bind:ref
  class={cn("text-muted-foreground text-sm", className)}
  data-slot="alert-dialog-description"
  {...props}
/>
