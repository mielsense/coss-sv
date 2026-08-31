<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-38",
    interactive: true,
    responsive: true,
    title: "Social login buttons",
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import Github01Icon from "@hugeicons/core-free-icons/Github01Icon";
  import GoogleIcon from "@hugeicons/core-free-icons/GoogleIcon";
  import NewTwitterIcon from "@hugeicons/core-free-icons/NewTwitterIcon";

  const providers = [
    { icon: GoogleIcon, label: "Google" },
    { icon: NewTwitterIcon, label: "X" },
    { icon: Github01Icon, label: "GitHub" },
  ];
</script>

<div class="flex flex-col gap-2">
  {#each providers as provider (provider.label)}
    <Button variant="outline">
      <HugeiconsIcon aria-hidden="true" icon={provider.icon} strokeWidth={2} />
      <span class="flex-1">Login with {provider.label}</span>
    </Button>
  {/each}
</div>
