<!-- biome-ignore-all lint/a11y/noAutofocus: COSS command palettes focus the search input when opened. -->
<script module lang="ts">
  import type { AutocompleteInputProps } from "../autocomplete/autocomplete-input.svelte";
  export type CommandInputProps = AutocompleteInputProps;
</script>

<script lang="ts">
  import { Search01Icon } from "@hugeicons/core-free-icons";
  import HugeiconsIcon from "$lib/hugeicons-icon.svelte";
  import { cn } from "$lib/utils.js";
  import AutocompleteInput from "../autocomplete/autocomplete-input.svelte";

  let { class: className, ...props }: CommandInputProps = $props();
</script>

{#snippet searchIcon()}
  <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
{/snippet}
<div class="px-2.5 py-1.5">
  <AutocompleteInput
    autofocus
    class={cn(
      "border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0",
      className,
    )}
    size="lg"
    startAddon={searchIcon}
    {...props}
  />
</div>
