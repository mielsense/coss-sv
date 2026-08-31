<script module lang="ts">
  import type { AlertDialog as ShardsP } from "@shardsui/svelte/alert-dialog";
  import type { ComponentProps } from "svelte";
  type PrimitiveTriggerProps = ComponentProps<typeof ShardsP.Trigger>;
  export type AlertDialogTriggerProps<Payload = unknown> = Omit<
    PrimitiveTriggerProps,
    "handle" | "payload"
  > & {
    handle?: ShardsP.Handle<Payload>;
    payload?: Payload;
    children?: PrimitiveTriggerProps["children"];
  };
</script>

<script lang="ts" generics="Payload = unknown">
  import { AlertDialog as P } from "@shardsui/svelte/alert-dialog";
  let { ref = $bindable(null), ...props }: AlertDialogTriggerProps<Payload> = $props();
</script>

<P.Trigger bind:ref data-slot="alert-dialog-trigger" {...props} />
