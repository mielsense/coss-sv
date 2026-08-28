<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "input-group"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-group-15",
  interactive: true,
  responsive: false,
  title: "Disabled input group",
});
</script>
<script lang="ts">
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, InputGroup } from "@coss-sv/ui";
</script>
<InputGroup.Root
  ><InputGroup.Input
    aria-label="Subscribe to our newsletter"
    disabled
    placeholder="Your best email"
    type="email"
  /><InputGroup.Addon align="inline-end"
    ><Button aria-label="Subscribe" disabled size="icon-xs" variant="ghost"
      ><HugeiconsIcon aria-hidden="true" icon={ArrowRight01Icon} strokeWidth={2} /></Button
    ></InputGroup.Addon
  ></InputGroup.Root
>
