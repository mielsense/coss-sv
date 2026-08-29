<script module lang="ts">
  import type { Dialog as ShardsDialog } from "@shardsui/svelte";
  import type { ComponentProps } from "svelte";
  type PrimitiveTriggerProps = ComponentProps<typeof ShardsDialog.Trigger>;
  export type DialogTriggerProps<Payload = unknown> = Omit<
    PrimitiveTriggerProps,
    "handle" | "payload"
  > & {
    handle?: ShardsDialog.Handle<Payload>;
    payload?: Payload;
    children?: PrimitiveTriggerProps["children"];
  };
</script>

<script lang="ts" generics="Payload = unknown">
  import { Dialog as DialogPrimitive } from "@shardsui/svelte";
  let { ref = $bindable(null), ...props }: DialogTriggerProps<Payload> = $props();
</script>

<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {...props} />
