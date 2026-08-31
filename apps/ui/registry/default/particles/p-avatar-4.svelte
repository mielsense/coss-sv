<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar"],
    id: "p-avatar-4",
    interactive: false,
    responsive: false,
    title: "Avatar radii",
  });
</script>

<script lang="ts">
  import { Avatar } from "@coss-sv/ui";
</script>

<div class="flex items-center gap-4">
  <Avatar.Root class="rounded-md">
    <Avatar.Image
      alt="User"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
    /><Avatar.Fallback>AV</Avatar.Fallback>
  </Avatar.Root><Avatar.Root class="rounded-xl">
    <Avatar.Image
      alt="User"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
    /><Avatar.Fallback>AV</Avatar.Fallback>
  </Avatar.Root><Avatar.Root class="rounded-full">
    <Avatar.Image
      alt="User"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
    /><Avatar.Fallback>AV</Avatar.Fallback>
  </Avatar.Root>
</div>
