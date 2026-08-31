<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    id: string;
    level?: 2 | 3 | 4 | "2" | "3" | "4";
  };

  let { children, id, level = 2 }: Props = $props();
</script>

{#if level === 2 || level === "2"}
  <h2 {id} class="mt-12 scroll-m-20 font-heading text-2xl font-semibold first:mt-0 lg:mt-16">
    <a href={`#${id}`} class="no-underline underline-offset-4 hover:underline"
      >{@render children()}</a
    >
  </h2>
{:else if level === 3 || level === "3"}
  <h3 {id} class="mt-8 scroll-m-20 text-lg font-semibold">
    <a href={`#${id}`} class="no-underline underline-offset-4 hover:underline"
      >{@render children()}</a
    >
  </h3>
{:else}
  <h4 {id} class="mt-8 scroll-m-20 font-medium tracking-tight">
    <a href={`#${id}`} class="no-underline underline-offset-4 hover:underline"
      >{@render children()}</a
    >
  </h4>
{/if}
