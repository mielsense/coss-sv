<script module lang="ts">
import { Field as FieldPrimitive } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type FieldDescriptionProps = ComponentProps<typeof FieldPrimitive.Description>;
</script>

<script lang="ts">
import { untrack } from "svelte";
import { cn } from "$lib/utils.js";
import { getFieldRelationshipContext } from "./relationship-context.svelte.js";

const uid = $props.id();
let {
  class: className,
  id = uid,
  ref = $bindable(null),
  ...props
}: FieldDescriptionProps = $props();
const relationships = getFieldRelationshipContext();
untrack(() => relationships?.registerInitialMessageId(id));
$effect(() => {
  const nextId = id;
  return untrack(() => relationships?.registerMessageId(nextId));
});
</script>

<FieldPrimitive.Description
  bind:ref
  data-slot="field-description"
  class={cn("text-muted-foreground text-xs", className)}
  {id}
  {...props}
/>
