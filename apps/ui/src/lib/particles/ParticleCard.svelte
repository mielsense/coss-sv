<script lang="ts">
  import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
  import * as Card from "@coss-sv/ui/components/ui/card";
  import { buttonVariants, Drawer, HugeiconsIcon, Skeleton } from "@coss-sv/ui";
  import type { Component } from "svelte";
  import CodeSource from "@/content/components/CodeSource.svelte";
  import CopyButton from "@/content/components/CopyButton.svelte";
  import type { HighlightedSource } from "@/code/highlight.js";
  import type { ParticleCatalogEntry } from "./catalog.js";
  import { nearViewport } from "./near-viewport.js";
  import ParticleInstallCommand from "./ParticleInstallCommand.svelte";

  let {
    loadComponent,
    loadSource,
    particle,
  }: {
    loadComponent: () => Promise<Component>;
    loadSource: () => Promise<HighlightedSource>;
    particle: ParticleCatalogEntry;
  } = $props();

  const registryHref = $derived(`/r/${particle.name}.json`);
  const registryUrl = $derived(`https://coss-sv.vercel.app${registryHref}`);
  const openInV0Url = $derived(
    `https://v0.dev/chat/api/open?url=${encodeURIComponent(registryUrl)}`,
  );
  let drawerOpen = $state(false);
  let previewComponent = $state.raw<Promise<Component>>();
  let source = $state.raw<HighlightedSource>();
  let sourceError = $state("");
  let sourceRequest = $state.raw<Promise<void>>();

  function requestPreview(): void {
    previewComponent ??= loadComponent();
  }

  const loadWhenVisible = nearViewport(requestPreview);

  function requestSource(): void {
    if (source || sourceError || sourceRequest) return;
    sourceRequest = loadSource()
      .then((loadedSource) => {
        source = loadedSource;
      })
      .catch((error: unknown) => {
        sourceError = error instanceof Error ? error.message : "Source is unavailable.";
      });
  }

  async function openDrawer(): Promise<void> {
    requestSource();
    await sourceRequest;
    drawerOpen = true;
  }
</script>

<div
  class={[
    "relative flex min-w-0",
    particle.meta?.colSpan === 2 && "lg:col-span-2",
    particle.meta?.className,
  ]}
  data-particle-card={particle.name}
  data-preview-requested={previewComponent ? "true" : undefined}
  {@attach loadWhenVisible}
>
  <Card.Frame
    class="w-full after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/64 dark:bg-background"
  >
    <Card.Root class="min-h-50 flex-1 flex-col flex-wrap overflow-x-auto dark:bg-background">
      <Card.Panel class="flex flex-1 items-center justify-center lg:px-8 lg:py-12">
        <div data-particle data-slot="preview">
          {#if previewComponent}
            {#await previewComponent}
              <Skeleton class="h-7 w-64" data-particle-loading />
            {:then Preview}
              <Preview />
            {:catch}
              <p class="text-muted-foreground text-sm">Preview unavailable.</p>
            {/await}
          {:else}
            <Skeleton class="h-7 w-64" data-particle-loading />
          {/if}
        </div>
      </Card.Panel>
    </Card.Root>
    <Card.FrameFooter class="flex items-center gap-3 p-2">
      <p class="flex flex-1 gap-1 truncate text-muted-foreground text-xs">
        <HugeiconsIcon
          aria-hidden="true"
          class="size-3 h-lh shrink-0"
          icon={InformationCircleIcon}
          strokeWidth={2}
        />
        <span class="truncate">{particle.description}</span>
      </p>
      <div class="flex items-center gap-1.5">
        <CopyButton
          aria-label="Copy registry URL"
          class={buttonVariants({ size: "icon-sm", variant: "outline" })}
          title="Copy registry URL"
          value={registryUrl}
        />
        <Drawer.Root
          onOpenChange={(open) => (drawerOpen = open)}
          open={drawerOpen}
          position="right"
        >
          <button
            aria-expanded={drawerOpen}
            aria-haspopup="dialog"
            class={buttonVariants({ class: "text-sm", size: "sm", variant: "outline" })}
            data-slot="drawer-trigger"
            onfocus={requestSource}
            onclick={() => void openDrawer()}
            onpointerenter={requestSource}
            ontouchstart={requestSource}
            type="button"
          >
            View code
          </button>
          <Drawer.Popup class="max-w-4xl" showBar showCloseButton={false} variant="straight">
            <Drawer.Content class="flex flex-1 flex-col overflow-hidden p-6">
              <div>
                <Drawer.Title class="mb-4 font-heading font-semibold text-xl">
                  Installation
                </Drawer.Title>
                <Drawer.Description class="sr-only">
                  Install and inspect {particle.name}.
                </Drawer.Description>
                <ParticleInstallCommand {registryUrl} />
              </div>
              <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div class="flex items-center justify-between gap-2">
                  <h2 class="mt-6 mb-4 font-heading font-semibold text-xl">Code</h2>
                  <a
                    class={buttonVariants({ variant: "outline" })}
                    href={openInV0Url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Open in <span class="sr-only">v0</span><span
                      aria-hidden="true"
                      class="font-semibold tracking-tight">v0</span
                    >
                  </a>
                </div>
                {#if sourceError}
                  <p class="text-muted-foreground text-sm">{sourceError}</p>
                {:else if source}
                  <div class="relative min-h-0 flex-1 overflow-hidden rounded-xl border bg-code">
                    <CodeSource embedded fill {source} />
                  </div>
                {/if}
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Root>
      </div>
    </Card.FrameFooter>
  </Card.Frame>
</div>
