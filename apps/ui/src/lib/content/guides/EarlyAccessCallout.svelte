<script lang="ts">
  import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import * as Alert from "@coss-sv/ui/components/ui/alert";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<Alert.Root class="my-6 bg-muted/24">
  <HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} />
  <Alert.Title>Early Access</Alert.Title>
  <Alert.Description>{@render children()}</Alert.Description>
</Alert.Root>
