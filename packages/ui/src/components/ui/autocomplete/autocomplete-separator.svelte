<script module lang="ts">
import type { SvelteHTMLElements } from "svelte/elements";
export type AutocompleteSeparatorProps = Omit<SvelteHTMLElements["div"], "children" | "id"> & {
  as?: keyof HTMLElementTagNameMap;
  ref?: HTMLElement | null;
  id?: string;
  orientation?: "horizontal" | "vertical";
};
</script>
<script lang="ts">
import Part from "./autocomplete-parts.svelte";

let { ref = $bindable(null), ...props }: AutocompleteSeparatorProps = $props();
</script>
<Part bind:ref kind="separator" {...props} />
