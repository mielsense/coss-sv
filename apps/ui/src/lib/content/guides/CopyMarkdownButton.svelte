<script lang="ts">
  import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
  import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
  import { Button, HugeiconsIcon } from "@coss-sv/ui";

  let { url }: { url: string } = $props();

  let copied = $state(false);
  let error = $state("");
  let timer: number | undefined;
  let controller: AbortController | undefined;
  let generation = 0;

  function clearFeedbackTimer(): void {
    clearTimeout(timer);
    timer = undefined;
  }

  function isCurrent(operation: number, signal: AbortSignal): boolean {
    return operation === generation && !signal.aborted;
  }

  async function copyMarkdown(): Promise<void> {
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

  $effect(() => {
    void url;

    return () => {
      generation += 1;
      controller?.abort();
      controller = undefined;
      clearFeedbackTimer();
      copied = false;
      error = "";
    };
  });
</script>

<Button aria-label="Copy Markdown" onclick={copyMarkdown} size="xs" variant="outline">
  <HugeiconsIcon aria-hidden="true" icon={copied ? Tick02Icon : Copy01Icon} strokeWidth={2.5} />
  Copy Markdown
</Button>
<span aria-live="polite" class="sr-only">{error}</span>
