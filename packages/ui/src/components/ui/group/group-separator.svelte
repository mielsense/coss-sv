<script module lang="ts">
  import type { SeparatorProps } from "../separator/separator.svelte";

  export type GroupSeparatorProps = SeparatorProps;
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";
  import Separator from "../separator/separator.svelte";

  let {
    class: className,
    orientation = "vertical",
    ref = $bindable(null),
    ...props
  }: GroupSeparatorProps = $props();

  const baseClass =
    "pointer-events-none relative z-2 bg-input before:absolute before:inset-0 has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:translate-x-px has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:bg-ring dark:before:bg-input/32 [[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+&,[data-slot=number-field]:focus-within+input+&]:bg-ring [[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+input+&]:-translate-x-px";
</script>

<Separator bind:ref {orientation} class={cn(baseClass, className)} {...props} />
