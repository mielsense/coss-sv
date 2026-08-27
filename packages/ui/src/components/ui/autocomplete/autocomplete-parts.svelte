<script module lang="ts">
import type { Autocomplete as ShardsAutocomplete } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type AutocompletePartKind =
  | "empty"
  | "group"
  | "group-label"
  | "row"
  | "separator"
  | "status";
export type AutocompletePartProps = ComponentProps<typeof ShardsAutocomplete.Empty> & {
  kind: AutocompletePartKind;
};
</script>
<script lang="ts">
import { Autocomplete as A } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, kind, ref = $bindable(null), ...props }: AutocompletePartProps = $props();
const classes = $derived(
  cn(
    kind === "empty" && "not-empty:p-2 text-center text-base text-muted-foreground sm:text-sm",
    kind === "group" && "[[role=group]+&]:mt-1.5",
    kind === "group-label" && "px-2 py-1.5 font-medium text-muted-foreground text-xs",
    kind === "separator" && "mx-2 my-1 h-px bg-border last:hidden",
    kind === "status" && "px-3 py-2 font-medium text-muted-foreground text-xs empty:m-0 empty:p-0",
    className,
  ),
);
</script>
{#if kind === "empty"}
  <A.Empty bind:ref class={classes} data-slot="autocomplete-empty" {...props} />
{:else if kind === "group"}
  <A.Group bind:ref class={classes} data-slot="autocomplete-group" {...props} />
{:else if kind === "group-label"}
  <A.GroupLabel bind:ref class={classes} data-slot="autocomplete-group-label" {...props} />
{:else if kind === "row"}
  <A.Row bind:ref class={classes} data-slot="autocomplete-row" {...props} />
{:else if kind === "separator"}
  <A.Separator bind:ref class={classes} data-slot="autocomplete-separator" {...props} />
{:else}
  <A.Status bind:ref class={classes} data-slot="autocomplete-status" {...props} />
{/if}
