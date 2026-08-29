<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar", "button"],
    id: "p-button-28",
    interactive: true,
    responsive: false,
    title: "Button with avatar",
  });
</script>

<script lang="ts">
  import { Avatar, Button } from "@coss-sv/ui";
</script>

<Button class="rounded-full ps-1">
  <Avatar.Root class="size-6">
    <Avatar.Image
      alt="Luke Tracy"
      src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=128&h=128&dpr=2&q=80"
    />
    <Avatar.Fallback>LT</Avatar.Fallback>
  </Avatar.Root>
  @georgelucas
</Button>
