<script module lang="ts">
  import type { Dialog as ShardsDialog } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  export type CommandDialogTriggerProps = ComponentProps<typeof ShardsDialog.Trigger>;
</script>

<script lang="ts">
  import { Dialog as D } from "@shardsui/svelte";
  let { ref = $bindable(null), ...props }: CommandDialogTriggerProps = $props();
</script>

<D.Trigger bind:ref data-slot="command-dialog-trigger" {...props} />
