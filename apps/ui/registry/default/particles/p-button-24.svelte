<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-24",
  interactive: true,
  responsive: true,
  title: "Social login icon buttons",
});
</script>

<script lang="ts">
import {
  Facebook01Icon,
  Github01Icon,
  GoogleIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button } from "@coss-sv/ui";

const providers = [
  { icon: GoogleIcon, label: "Google" },
  { icon: Facebook01Icon, label: "Facebook" },
  { icon: NewTwitterIcon, label: "X" },
  { icon: Github01Icon, label: "GitHub" },
];
</script>

<div class="inline-flex flex-wrap gap-2">
  {#each providers as provider (provider.label)}
    <Button aria-label={`Login with ${provider.label}`} size="icon" variant="outline">
      <HugeiconsIcon aria-hidden="true" icon={provider.icon} strokeWidth={2} />
    </Button>
  {/each}
</div>
