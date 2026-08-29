<script module lang="ts">
  import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type CommandRootProps = ComponentProps<typeof ShardsAutocomplete.Root>;
</script>

<script lang="ts">
  import { Autocomplete as A } from "@shardsui/svelte";
  let {
    autoHighlight = "always",
    children,
    inline = true,
    keepHighlight = true,
    open = true,
    ...props
  }: CommandRootProps = $props();
</script>

<A.Root {autoHighlight} {inline} {keepHighlight} {open} {...props}>{@render children?.()}</A.Root>
