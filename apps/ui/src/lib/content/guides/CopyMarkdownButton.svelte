<script lang="ts">
  import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
  import { Button, HugeiconsIcon } from "@coss-sv/ui";
  import { onDestroy } from "svelte";

  let { url }: { url: string } = $props();

  let copied = $state(false);
  let error = $state("");
  let timer: number | undefined;
  let controller: AbortController | undefined;
  let destroyed = false;
  let generation = 0;

  function clearFeedbackTimer(): void {
    clearTimeout(timer);
    timer = undefined;
  }

  function isCurrent(operation: number, signal: AbortSignal): boolean {
    return !destroyed && operation === generation && !signal.aborted;
  }

  function destroy(): void {
    destroyed = true;
    generation += 1;
    controller?.abort();
    controller = undefined;
    clearFeedbackTimer();
  }

  async function copyMarkdown(): Promise<void> {
    if (destroyed) return;

    const operation = ++generation;
    controller?.abort();
    const requestController = new AbortController();
    controller = requestController;
    error = "";

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!isCurrent(operation, requestController.signal)) return;
      if (!response.ok) {
        throw new Error(`Markdown request failed with ${response.status}`);
      }

      const markdown = await response.text();
      if (!isCurrent(operation, requestController.signal)) return;

      await navigator.clipboard.writeText(markdown);
      if (!isCurrent(operation, requestController.signal)) return;

      clearFeedbackTimer();
      copied = true;
      const feedbackTimer = window.setTimeout(() => {
        if (timer === feedbackTimer) timer = undefined;
        if (!isCurrent(operation, requestController.signal)) return;
        copied = false;
      }, 2_000);
      timer = feedbackTimer;
    } catch {
      if (!isCurrent(operation, requestController.signal)) return;
      clearFeedbackTimer();
      copied = false;
      error = "Could not copy Markdown.";
    } finally {
      if (controller === requestController) controller = undefined;
    }
  }

  onDestroy(destroy);
</script>

<div class="my-5">
  <Button aria-label="Copy Markdown" onclick={copyMarkdown} size="sm" variant="outline">
    <HugeiconsIcon aria-hidden="true" icon={copied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
    Copy Markdown
  </Button>
  <span aria-live="polite" class="sr-only">{error}</span>
</div>
