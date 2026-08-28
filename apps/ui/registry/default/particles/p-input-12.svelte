<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["input-group", "spinner"],
    id: "p-input-12",
    interactive: false,
    responsive: false,
    title: "Spinner in an input group",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { InputGroup, InputGroupAddon, InputGroupInput, Spinner } from "@coss-sv/ui";
</script>

<InputGroup
  ><InputGroupInput disabled placeholder="Processing…" type="search" /><InputGroupAddon
    ><Spinner /></InputGroupAddon
  ></InputGroup
>
