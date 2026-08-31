<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["button"],
    id: "p-button-35",
    interactive: true,
    responsive: false,
    title: "Icon-only copy button",
  });
</script>

<script lang="ts">
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
  import Tick01Icon from "@hugeicons/core-free-icons/Tick01Icon";
  import { onDestroy } from "svelte";

  let copied = $state(false);
  let mounted = true;
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    await navigator.clipboard.writeText("Text copied!");
    if (!mounted) return;
    copied = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copied = false), 2000);
  }

  onDestroy(() => {
    mounted = false;
    clearTimeout(resetTimer);
  });
</script>

<Button
  aria-label={copied ? "Copied" : "Copy to clipboard"}
  onclick={copy}
  size="icon"
  variant="outline"
>
  <HugeiconsIcon aria-hidden="true" icon={copied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
</Button>
