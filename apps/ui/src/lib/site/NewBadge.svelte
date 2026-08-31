<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  let { class: className, ...props }: HTMLAttributes<HTMLSpanElement> = $props();
</script>

<span
  class={[
    "inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-sm border border-transparent bg-info/8 px-0.75 text-info-foreground text-xs leading-4 font-medium dark:bg-info/16",
    className,
  ]}
  {...props}>New</span
>
