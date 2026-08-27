<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import type { HighlightedSource } from "../../code/highlight.js";
import CodeSource from "./CodeSource.svelte";

type Props = HTMLAttributes<HTMLElement> & {
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  iframeHeight?: number;
  name: string;
  source: HighlightedSource;
  title?: string;
};

let {
  align = "center",
  class: className,
  hideCode = false,
  iframeHeight = 450,
  name,
  source,
  title = name,
  ...rest
}: Props = $props();
let tab = $state<"preview" | "source">("preview");
const instanceId = $props.id();
const panelId = `${instanceId}-panel`;
const previewTabId = `${instanceId}-preview-tab`;
const sourceTabId = `${instanceId}-source-tab`;
const previewUrl = $derived(`/preview/${encodeURIComponent(name)}?theme=light&width=desktop`);

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

<section
  class={`group relative my-4 mb-12 flex flex-col gap-2 ${className ?? ""}`}
  data-particle={name}
  {...rest}
>
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
    {#if !hideCode}
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
    {/if}
  </div>
  <div
    id={panelId}
    role="tabpanel"
    aria-labelledby={tab === "preview" ? previewTabId : sourceTabId}
    class="relative overflow-hidden rounded-xl border not-dark:bg-card"
    style:min-height={`${iframeHeight}px`}
  >
    <div data-align={align} data-preview-panel="true" hidden={tab !== "preview"}>
      <iframe
        class="block w-full border-0"
        style:height={`${iframeHeight}px`}
        src={previewUrl}
        title={`${title} preview`}
      ></iframe>
    </div>
    <div data-source-panel="true" hidden={tab !== "source"}>
      <CodeSource {source} />
    </div>
  </div>
</section>
