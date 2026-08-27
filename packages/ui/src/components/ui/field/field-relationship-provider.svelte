<script lang="ts">
import type { Snippet } from "svelte";
import {
  FieldRelationshipState,
  setFieldRelationshipContext,
} from "./relationship-context.svelte.js";

let {
  children,
  describedBy = $bindable(),
  labelId = $bindable(),
}: {
  children?: Snippet;
  describedBy?: string | undefined;
  labelId?: string | undefined;
} = $props();

setFieldRelationshipContext(
  new FieldRelationshipState(
    () => labelId,
    (next) => (labelId = next),
    () => describedBy,
    (next) => (describedBy = next),
  ),
);
</script>

{@render children?.()}
