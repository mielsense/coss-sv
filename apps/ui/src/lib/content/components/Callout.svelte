<script lang="ts">
  import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import * as Alert from "@coss-sv/ui/components/ui/alert";
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    title?: string;
    variant?: "info" | "warning";
  };

  let { children, title, variant = "info" }: Props = $props();
</script>

<Alert.Root class="my-6 bg-muted/24" {variant}>
  <HugeiconsIcon aria-hidden="true" icon={InformationCircleIcon} strokeWidth={2} />
  {#if title}
    <Alert.Title>{title}</Alert.Title>
  {/if}
  <Alert.Description>{@render children()}</Alert.Description>
</Alert.Root>
