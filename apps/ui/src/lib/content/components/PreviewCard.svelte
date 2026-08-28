<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import type {
  PreviewTheme,
  PreviewWidth,
} from "../../../routes/preview/[name]/preview-contract.js";
import type { HighlightedSource } from "../../code/highlight.js";
import CodeSource from "./CodeSource.svelte";
import PreviewPresentation, { type PreviewAlignment } from "./PreviewPresentation.svelte";

type Props = HTMLAttributes<HTMLElement> & {
  align?: PreviewAlignment;
  hideCode?: boolean;
  iframeHeight?: number;
  name: string;
  source: HighlightedSource;
  theme?: PreviewTheme;
  title?: string;
  width?: PreviewWidth;
};

let {
  align = "center",
  class: className,
  hideCode = false,
  iframeHeight = 450,
  name,
  source,
  theme,
  title = name,
  width = "desktop",
  ...rest
}: Props = $props();
let tab = $state<"preview" | "source">("preview");
const instanceId = $props.id();
const panelId = `${instanceId}-panel`;
const previewTabId = `${instanceId}-preview-tab`;
const sourceTabId = `${instanceId}-source-tab`;

function selectTab(next: "preview" | "source", focus = false): void {
  tab = next;
  if (focus) document.getElementById(next === "preview" ? previewTabId : sourceTabId)?.focus();
}

function navigateTabs(event: KeyboardEvent): void {
  if (hideCode || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
  event.preventDefault();
  selectTab(tab === "preview" ? "source" : "preview", true);
}
</script>

{#snippet panelContent()}
  <PreviewPresentation
    {align}
    {iframeHeight}
    {name}
    {theme}
    {title}
    {width}
    data-preview-panel="true"
    hidden={tab !== "preview"}
  />
  <div class="absolute inset-0 overflow-hidden" data-source-panel="true" hidden={tab !== "source"}>
    <CodeSource embedded height={iframeHeight} {source} />
  </div>
{/snippet}

<section
  class={`group relative my-4 mb-12 flex flex-col gap-2 ${className ?? ""}`}
  data-particle={name}
  {...rest}
>
  {#if !hideCode}
    <div class="flex items-center gap-1" role="tablist" aria-label={`${title} example`}>
      <button
        type="button"
        id={previewTabId}
        role="tab"
        aria-controls={panelId}
        aria-selected={tab === "preview"}
        tabindex={tab === "preview" ? 0 : -1}
        class="rounded-lg px-3 py-2 text-sm font-medium aria-selected:bg-accent"
        onclick={() => selectTab("preview")}
        onkeydown={navigateTabs}
      >
        Preview
      </button>
      <button
        type="button"
        id={sourceTabId}
        role="tab"
        aria-controls={panelId}
        aria-selected={tab === "source"}
        tabindex={tab === "source" ? 0 : -1}
        class="rounded-lg px-3 py-2 text-sm font-medium aria-selected:bg-accent"
        onclick={() => selectTab("source")}
        onkeydown={navigateTabs}
      >
        Code
      </button>
    </div>
  {/if}
  {#if hideCode}
    <div
      id={panelId}
      class="relative overflow-hidden rounded-xl border not-dark:bg-card"
      data-tab={tab}
      style:height={`calc(${iframeHeight}px + 2px)`}
    >
      {@render panelContent()}
    </div>
  {:else}
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tab === "preview" ? previewTabId : sourceTabId}
      class="relative overflow-hidden rounded-xl border not-dark:bg-card"
      data-tab={tab}
      style:height={`calc(${iframeHeight}px + 2px)`}
    >
      {@render panelContent()}
    </div>
  {/if}
</section>
