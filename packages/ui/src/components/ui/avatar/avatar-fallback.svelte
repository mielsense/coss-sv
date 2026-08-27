<script module lang="ts">
import type { Avatar as ShardsAvatar } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type AvatarFallbackProps = ComponentProps<typeof ShardsAvatar.Fallback>;
</script>

<script lang="ts">
import { Avatar as AvatarPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

const baseClass = "flex size-full items-center justify-center rounded-full bg-muted";

let { class: className, ref = $bindable(null), ...props }: AvatarFallbackProps = $props();
const classes = $derived(cn(baseClass, className));
</script>

<AvatarPrimitive.Fallback bind:ref data-slot="avatar-fallback" class={classes} {...props} />
