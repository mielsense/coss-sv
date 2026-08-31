<script lang="ts">
  import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
  import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { onDestroy } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = HTMLButtonAttributes & { value: string };

  let { value, class: className, ...rest }: Props = $props();
  let status = $state<"idle" | "copied" | "error">("idle");
  let mounted = true;
  let resetTimer: number | undefined;
  const label = $derived(
    status === "copied" ? "Copied" : status === "error" ? "Copy failed" : "Copy to clipboard",
  );

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      if (!mounted) return;
      status = "copied";
    } catch {
      if (!mounted) return;
      status = "error";
    }
    if (resetTimer) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      status = "idle";
    }, 1_500);
  }

  onDestroy(() => {
    mounted = false;
    if (resetTimer) window.clearTimeout(resetTimer);
  });
</script>

<button
  type="button"
  class={`inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground opacity-70 transition-colors hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:opacity-100 ${className ?? ""}`}
  aria-label={label}
  title={label}
  {...rest}
  onclick={copy}
>
  <HugeiconsIcon
    aria-hidden="true"
    icon={status === "copied" ? Tick02Icon : Copy01Icon}
    strokeWidth={2}
  />
</button>
