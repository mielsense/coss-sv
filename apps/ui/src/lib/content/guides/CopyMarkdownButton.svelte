<script lang="ts">
  import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import { onDestroy } from "svelte";

  let { url }: { url: string } = $props();

  let copied = $state(false);
  let error = $state("");
  let timer: number | undefined;

  function clearFeedbackTimer(): void {
    clearTimeout(timer);
    timer = undefined;
  }

  async function copyMarkdown() {
    error = "";

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Markdown request failed with ${response.status}`);
      }

      await navigator.clipboard.writeText(await response.text());
      clearFeedbackTimer();
      copied = true;
      timer = window.setTimeout(() => {
        copied = false;
        timer = undefined;
      }, 2_000);
    } catch {
      clearFeedbackTimer();
      copied = false;
      error = "Could not copy Markdown.";
    }
  }

  onDestroy(clearFeedbackTimer);
</script>

<div class="my-5">
  <Button aria-label="Copy Markdown" onclick={copyMarkdown} size="sm" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={copied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
    Copy Markdown
  </Button>
  <span aria-live="polite" class="sr-only">{error}</span>
</div>
