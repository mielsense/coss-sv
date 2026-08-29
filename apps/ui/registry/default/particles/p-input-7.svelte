<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "group", "input"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-7",
    interactive: true,
    responsive: false,
    title: "Input with button using Group",
  });
</script>

<script lang="ts">
  import { Button, Group, Input } from "@coss-sv/ui";
</script>

<Group.Root aria-label="Email subscription" class="gap-2">
  <Input aria-label="Email" class="flex-1" placeholder="you@example.com" type="email" />
  <div><Button variant="outline">Send</Button></div>
</Group.Root>
