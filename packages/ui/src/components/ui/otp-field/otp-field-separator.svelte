<script module lang="ts">
import type { SeparatorProps } from "../separator/separator.svelte";
export type OTPFieldSeparatorProps = SeparatorProps;
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";
import Separator from "../separator/separator.svelte";

let { class: className, ref = $bindable(null), ...props }: OTPFieldSeparatorProps = $props();
</script>
<Separator
  bind:ref
  aria-hidden="true"
  class={cn("rounded-full bg-input data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:w-3", className)}
  data-slot="otp-field-separator"
  orientation="horizontal"
  {...props}
/>
