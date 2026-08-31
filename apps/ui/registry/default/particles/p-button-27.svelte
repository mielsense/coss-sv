<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button", "group"],
    id: "p-button-27",
    interactive: true,
    responsive: false,
    title: "QR sign-in group",
  });
</script>

<script lang="ts">
  import { Button, Group, HugeiconsIcon } from "@coss-sv/ui";
  import QrCodeIcon from "@hugeicons/core-free-icons/QrCodeIcon";
</script>

<Group.Root>
  <Button aria-label="QR code" size="icon">
    <HugeiconsIcon aria-hidden="true" icon={QrCodeIcon} strokeWidth={2} />
  </Button><Group.Separator class="bg-primary/72" /><Button>Sign in</Button>
</Group.Root>
