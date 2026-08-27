<!-- biome-ignore-all lint/a11y/noAutofocus: COSS command palettes focus the search input when opened. -->
<script module lang="ts">
import type { AutocompleteInputProps } from "../autocomplete/autocomplete-input.svelte";
export type CommandInputProps = AutocompleteInputProps;
</script>
<script lang="ts">
import { cn } from "$lib/utils.js";
import AutocompleteInput from "../autocomplete/autocomplete-input.svelte";
let { class: className, ...props }: CommandInputProps = $props();
</script>
{#snippet searchIcon()}
  <svg
    aria-hidden="true"
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="m21 21-4.34-4.34" />
    <circle cx="11" cy="11" r="8" />
  </svg>
{/snippet}
<div class="px-2.5 py-1.5">
  <AutocompleteInput
    autofocus
    class={cn("border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0",className)}
    size="lg"
    startAddon={searchIcon}
    {...props}
  />
</div>
