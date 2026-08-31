<script lang="ts">
  import { useCopyToClipboard } from "../../../registry/default/hooks/use-copy-to-clipboard.svelte.js";

  let { onCopy }: { onCopy?: () => void } = $props();
  const clipboard = useCopyToClipboard({ onCopy: () => onCopy?.() });
</script>

<button onclick={() => clipboard.copyToClipboard("https://coss.com")} type="button">
  {clipboard.isCopied ? "Copied!" : "Copy"}
</button>
<button onclick={() => clipboard.copyToClipboard("")} type="button">Copy empty</button>
