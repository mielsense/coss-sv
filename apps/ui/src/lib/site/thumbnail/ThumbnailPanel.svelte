<script lang="ts">
import { cn } from "@coss-sv/ui";
import type { HTMLAttributes } from "svelte/elements";

let { children, class: className = "", ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn("flex-1 p-6", className)} {...rest}>{@render children?.()}</div>
