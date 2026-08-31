<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar"],
    id: "p-avatar-5",
    interactive: false,
    responsive: false,
    title: "Avatar group",
  });
</script>

<script lang="ts">
  import { Avatar } from "@coss-sv/ui";
</script>

<div class="flex -space-x-[0.6rem]">
  <Avatar.Root class="ring-2 ring-background">
    <Avatar.Image
      alt="U1"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=96&h=96&dpr=2&q=80"
    /><Avatar.Fallback>U1</Avatar.Fallback>
  </Avatar.Root><Avatar.Root class="ring-2 ring-background">
    <Avatar.Image
      alt="U2"
      src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=96&h=96&dpr=2&q=80"
    /><Avatar.Fallback>U2</Avatar.Fallback>
  </Avatar.Root><Avatar.Root class="ring-2 ring-background">
    <Avatar.Image
      alt="U3"
      src="https://images.unsplash.com/photo-1655874819398-c6dfbec68ac7?w=96&h=96&dpr=2&q=80"
    /><Avatar.Fallback>U3</Avatar.Fallback>
  </Avatar.Root>
</div>
