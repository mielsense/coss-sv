<script lang="ts">
  import InformationCircleIcon from "@hugeicons/core-free-icons/InformationCircleIcon";
  import * as Card from "@coss-sv/ui/components/ui/card";
  import { buttonVariants, Drawer, HugeiconsIcon, Skeleton } from "@coss-sv/ui";
  import { onDestroy, type Component } from "svelte";
  import CopyButton from "@/content/components/CopyButton.svelte";
  import type { ParticleCatalogEntry } from "./catalog.js";
  import { nearViewport } from "./near-viewport.js";

  type RegistryResponse = {
    files?: Array<{ content?: string; target?: string }>;
  };

  let {
    loadComponent,
    particle,
  }: {
    loadComponent: () => Promise<Component>;
    particle: ParticleCatalogEntry;
  } = $props();

  const registryHref = $derived(`/r/${particle.name}.json`);
  const registryUrl = $derived(`https://coss-sv.vercel.app${registryHref}`);
  const installCommand = $derived(`pnpm dlx shadcn-svelte@latest add ${registryUrl}`);
  let previewComponent = $state.raw<Promise<Component>>();
  let source = $state("");
  let sourceError = $state("");
  let sourceController: AbortController | undefined;
  let sourceRequest: Promise<void> | undefined;

  function requestPreview(): void {
    previewComponent ??= loadComponent();
  }

  const loadWhenVisible = nearViewport(requestPreview);

  function loadSource(): void {
    if (source || sourceError || sourceRequest) return;
    const controller = new AbortController();
    sourceController = controller;
    sourceRequest = (async () => {
      try {
        const response = await fetch(registryHref, { signal: controller.signal });
        if (!response.ok) throw new Error(`Registry request returned ${response.status}`);
        const registry = (await response.json()) as RegistryResponse;
        if (controller.signal.aborted) return;
        source =
          registry.files?.find(({ target }) => target?.endsWith(`${particle.name}.svelte`))
            ?.content ?? "";
        if (!source) sourceError = "Source is unavailable for this particle.";
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          sourceError = "Source is unavailable for this particle.";
        }
      } finally {
        if (sourceController === controller) sourceController = undefined;
        sourceRequest = undefined;
      }
    })();
  }

  onDestroy(() => sourceController?.abort());
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
        <Drawer.Root position="right">
          <Drawer.Trigger
            class={buttonVariants({ class: "text-sm", size: "sm", variant: "outline" })}
            onclick={loadSource}
          >
            View code
          </Drawer.Trigger>
          <Drawer.Popup class="max-w-4xl" showBar showCloseButton={false} variant="straight">
            <Drawer.Content class="flex flex-1 flex-col overflow-hidden p-6">
              <div>
                <Drawer.Title class="mb-4 font-heading font-semibold text-xl">
                  Installation
                </Drawer.Title>
                <Drawer.Description class="sr-only">
                  Install and inspect {particle.name}.
                </Drawer.Description>
                <div class="relative overflow-hidden rounded-xl border bg-muted/40">
                  <CopyButton class="absolute top-1.5 right-1.5 z-1" value={installCommand} />
                  <pre class="overflow-x-auto p-4 pe-12 text-sm"><code>{installCommand}</code></pre>
                </div>
              </div>
              <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
                <h2 class="mt-6 mb-4 font-heading font-semibold text-xl">Code</h2>
                {#if sourceError}
                  <p class="text-muted-foreground text-sm">{sourceError}</p>
                {:else if source}
                  <div
                    class="relative min-h-0 flex-1 overflow-hidden rounded-xl border bg-muted/40"
                  >
                    <CopyButton class="absolute top-1.5 right-1.5 z-1" value={source} />
                    <pre class="h-full overflow-auto p-4 pe-12 text-sm"><code>{source}</code></pre>
                  </div>
                {:else}
                  <p class="text-muted-foreground text-sm">Loading source…</p>
                {/if}
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Root>
      </div>
    </Card.FrameFooter>
  </Card.Frame>
</div>
