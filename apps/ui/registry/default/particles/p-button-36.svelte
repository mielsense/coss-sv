<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button"],
  id: "p-button-36",
  interactive: true,
  responsive: false,
  title: "Copy button with feedback",
});
</script>

<script lang="ts">
import { Button } from "@coss-sv/ui";
import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";

let copied = $state(false);

async function copy() {
  await navigator.clipboard.writeText("Text copied!");
  copied = true;
  window.setTimeout(() => (copied = false), 2000);
}
</script>

<Button onclick={copy} variant="outline">
  <HugeiconsIcon aria-hidden="true" icon={copied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
  {copied ? "Copied" : "Copy"}
</Button>
