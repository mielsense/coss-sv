<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["avatar"],
    id: "p-avatar-12",
    interactive: false,
    responsive: false,
    title: "Verified avatar",
  });
</script>

<script lang="ts">
  import { Avatar, HugeiconsIcon } from "@coss-sv/ui";
  import { CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
</script>

<div class="relative">
  <Avatar.Root
    ><Avatar.Image
      alt="User"
      src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80"
    /><Avatar.Fallback>LT</Avatar.Fallback></Avatar.Root
  ><span class="absolute -end-1.5 -top-1.5"
    ><span class="sr-only">Verified</span><HugeiconsIcon
      aria-hidden="true"
      class="size-5 fill-primary text-background"
      icon={CheckmarkBadge01Icon}
      strokeWidth={2}
    /></span
  >
</div>
