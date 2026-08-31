<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar"],
    id: "p-avatar-2",
    interactive: false,
    responsive: false,
    title: "Avatar fallback only",
  });
</script>

<script lang="ts">
  import { Avatar } from "@coss-sv/ui";
</script>

<Avatar.Root><Avatar.Fallback>LT</Avatar.Fallback></Avatar.Root>
