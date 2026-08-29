<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["input-group"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-4",
    interactive: true,
    responsive: false,
    title: "Input group with end text",
  });
</script>

<script lang="ts">
  import { InputGroup } from "@coss-sv/ui";
</script>

<InputGroup.Root
  ><InputGroup.Input aria-label="Choose a username" placeholder="Choose a username" type="text" />
  <InputGroup.Addon align="inline-end"
    ><InputGroup.Text>@coss.com</InputGroup.Text></InputGroup.Addon
  ></InputGroup.Root
>
