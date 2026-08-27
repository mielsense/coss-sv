<script lang="ts">
import type { Snippet } from "svelte";

type Props = {
  children: Snippet;
  title?: string;
  variant?: "info" | "warning";
};

let { children, title, variant = "info" }: Props = $props();
</script>

<aside
  class="my-6 rounded-xl border px-4 py-3 text-sm text-muted-foreground"
  data-variant={variant}
>
  {#if title}
    <p class="mb-1 font-medium text-foreground">{title}</p>
  {/if}
  {@render children()}
</aside>
