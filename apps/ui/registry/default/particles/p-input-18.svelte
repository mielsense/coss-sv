<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["field", "input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-18",
    interactive: true,
    responsive: false,
    title: "Input with characters remaining counter",
  });
</script>

<script lang="ts">
  import { Field, Input } from "@coss-sv/ui";

  const maxLength = 14;
  let value = $state("");
</script>

<Field.Root>
  <Input aria-label="Code" {maxLength} bind:value placeholder="Enter code" type="text" />
  <Field.Description>
    <span class="tabular-nums">{maxLength - value.length}</span>
    characters left
  </Field.Description>
</Field.Root>
