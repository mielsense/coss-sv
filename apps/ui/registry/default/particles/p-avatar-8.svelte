<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar"],
    id: "p-avatar-8",
    interactive: false,
    responsive: false,
    title: "Avatar status 8",
  });
</script>

<script lang="ts">
  import { Avatar } from "@coss-sv/ui";
</script>

<div class="relative">
  <Avatar.Root>
    <Avatar.Image
      alt="User"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
    /><Avatar.Fallback>LT</Avatar.Fallback>
  </Avatar.Root>
  <span
    aria-hidden="true"
    class="absolute end-0 bottom-0 size-2 rounded-full bg-muted-foreground outline-2 outline-background"
  ></span>
</div>
