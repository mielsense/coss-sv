<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar", "badge"],
    id: "p-avatar-10",
    interactive: false,
    responsive: false,
    title: "Avatar count 10",
  });
</script>

<script lang="ts">
  import { Avatar, Badge } from "@coss-sv/ui";
</script>

<div class="relative">
  <Avatar.Root>
    <Avatar.Image
      alt="User"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
    /><Avatar.Fallback>LT</Avatar.Fallback>
  </Avatar.Root><Badge
    class="absolute -end-1 -top-1 rounded-full outline-2 outline-background outline-solid"
    size="sm"
  >
    6
  </Badge>
</div>
