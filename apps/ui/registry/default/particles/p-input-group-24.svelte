<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["input-group"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-24",
    interactive: true,
    responsive: false,
    title: "Input group with character counter",
  });
</script>

<script lang="ts">
  import { InputGroup } from "@coss-sv/ui";

  const maxLength = 14;
  let value = $state("");
</script>

<InputGroup.Root>
  <InputGroup.Input
    aria-label="Username"
    {maxLength}
    bind:value
    placeholder="Enter username"
    type="text"
  />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text aria-live="polite" class="text-xs tabular-nums" role="status">
      {value.length}/{maxLength}
    </InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>
