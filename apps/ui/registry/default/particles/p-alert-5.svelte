<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["alert"],
    id: "p-alert-5",
    interactive: false,
    responsive: true,
    title: "Alert example 5",
  });
</script>

<script lang="ts">
  import { Alert, AlertDescription, AlertTitle, HugeiconsIcon } from "@coss-sv/ui";
  import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon";
</script>

<Alert variant="success">
  <HugeiconsIcon aria-hidden="true" icon={CheckmarkCircle02Icon} strokeWidth={2} /><AlertTitle>
    Heads up!
  </AlertTitle><AlertDescription>Describe what can be done about it here.</AlertDescription>
</Alert>
