<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["input-group"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-3",
    interactive: true,
    responsive: false,
    title: "Input group with start text",
  });
</script>

<script lang="ts">
  import { InputGroup } from "@coss-sv/ui";
</script>

<InputGroup.Root>
  <InputGroup.Input
    aria-label="Set your URL"
    class="*:[input]:ps-0!"
    placeholder="coss"
    type="search"
  /><InputGroup.Addon><InputGroup.Text>i.cal.com/</InputGroup.Text></InputGroup.Addon>
</InputGroup.Root>
