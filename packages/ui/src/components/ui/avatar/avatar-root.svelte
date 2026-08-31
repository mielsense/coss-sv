<script module lang="ts">
  import type { Avatar as ShardsAvatar } from "@shardsui/svelte/avatar";
  import type { ComponentProps } from "svelte";

  export type AvatarRootProps = ComponentProps<typeof ShardsAvatar.Root>;
</script>

<script lang="ts">
  import { Avatar as AvatarPrimitive } from "@shardsui/svelte/avatar";
  import { cn } from "@/utils.js";

  const baseClass =
    "inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-background align-middle font-medium text-xs";

  let { class: className, ref = $bindable(null), ...props }: AvatarRootProps = $props();
  const classes = $derived(cn(baseClass, className));
</script>

<AvatarPrimitive.Root bind:ref data-slot="avatar" class={classes} {...props} />
