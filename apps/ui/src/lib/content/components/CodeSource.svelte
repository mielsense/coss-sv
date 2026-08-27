<script lang="ts">
import type { HighlightedSource } from "../../code/highlight.js";
import CopyButton from "./CopyButton.svelte";

type Props = {
  source: HighlightedSource;
  title?: string;
};

let { source, title }: Props = $props();
</script>

<figure class="relative my-6 overflow-hidden rounded-xl border bg-code text-code-foreground">
  {#if title}
    <figcaption class="flex min-h-10 items-center border-b px-4 font-mono text-xs opacity-80">
      {title}
    </figcaption>
  {/if}
  <div class="absolute right-1.5 top-1.5 z-10">
    <CopyButton value={source.raw} />
  </div>
  <pre
    class="shiki max-w-full overflow-x-auto px-4 py-3.5 text-xs"
    data-language={source.language}
  ><code>{#each source.lines as line, lineIndex (lineIndex)}{#each line as token, tokenIndex (`${lineIndex}-${tokenIndex}`)}<span
            style:--shiki-light={token.light.color}
            style:--shiki-light-font-style={token.light.fontStyle}
            style:--shiki-light-font-weight={token.light.fontWeight}
            style:--shiki-light-text-decoration={token.light.textDecoration}
            style:--shiki-dark={token.dark.color}
            style:--shiki-dark-font-style={token.dark.fontStyle}
            style:--shiki-dark-font-weight={token.dark.fontWeight}
            style:--shiki-dark-text-decoration={token.dark.textDecoration}
          >{token.content}</span>{/each}{#if lineIndex < source.lines.length - 1}{"\n"}{/if}{/each}</code></pre>
</figure>
