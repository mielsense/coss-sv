<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["field", "textarea"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-textarea-11",
  interactive: true,
  responsive: false,
  title: "Textarea with characters remaining counter",
});
</script>

<script lang="ts">
import { Field, Textarea } from "@coss-sv/ui";

const maxLength = 280;
let value = $state("");
</script>

<Field.Root>
  <Textarea aria-label="Message" {maxLength} bind:value placeholder="Type your message here" />
  <Field.Description>
    <span class="tabular-nums">{maxLength - value.length}</span>
    characters left
  </Field.Description>
</Field.Root>
