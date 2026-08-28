<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["alert"],
    id: "p-alert-4",
    interactive: false,
    responsive: true,
    title: "Alert example 4",
  });
</script>

<script lang="ts">
  import { Alert, AlertDescription, AlertTitle } from "@coss-sv/ui";
  import { InformationCircleIcon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Alert variant="info"
  ><HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} /><AlertTitle
    >Heads up!</AlertTitle
  ><AlertDescription>Describe what can be done about it here.</AlertDescription></Alert
>
