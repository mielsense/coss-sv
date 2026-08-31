<script module lang="ts">
  import type { AutocompleteRootProps } from "../autocomplete/autocomplete-root.svelte";
  export type CommandRootProps<Item = unknown> = AutocompleteRootProps<Item>;
</script>

<script lang="ts" generics="Item = unknown">
  import AutocompleteRoot from "../autocomplete/autocomplete-root.svelte";
  let {
    autoHighlight = "always",
    children,
    inline = true,
    keepHighlight = true,
    open = true,
    ...props
  }: CommandRootProps<Item> = $props();
</script>

<AutocompleteRoot {autoHighlight} {inline} {keepHighlight} {open} {...props}
  >{@render children?.()}</AutocompleteRoot
>
