<script lang="ts">
  import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
  import { Button, HugeiconsIcon } from "@coss-sv/ui";

  let { url }: { url: string } = $props();

  let copied = $state(false);
  let error = $state("");

  async function copyMarkdown() {
    error = "";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Markdown request failed with ${response.status}`);
      }

      await navigator.clipboard.writeText(await response.text());
      copied = true;
      window.setTimeout(() => (copied = false), 2_000);
    } catch {
      copied = false;
      error = "Could not copy Markdown.";
    }
  }
</script>

<div class="my-5">
  <Button
    aria-label={copied ? "Copied" : "Copy Markdown"}
    onclick={copyMarkdown}
    size="sm"
    variant="outline"
  >
    <HugeiconsIcon aria-hidden="true" icon={copied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
    {copied ? "Copied" : "Copy Markdown"}
  </Button>
  <span aria-live="polite" class="sr-only">{error}</span>
</div>
