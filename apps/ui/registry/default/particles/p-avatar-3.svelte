<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar"],
    id: "p-avatar-3",
    interactive: false,
    responsive: true,
    title: "Avatar sizes",
  });
</script>

<script lang="ts">
  import { Avatar } from "@coss-sv/ui";
</script>

<div class="flex items-center gap-4">
  <Avatar.Root
    ><Avatar.Image
      alt="User"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80"
    /><Avatar.Fallback>AV</Avatar.Fallback></Avatar.Root
  ><Avatar.Root class="size-12"
    ><Avatar.Image
      alt="User"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=144&h=144&dpr=2&q=80"
    /><Avatar.Fallback>AV</Avatar.Fallback></Avatar.Root
  ><Avatar.Root class="size-16"
    ><Avatar.Image
      alt="User"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=192&h=192&dpr=2&q=80"
    /><Avatar.Fallback>AV</Avatar.Fallback></Avatar.Root
  >
</div>
