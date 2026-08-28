<script module lang="ts">
  import { Field as FieldPrimitive } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";

  export type FieldItemProps = ComponentProps<typeof FieldPrimitive.Item>;
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";
  import FieldRelationshipProvider from "./field-relationship-provider.svelte";

  const uid = $props.id();
  const defaultControlId = `${uid}-control`;

  let {
    children: child,
    class: className,
    ref = $bindable(null),
    ...props
  }: FieldItemProps = $props();
  let relationshipLabelId = $state<string | undefined>();
  let relationshipDescribedBy = $state<string | undefined>();
</script>

<FieldPrimitive.Item bind:ref data-slot="field-item" class={cn("flex", className)} {...props}>
  {#snippet children(state)}
    <FieldRelationshipProvider
      bind:describedBy={relationshipDescribedBy}
      bind:labelId={relationshipLabelId}
      {defaultControlId}
    >
      {@render child?.(state)}
    </FieldRelationshipProvider>
  {/snippet}
</FieldPrimitive.Item>
