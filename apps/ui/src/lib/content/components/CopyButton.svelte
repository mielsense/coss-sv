<script lang="ts">
  import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
  import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";
  import { Button, HugeiconsIcon, cn } from "@coss-sv/ui";
  import * as Tooltip from "@coss-sv/ui/components/ui/tooltip";
  import { onDestroy } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = HTMLButtonAttributes & { value: string };

  const uid = $props.id();
  const tooltip = Tooltip.TooltipCreateHandle();
  let { value, class: className, id = uid, ...rest }: Props = $props();
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

<Tooltip.Root handle={tooltip}>
  <Button
    {@attach Tooltip.createTriggerAttachment(tooltip, () => ({
      id: id ?? uid,
      ariaDescribedBy: `${uid}-tooltip`,
      disabled: rest.disabled ?? false,
    }))}
    type="button"
    class={cn("size-9 opacity-70 hover:opacity-100 focus-visible:opacity-100 sm:size-8", className)}
    aria-label={label}
    aria-describedby={`${uid}-tooltip`}
    data-slot="copy-button"
    id={id ?? uid}
    {...rest}
    onclick={copy}
    size="icon"
    variant="ghost"
  >
    <HugeiconsIcon
      aria-hidden="true"
      class="size-5 sm:size-4"
      icon={status === "copied" ? Tick02Icon : Copy01Icon}
      strokeWidth={2}
    />
  </Button>
  <Tooltip.Popup id={`${uid}-tooltip`}>{label}</Tooltip.Popup>
</Tooltip.Root>
