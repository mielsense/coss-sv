<script lang="ts">
  import { InformationCircleIcon } from "@hugeicons/core-free-icons";
  import { Alert, AlertDescription, AlertTitle, HugeiconsIcon } from "@coss-sv/ui";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<Alert class="bg-muted/24">
  <HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} />
  <AlertTitle>Early Access</AlertTitle>
  <AlertDescription>{@render children()}</AlertDescription>
</Alert>
