<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";

let { children, class: className = "", ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={`flex-1 p-6 ${className}`} {...rest}>{@render children?.()}</div>
