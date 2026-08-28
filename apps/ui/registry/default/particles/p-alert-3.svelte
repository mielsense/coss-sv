<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["alert", "button"],
    id: "p-alert-3",
    interactive: true,
    responsive: true,
    title: "Alert example 3",
  });
</script>

<script lang="ts">
  import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from "@coss-sv/ui";
  import { InformationCircleIcon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Alert
  ><HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} /><AlertTitle
    >Heads up!</AlertTitle
  ><AlertDescription>Describe what can be done about it here.</AlertDescription><AlertAction
    ><Button size="xs" variant="ghost">Dismiss</Button><Button size="xs">Ok</Button></AlertAction
  ></Alert
>
