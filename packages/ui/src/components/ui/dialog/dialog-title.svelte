<script module lang="ts">
  import type { Dialog as ShardsDialog } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";
  export type DialogTitleProps = ComponentProps<typeof ShardsDialog.Title>;
</script>

<script lang="ts">
  import { Dialog as DialogPrimitive } from "@shardsui/svelte/dialog";
  import { cn } from "@/utils.js";
  let { class: className, ref = $bindable(null), ...props }: DialogTitleProps = $props();
</script>

<DialogPrimitive.Title
  bind:ref
  class={cn("font-heading font-semibold text-xl leading-none", className)}
  data-slot="dialog-title"
  {...props}
/>
