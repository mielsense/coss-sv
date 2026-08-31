<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["number-field"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-number-field-9",
    interactive: true,
    responsive: false,
    title: "Number field with step",
  });
</script>

<script lang="ts">
  import { NumberField } from "@coss-sv/ui";
</script>

<div class="flex flex-col gap-6">
  <NumberField.Root defaultValue={0} step={10}>
    <NumberField.ScrubArea label="Step 10" />
    <NumberField.Group>
      <NumberField.Decrement /><NumberField.Input /><NumberField.Increment />
    </NumberField.Group>
  </NumberField.Root><NumberField.Root defaultValue={0} step={0.1}>
    <NumberField.ScrubArea label="Step 0.1" />
    <NumberField.Group>
      <NumberField.Decrement /><NumberField.Input /><NumberField.Increment />
    </NumberField.Group>
  </NumberField.Root>
</div>
