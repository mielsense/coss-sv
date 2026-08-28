<script lang="ts">
import * as Tabs from "@coss-sv/ui/components/ui/tabs";
import type { HTMLAttributes } from "svelte/elements";
import type {
  PreviewAlignment,
  PreviewTheme,
  PreviewWidth,
} from "../../../routes/preview/[name]/preview-contract.js";
import type { HighlightedSource } from "../../code/highlight.js";
import CodeSource from "./CodeSource.svelte";
import PreviewPresentation from "./PreviewPresentation.svelte";

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
let tab = $state<Tabs.TabsValue>("preview");
const instanceId = $props.id();
const panelId = `${instanceId}-panel`;
const previewTabId = `${instanceId}-preview-tab`;
const sourceTabId = `${instanceId}-source-tab`;
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
  <div class="absolute inset-0 overflow-hidden" data-source-panel="true" hidden={tab !== "code"}>
    <CodeSource embedded height={iframeHeight} {source} />
  </div>
{/snippet}

<section
  class={`group relative my-4 mb-12 flex flex-col gap-2 ${className ?? ""}`}
  data-particle={name}
  {...rest}
>
  <Tabs.Root bind:value={tab}>
    <div class="flex items-center justify-between">
      {#if !hideCode}
        <Tabs.List
          aria-label={`${title} example`}
          class="bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none"
        >
          <Tabs.Tab aria-controls={panelId} class="rounded-lg" id={previewTabId} value="preview">
            Preview
          </Tabs.Tab>
          <Tabs.Tab aria-controls={panelId} class="rounded-lg" id={sourceTabId} value="code">
            Code
          </Tabs.Tab>
        </Tabs.List>
      {/if}
    </div>
  </Tabs.Root>
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
