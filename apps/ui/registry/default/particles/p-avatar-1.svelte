<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar"],
    id: "p-avatar-1",
    interactive: false,
    responsive: false,
    title: "Avatar with image and fallback",
  });
</script>

<script lang="ts">
  import { Avatar } from "@coss-sv/ui";
</script>

<Avatar.Root>
  <Avatar.Image
    alt="Luke Tracy"
    src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
  /><Avatar.Fallback>LT</Avatar.Fallback>
</Avatar.Root>
