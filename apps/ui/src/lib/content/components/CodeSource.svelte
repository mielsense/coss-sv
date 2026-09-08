<script lang="ts">
  import { Button, Separator } from "@coss-sv/ui";
  import * as Collapsible from "@coss-sv/ui/components/ui/collapsible";
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
    collapsible?: boolean;
    embedded?: boolean;
    fill?: boolean;
    height?: number;
    source: HighlightedSource;
    title?: string;
  };

  let {
    collapsible = true,
    embedded = false,
    fill = false,
    height = 450,
    source,
    title,
  }: Props = $props();
  let open = $state(false);
  const canCollapse = $derived(collapsible && !embedded);

  function styleFor(token: HighlightedToken): HighlightedTokenStyle {
    return source.palette[token[1]] ?? fallbackStyle;
  }
</script>

{#snippet sourceFigure()}
  <figure
    class={[
      "relative min-w-0 max-w-full overflow-hidden bg-code text-code-foreground",
      embedded
        ? ["m-0 rounded-none border-0", fill ? "h-full" : "h-[var(--source-height)]"]
        : ["rounded-xl border", canCollapse ? "m-0" : "my-6"],
    ]}
    data-preview-source={embedded ? "embedded" : undefined}
    style:--source-height={fill ? undefined : `${height}px`}
  >
    {#if title}
      <figcaption
        class="flex min-h-10 items-center border-b px-4 pe-36 font-mono text-xs opacity-80"
      >
        <span class="truncate" {title}>{title}</span>
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
{/snippet}

{#if canCollapse}
  <Collapsible.Root class="group/collapsible relative min-w-0 md:-mx-1" bind:open>
    <div class="absolute top-1.5 right-10 z-10 flex items-center">
      <Collapsible.Trigger>
        {#snippet children()}{open ? "Collapse" : "Expand"}{/snippet}
        {#snippet delegate({ props, ref })}
          <Button {...props} bind:ref={ref.current} class="text-muted-foreground" variant="ghost" />
        {/snippet}
      </Collapsible.Trigger>
      <Separator class="mx-1.5 h-5" orientation="vertical" />
    </div>
    <Collapsible.Panel
      class="relative mt-6 h-auto! overflow-hidden transition-none data-closed:max-h-64"
      data-source-collapse-panel
      hidden={false}
      keepMounted
    >
      {@render sourceFigure()}
    </Collapsible.Panel>
    {#if !open}
      <Collapsible.Trigger
        class="absolute inset-x-0 -bottom-2 flex h-20 cursor-pointer items-center justify-center rounded-b-lg bg-linear-to-b from-transparent via-50% via-background to-background font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        Expand
      </Collapsible.Trigger>
    {/if}
  </Collapsible.Root>
{:else}
  {@render sourceFigure()}
{/if}

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
