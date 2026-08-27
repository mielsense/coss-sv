<script lang="ts">
import { Alert, AlertDescription, AlertTitle } from "./index.js";

let clicks = $state(0);
let ref = $state<HTMLDivElement | null>(null);
</script>

<Alert bind:ref data-testid="alert" onclick={() => (clicks += 1)} variant="error">
  <AlertTitle>Upload failed</AlertTitle>
  <AlertDescription>Try again.</AlertDescription>
</Alert>
<output data-testid="state">{clicks}:{ref?.tagName ?? "missing"}</output>
