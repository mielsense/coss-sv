<script lang="ts">
  import * as Tabs from "@coss-sv/ui/components/ui/tabs";
  import { nearViewport } from "@/particles/near-viewport.js";
  import { validateParticleMeta } from "@/registry/particle-metadata.js";
  import type { ParticleModuleLoader, ParticlePreviewEntry } from "@/registry/particle-previews.js";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Component } from "svelte";
  import type { PreviewAlignment, PreviewTheme, PreviewWidth } from "@/preview/contract.js";
  import type { HighlightedSource } from "../../code/highlight.js";
  import CodeSource from "./CodeSource.svelte";

  type Props = HTMLAttributes<HTMLElement> & {
    align?: PreviewAlignment;
    component?: Component;
    containerClass?: string | undefined;
    hideCode?: boolean;
    iframeHeight?: number;
    loader?: ParticleModuleLoader;
    name: string;
    source: HighlightedSource;
    theme?: PreviewTheme;
    title?: string;
    width?: PreviewWidth;
  };

  let {
    align = "center",
    component: Preview,
    class: className,
    containerClass,
    hideCode = false,
    iframeHeight,
    loader,
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
  let previewEntry = $state.raw<ParticlePreviewEntry>();
  let previewRequest = $state.raw<Promise<ParticlePreviewEntry | undefined>>();
  let requestedPreviewName: string | undefined;
  let requestedPreviewLoader: ParticleModuleLoader | undefined;
  const resolvedContainerClass = $derived([previewEntry?.meta.containerClass, containerClass]);
  const resolvedHeight = $derived(iframeHeight ?? 450);

  function requestPreview(): void {
    if (
      Preview ||
      (previewRequest && requestedPreviewName === name && requestedPreviewLoader === loader)
    )
      return;
    const requestedName = name;
    const requestedLoader = loader;
    requestedPreviewName = requestedName;
    requestedPreviewLoader = requestedLoader;
    previewRequest = loadPreview(requestedName, requestedLoader).then((entry) => {
      if (
        requestedPreviewName === requestedName &&
        requestedPreviewLoader === requestedLoader &&
        name === requestedName &&
        loader === requestedLoader
      )
        previewEntry = entry;
      return entry;
    });
  }

  async function loadPreview(
    particleName: string,
    particleLoader: ParticleModuleLoader | undefined,
  ): Promise<ParticlePreviewEntry | undefined> {
    if (!particleLoader) {
      const { getParticlePreview } = await import("@/registry/particle-previews.js");
      return getParticlePreview(particleName);
    }

    const module = await particleLoader();
    const meta = validateParticleMeta(module.meta);
    if (meta.id !== particleName) {
      throw new Error(`Particle metadata id ${meta.id} does not match module ${particleName}`);
    }
    return Object.freeze({
      component: module.default,
      meta,
      modulePath: `$particles/${particleName}.svelte`,
    });
  }

  const loadWhenVisible = nearViewport(requestPreview);
</script>

{#snippet panelContent()}
  {#if tab === "preview"}
    <div
      class={[
        "absolute inset-0 h-[var(--preview-height)] min-w-0 overflow-auto bg-background hidden:hidden",
        ...resolvedContainerClass,
        theme === "dark" && "dark",
      ]}
      data-preview-panel="true"
      data-preview-width={width}
      style:--preview-height={`${resolvedHeight}px`}
      style:--preview-width={width === "mobile" ? "390px" : width === "tablet" ? "768px" : "100%"}
    >
      <div
        class={[
          "mx-auto flex min-h-[var(--preview-height)] w-[min(100%,var(--preview-width))] justify-center py-10",
          width === "mobile" ? "px-6" : "px-10",
          align === "center" ? "items-center" : align === "start" ? "items-start" : "items-end",
        ]}
        data-align={align}
        data-preview-inner
      >
        <div class="flex w-full justify-center">
          <div data-slot="preview">
            {#if Preview}
              <Preview />
            {:else}
              {#if previewRequest}
                {#await previewRequest}
                  <span class="sr-only" data-preview-loading="true">Loading {title} preview…</span>
                {:then entry}
                  {#if entry}
                    {const LoadedPreview = entry.component}
                    <LoadedPreview />
                  {:else}
                    <p class="text-muted-foreground text-sm">Preview unavailable.</p>
                  {/if}
                {:catch error}
                  <p class="text-destructive text-sm" data-preview-load-error="true">
                    {error instanceof Error ? error.message : "Preview unavailable."}
                  </p>
                {/await}
              {:else}
                <span class="sr-only" data-preview-loading="true">Loading {title} preview…</span>
              {/if}
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
  {#if tab === "code"}
    <div class="absolute inset-0 overflow-hidden" data-source-panel="true">
      <CodeSource embedded height={resolvedHeight} {source} />
    </div>
  {/if}
{/snippet}

<section
  class={`group relative my-8 flex flex-col gap-2 ${className ?? ""}`}
  data-particle={name}
  data-preview-requested={previewRequest ? "true" : undefined}
  {...rest}
  {@attach loadWhenVisible}
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
      style:height={`calc(${resolvedHeight}px + 2px)`}
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
      style:height={`calc(${resolvedHeight}px + 2px)`}
    >
      {@render panelContent()}
    </div>
  {/if}
</section>
