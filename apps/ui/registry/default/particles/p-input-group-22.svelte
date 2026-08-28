<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "input-group"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-group-22",
  interactive: true,
  responsive: false,
  title: "Input group with clear button",
});
</script>
<script lang="ts">
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, InputGroup } from "@coss-sv/ui";
let value = $state("Clear me");
</script>
<InputGroup.Root>
  <InputGroup.Input
    aria-label="Text input with clear button"
    bind:value
    placeholder="Enter text"
    type="text"
  />
  {#if value}
    <InputGroup.Addon align="inline-end">
      <Button aria-label="Clear input" onclick={() => (value = "")} size="icon-xs" variant="ghost">
        <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
      </Button>
    </InputGroup.Addon>
  {/if}
</InputGroup.Root>
