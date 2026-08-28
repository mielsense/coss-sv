<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["input-group"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-group-1",
  interactive: true,
  responsive: false,
  title: "Basic input group",
});
</script>
<script lang="ts">
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { InputGroup } from "@coss-sv/ui";
</script>
<InputGroup.Root
  ><InputGroup.Input aria-label="Search" placeholder="Search" type="search" />
  <InputGroup.Addon
    ><HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} /></InputGroup.Addon
  ></InputGroup.Root
>
