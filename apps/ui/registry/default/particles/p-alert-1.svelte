<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["alert"],
    id: "p-alert-1",
    interactive: false,
    responsive: true,
    title: "Alert example 1",
  });
</script>

<script lang="ts">
  import { Alert, AlertDescription, AlertTitle } from "@coss-sv/ui";
</script>

<Alert>
  <AlertTitle>Heads up!</AlertTitle><AlertDescription>
    <p>Describe what can be done about it here.</p>
  </AlertDescription>
</Alert>
