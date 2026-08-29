<script lang="ts">
  import type { FileTreeNode } from "./types.js";

  type Props = {
    nodes: readonly FileTreeNode[];
    depth?: number;
  };

  let { nodes, depth = 0 }: Props = $props();
</script>

{#snippet renderNodes(entries: readonly FileTreeNode[], currentDepth: number)}
  <ul class="font-mono text-xs" data-depth={currentDepth}>
    {#each entries as node (node.name)}
      <li>
        <div
          class="flex min-h-7 items-center gap-2"
          style:padding-left={`${currentDepth * 1.25}rem`}
        >
          <span aria-hidden="true">{node.children ? "▾" : "·"}</span>
          <span>{node.name}</span>
        </div>
        {#if node.children}
          {@render renderNodes(node.children, currentDepth + 1)}
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}

{@render renderNodes(nodes, depth)}
