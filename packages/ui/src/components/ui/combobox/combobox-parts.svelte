<script module lang="ts">
import type { Combobox as ShardsCombobox } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
export type ComboboxPartKind = "empty" | "group" | "group-label" | "row" | "separator" | "status";
export type ComboboxPartProps = ComponentProps<typeof ShardsCombobox.Empty> & {
  kind: ComboboxPartKind;
};
</script>
<script lang="ts">
import { Combobox as C } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";
let { class: className, kind, ref = $bindable(null), ...props }: ComboboxPartProps = $props();
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
{#if kind==="empty"}
  <C.Empty bind:ref class={classes} data-slot="combobox-empty" {...props} />
{:else if kind==="group"}
  <C.Group bind:ref class={classes} data-slot="combobox-group" {...props} />
{:else if kind==="group-label"}
  <C.GroupLabel bind:ref class={classes} data-slot="combobox-group-label" {...props} />
{:else if kind==="row"}
  <C.Row bind:ref class={classes} data-slot="combobox-row" {...props} />
{:else if kind==="separator"}
  <C.Separator bind:ref class={classes} data-slot="combobox-separator" {...props} />
{:else}
  <C.Status bind:ref class={classes} data-slot="combobox-status" {...props} />
{/if}
