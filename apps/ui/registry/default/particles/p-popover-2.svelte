<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "popover"],
  id: "p-popover-2",
  interactive: true,
  responsive: true,
  title: "Popover close controls",
});
</script>
<script lang="ts">
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Popover, buttonVariants } from "@coss-sv/ui";
</script>
<Popover.Root
  ><Popover.Trigger class={buttonVariants({ variant: "outline" })}>Open Popover</Popover.Trigger
  ><Popover.Popup class="w-80"
    ><Popover.Close
      aria-label="Close"
      class={buttonVariants({ class: "absolute end-2 top-2", size: "icon", variant: "ghost" })}
      ><HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} /></Popover.Close
    >
    <div class="mb-2">
      <Popover.Title class="text-base">Notifications</Popover.Title
      ><Popover.Description>You are all caught up. Good job!</Popover.Description>
    </div>
    <Popover.Close class={buttonVariants({ variant: "outline" })}
      >Close</Popover.Close
    ></Popover.Popup
  ></Popover.Root
>
