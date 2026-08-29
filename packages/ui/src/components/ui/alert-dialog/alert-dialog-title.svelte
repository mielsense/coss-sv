<script module lang="ts">
  import type { AlertDialog as ShardsP } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type AlertDialogTitleProps = ComponentProps<typeof ShardsP.Title>;
</script>

<script lang="ts">
  import { AlertDialog as P } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  let { class: className, ref = $bindable(null), ...props }: AlertDialogTitleProps = $props();
</script>

<P.Title
  bind:ref
  class={cn("font-heading font-semibold text-xl leading-none", className)}
  data-slot="alert-dialog-title"
  {...props}
/>
