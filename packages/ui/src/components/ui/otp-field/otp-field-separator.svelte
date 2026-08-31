<script module lang="ts">
  import type { SeparatorProps } from "../separator/separator.svelte";
  export type OTPFieldSeparatorProps = SeparatorProps;
</script>

<script lang="ts">
  import { cn } from "@/utils.js";
  import Separator from "../separator/separator.svelte";

  let { class: className, ref = $bindable(null), ...props }: OTPFieldSeparatorProps = $props();
</script>

<Separator
  bind:ref
  class={cn(
    "rounded-full bg-input data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-3",
    className,
  )}
  data-slot="separator"
  orientation="horizontal"
  {...props}
/>
