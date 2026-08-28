<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar"],
    id: "p-avatar-6",
    interactive: false,
    responsive: false,
    title: "Avatar icon fallback",
  });
</script>

<script lang="ts">
  import { Avatar } from "@coss-sv/ui";
  import { UserIcon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Avatar.Root
  ><Avatar.Fallback
    ><HugeiconsIcon
      aria-hidden="true"
      class="size-4"
      icon={UserIcon}
      strokeWidth={2}
    /></Avatar.Fallback
  ></Avatar.Root
>
