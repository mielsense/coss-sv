<script lang="ts">
  import type {
    HighlightedSource,
    HighlightedToken,
    HighlightedTokenStyle,
  } from "../../code/highlight.js";
  import CopyButton from "./CopyButton.svelte";

  const fallbackStyle: HighlightedTokenStyle = {
    dark: {
      color: "currentColor",
      fontStyle: "normal",
      fontWeight: "normal",
      textDecoration: "none",
    },
    light: {
      color: "currentColor",
      fontStyle: "normal",
      fontWeight: "normal",
      textDecoration: "none",
    },
  };

  type Props = {
    embedded?: boolean;
    fill?: boolean;
    height?: number;
    source: HighlightedSource;
    title?: string;
  };

  let { embedded = false, fill = false, height = 450, source, title }: Props = $props();

  function styleFor(token: HighlightedToken): HighlightedTokenStyle {
    return source.palette[token[1]] ?? fallbackStyle;
  }
</script>

<figure
  class={[
    "relative overflow-hidden bg-code text-code-foreground",
    embedded
      ? ["m-0 rounded-none border-0", fill ? "h-full" : "h-[var(--source-height)]"]
      : "my-6 rounded-xl border",
  ]}
  data-preview-source={embedded ? "embedded" : undefined}
  style:--source-height={fill ? undefined : `${height}px`}
>
  {#if title}
    <figcaption class="flex min-h-10 items-center border-b px-4 font-mono text-xs opacity-80">
      {title}
    </figcaption>
  {/if}
  <div class="absolute right-1.5 top-1.5 z-10">
    <CopyButton value={source.raw} />
  </div>
  <pre
    class={[
      "shiki max-w-full text-xs",
      embedded
        ? [
            "m-0 box-border overflow-auto rounded-none border-0 [padding:14px_16px_14px_0] text-[0.8125rem] leading-6",
            fill ? "h-full" : "h-[var(--source-height)]",
          ]
        : "overflow-x-auto px-4 py-3.5",
    ]}
    data-language={source.language}><code data-line-numbers={embedded ? "" : undefined}
      >{#each source.lines as line, lineIndex (lineIndex)}<span
          class={["line", embedded && "block w-full min-w-max py-0.5"]}
          data-line={embedded ? "" : undefined}
          >{#each line as token, tokenIndex (`${lineIndex}-${tokenIndex}`)}{const tokenStyle =
              styleFor(token)}<span
              style:--shiki-light={tokenStyle.light.color}
              style:--shiki-light-font-style={tokenStyle.light.fontStyle}
              style:--shiki-light-font-weight={tokenStyle.light.fontWeight}
              style:--shiki-light-text-decoration={tokenStyle.light.textDecoration}
              style:--shiki-dark={tokenStyle.dark.color}
              style:--shiki-dark-font-style={tokenStyle.dark.fontStyle}
              style:--shiki-dark-font-weight={tokenStyle.dark.fontWeight}
              style:--shiki-dark-text-decoration={tokenStyle.dark.textDecoration}>{token[0]}</span
            >{/each}</span
        >{#if !embedded && lineIndex < source.lines.length - 1}{"\n"}{/if}{/each}</code
    ></pre>
</figure>

<style>
  code[data-line-numbers] {
    counter-reset: line;
  }

  [data-line]::before {
    display: inline-block;
    box-sizing: border-box;
    width: 64px;
    padding-right: 24px;
    color: var(--muted-foreground);
    text-align: right;
    content: counter(line);
    counter-increment: line;
  }
</style>
