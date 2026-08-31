<script module lang="ts">
  import type { Dialog as ShardsDialog } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";
  export type CommandDialogTriggerProps = ComponentProps<typeof ShardsDialog.Trigger>;
</script>

<script lang="ts">
  import { Dialog as D } from "@shardsui/svelte/dialog";
  import { getSelectionChangeContext } from "@/selection-change-context.js";
  let { onclick, ref = $bindable(null), ...props }: CommandDialogTriggerProps = $props();
  const change = getSelectionChangeContext();

  function handleClick(event: Parameters<NonNullable<CommandDialogTriggerProps["onclick"]>>[0]) {
    change?.prepare("trigger-press", event);
    onclick?.(event);
  }
</script>

<D.Trigger bind:ref data-slot="command-dialog-trigger" onclick={handleClick} {...props} />
