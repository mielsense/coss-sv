<script module lang="ts">
  import type { Dialog as ShardsP } from "@shardsui/svelte/dialog";
  import type { ComponentProps } from "svelte";
  type PrimitiveTriggerProps = ComponentProps<typeof ShardsP.Trigger>;
  export type DrawerTriggerProps<Payload = unknown> = Omit<
    PrimitiveTriggerProps,
    "handle" | "payload"
  > & {
    handle?: ShardsP.Handle<Payload>;
    payload?: Payload;
    children?: PrimitiveTriggerProps["children"];
  };
</script>

<script lang="ts" generics="Payload = unknown">
  import { Dialog as P } from "@shardsui/svelte/dialog";
  let { ref = $bindable(null), ...props }: DrawerTriggerProps<Payload> = $props();
</script>

<P.Trigger bind:ref data-slot="drawer-trigger" {...props} />
