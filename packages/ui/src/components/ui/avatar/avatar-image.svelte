<script module lang="ts">
import type { Avatar as ShardsAvatar } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";

export type AvatarImageProps = ComponentProps<typeof ShardsAvatar.Image>;
</script>

<script lang="ts">
import { Avatar as AvatarPrimitive } from "@shardsui/svelte";
import { cn } from "$lib/utils.js";

let { class: className, ref = $bindable(null), ...props }: AvatarImageProps = $props();
const classes = $derived(cn("size-full object-cover", className));
</script>

<AvatarPrimitive.Image bind:ref data-slot="avatar-image" class={classes} {...props} />
