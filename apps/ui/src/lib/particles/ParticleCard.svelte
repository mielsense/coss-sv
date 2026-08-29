<script lang="ts">
  import {
    CheckmarkCircle02Icon,
    Copy01Icon,
    InformationCircleIcon,
  } from "@hugeicons/core-free-icons";
  import {
    buttonVariants,
    Card,
    CardFrame,
    CardFrameFooter,
    CardPanel,
    Drawer,
    HugeiconsIcon,
  } from "@coss-sv/ui";
  import type { Component } from "svelte";
  import type { ParticleCatalogEntry } from "./catalog.js";

  type RegistryResponse = {
    files?: Array<{ content?: string; target?: string }>;
  };

  let {
    component: Preview,
    particle,
  }: {
    component: Component;
    particle: ParticleCatalogEntry;
  } = $props();

  const registryHref = $derived(`/r/${particle.name}.json`);
  const installCommand = $derived(
    `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app${registryHref}`,
  );
  let copied = $state(false);
  let source = $state("");
  let sourceError = $state("");

  async function copyRegistryUrl() {
    await navigator.clipboard.writeText(new URL(registryHref, window.location.origin).href);
    copied = true;
    window.setTimeout(() => (copied = false), 1_500);
  }

  async function loadSource() {
    if (source || sourceError) return;
    try {
      const response = await fetch(registryHref);
      if (!response.ok) throw new Error(`Registry request returned ${response.status}`);
      const registry = (await response.json()) as RegistryResponse;
      source =
        registry.files?.find(({ target }) => target?.endsWith(`${particle.name}.svelte`))
          ?.content ?? "";
      if (!source) sourceError = "Source is unavailable for this particle.";
    } catch {
      sourceError = "Source is unavailable for this particle.";
    }
  }
</script>

<div
  class={[
    "relative flex min-w-0",
    particle.meta?.colSpan === 2 && "lg:col-span-2",
    particle.meta?.className,
  ]}
  data-particle-card={particle.name}
>
  <CardFrame
    class="w-full after:pointer-events-none after:absolute after:-inset-[5px] after:-z-1 after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/64 dark:bg-background"
  >
    <Card class="min-h-50 flex-1 flex-col flex-wrap overflow-x-auto dark:bg-background">
      <CardPanel class="flex flex-1 items-center justify-center lg:px-8 lg:py-12">
        <div data-particle data-slot="preview">
          <Preview />
        </div>
      </CardPanel>
    </Card>
    <CardFrameFooter class="flex items-center gap-3 p-2">
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
        <button
          class={buttonVariants({ size: "icon-sm", variant: "outline" })}
          type="button"
          onclick={copyRegistryUrl}
          title="Copy registry URL"
        >
          <span class="sr-only">{copied ? "Copied" : "Copy registry URL"}</span>
          <HugeiconsIcon
            aria-hidden="true"
            icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
            strokeWidth={2}
          />
        </button>
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
                <pre class="overflow-x-auto rounded-xl border bg-muted/40 p-4 text-sm"><code
                    >{installCommand}</code
                  ></pre>
              </div>
              <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
                <h2 class="mt-6 mb-4 font-heading font-semibold text-xl">Code</h2>
                {#if sourceError}
                  <p class="text-muted-foreground text-sm">{sourceError}</p>
                {:else if source}
                  <pre
                    class="min-h-0 flex-1 overflow-auto rounded-xl border bg-muted/40 p-4 text-sm"><code
                      >{source}</code
                    ></pre>
                {:else}
                  <p class="text-muted-foreground text-sm">Loading source…</p>
                {/if}
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Root>
      </div>
    </CardFrameFooter>
  </CardFrame>
</div>
