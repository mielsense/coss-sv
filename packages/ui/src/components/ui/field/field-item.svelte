<script module lang="ts">
import { Field as FieldPrimitive } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type FieldItemProps = ComponentProps<typeof FieldPrimitive.Item>;
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: FieldItemProps = $props();
</script>

<FieldPrimitive.Item bind:ref data-slot="field-item" class={cn("flex", className)} {...props} />
