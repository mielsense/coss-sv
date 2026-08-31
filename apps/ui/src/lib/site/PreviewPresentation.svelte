<script lang="ts">
  import ComputerIcon from "@hugeicons/core-free-icons/ComputerIcon";
  import FullScreenIcon from "@hugeicons/core-free-icons/FullScreenIcon";
  import MinimizeScreenIcon from "@hugeicons/core-free-icons/MinimizeScreenIcon";
  import SmartPhone01Icon from "@hugeicons/core-free-icons/SmartPhone01Icon";
  import Tablet01Icon from "@hugeicons/core-free-icons/Tablet01Icon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import type { HTMLAttributes } from "svelte/elements";
  import {
    type PreviewReducedMotion,
    type PreviewTheme,
    type PreviewWidth,
    previewWidths,
  } from "@/preview/contract.js";

  type Props = HTMLAttributes<HTMLElement> & {
    iframeHeight?: number;
    name: string;
    reducedMotion?: PreviewReducedMotion;
    theme?: PreviewTheme;
    title?: string;
  };

  let {
    class: className,
    iframeHeight = 450,
    name,
    reducedMotion = "no-preference",
    theme,
    title = name,
    ...rest
  }: Props = $props();
  let width = $state<PreviewWidth>("desktop");
  let fullscreen = $state(false);
  let siteTheme = $state<PreviewTheme>("light");
  let presentation: HTMLElement;
  const controlClass =
    "inline-flex size-7 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-site-muted hover:bg-site-accent hover:text-site-foreground focus-visible:outline-2 focus-visible:outline-site-primary focus-visible:outline-offset-2 aria-pressed:bg-site-accent aria-pressed:text-site-foreground";

  const resolvedTheme = $derived(theme ?? siteTheme);
  const previewUrl = $derived.by(() => {
    const parameters = new URLSearchParams({
      theme: resolvedTheme,
      width,
      reducedMotion,
      timers: "real",
    });
    return `/preview/${encodeURIComponent(name)}?${parameters.toString()}`;
  });

  function trackPresentation(node: HTMLElement) {
    const ownerDocument = node.ownerDocument;
    const updateFullscreen = () => {
      fullscreen = ownerDocument.fullscreenElement === node;
    };
    const updateTheme = () => {
      siteTheme = ownerDocument.documentElement.classList.contains("dark") ? "dark" : "light";
    };

    ownerDocument.addEventListener("fullscreenchange", updateFullscreen);
    ownerDocument.addEventListener("coss-sv:themechange", updateTheme);
    updateFullscreen();
    updateTheme();

    return () => {
      ownerDocument.removeEventListener("fullscreenchange", updateFullscreen);
      ownerDocument.removeEventListener("coss-sv:themechange", updateTheme);
    };
  }

  async function toggleFullscreen(): Promise<void> {
    if (presentation.ownerDocument.fullscreenElement === presentation) {
      await presentation.ownerDocument.exitFullscreen();
      return;
    }
    await presentation.requestFullscreen();
  }
</script>

<section
  bind:this={presentation}
  class={[
    "group relative flex min-w-0 flex-col gap-2 fullscreen:h-full fullscreen:w-full fullscreen:bg-site-background fullscreen:p-2",
    className,
  ]}
  data-preview-presentation
  data-preview-theme={resolvedTheme}
  style:--preview-height={`${iframeHeight}px`}
  {...rest}
  {@attach trackPresentation}
>
  <div class="flex min-h-8 items-center justify-end gap-2">
    <fieldset
      class="flex items-center rounded-[0.625rem] border border-site-border bg-site-panel p-0.5"
    >
      <legend class="sr-only">Preview viewport</legend>
      {#each ["mobile", "tablet", "desktop"] as preset (preset)}
        <button
          class={controlClass}
          type="button"
          aria-label={`${preset[0]?.toUpperCase()}${preset.slice(1)} preview`}
          aria-pressed={width === preset}
          title={`${preset[0]?.toUpperCase()}${preset.slice(1)}`}
          onclick={() => (width = preset as PreviewWidth)}
        >
          {#if preset === "mobile"}
            <HugeiconsIcon
              aria-hidden="true"
              icon={SmartPhone01Icon}
              size={16}
              strokeWidth={1.75}
            />
          {:else if preset === "tablet"}
            <HugeiconsIcon aria-hidden="true" icon={Tablet01Icon} size={16} strokeWidth={1.75} />
          {:else}
            <HugeiconsIcon aria-hidden="true" icon={ComputerIcon} size={16} strokeWidth={1.75} />
          {/if}
        </button>
      {/each}
    </fieldset>
    <button
      type="button"
      class={[controlClass, "border border-site-border bg-site-panel"]}
      aria-label={fullscreen ? "Exit fullscreen" : "View fullscreen"}
      aria-pressed={fullscreen}
      title={fullscreen ? "Exit fullscreen" : "View fullscreen"}
      onclick={toggleFullscreen}
    >
      {#if fullscreen}
        <HugeiconsIcon aria-hidden="true" icon={MinimizeScreenIcon} size={16} strokeWidth={1.75} />
      {:else}
        <HugeiconsIcon aria-hidden="true" icon={FullScreenIcon} size={16} strokeWidth={1.75} />
      {/if}
    </button>
  </div>
  <div
    class="relative flex h-[var(--preview-height)] min-w-0 w-full justify-center overflow-hidden rounded-xl border border-site-border bg-site-panel group-fullscreen:h-auto group-fullscreen:flex-1"
  >
    <iframe
      class="block h-[var(--preview-height)] max-w-full flex-none border-0 bg-site-background group-fullscreen:h-full"
      src={previewUrl}
      title={`${title} preview`}
      data-preview-width={width}
      style:width={`${previewWidths[width]}px`}
    ></iframe>
  </div>
</section>
