<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["alert"],
    id: "p-alert-6",
    interactive: false,
    responsive: true,
    title: "Alert example 6",
  });
</script>

<script lang="ts">
  import { Alert, AlertDescription, AlertTitle } from "@coss-sv/ui";
  import { Alert02Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Alert variant="warning"
  ><HugeiconsIcon aria-hidden="true" icon={Alert02Icon} strokeWidth={2} /><AlertTitle
    >Heads up!</AlertTitle
  ><AlertDescription>Describe what can be done about it here.</AlertDescription></Alert
>
