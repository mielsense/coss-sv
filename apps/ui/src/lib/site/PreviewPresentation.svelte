<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import {
    type PreviewReducedMotion,
    type PreviewTheme,
    type PreviewWidth,
    previewWidths,
  } from "../../routes/preview/[name]/preview-contract.js";

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
  class={["preview-presentation", className]}
  data-preview-presentation
  data-preview-theme={resolvedTheme}
  style:--preview-height={`${iframeHeight}px`}
  {...rest}
  {@attach trackPresentation}
>
  <div class="preview-presentation-toolbar">
    <fieldset class="preview-size-controls">
      <legend>Preview viewport</legend>
      {#each ["mobile", "tablet", "desktop"] as preset (preset)}
        <button
          type="button"
          aria-label={`${preset[0]?.toUpperCase()}${preset.slice(1)} preview`}
          aria-pressed={width === preset}
          title={`${preset[0]?.toUpperCase()}${preset.slice(1)}`}
          onclick={() => (width = preset as PreviewWidth)}
        >
          {#if preset === "mobile"}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="7" y="2" width="10" height="20" rx="2"></rect>
              <path d="M11 18h2"></path>
            </svg>
          {:else if preset === "tablet"}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="2" width="16" height="20" rx="2"></rect>
              <path d="M11 18h2"></path>
            </svg>
          {:else}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2"></rect>
              <path d="M8 21h8M12 17v4"></path>
            </svg>
          {/if}
        </button>
      {/each}
    </fieldset>
    <button
      type="button"
      class="preview-fullscreen-control"
      aria-label={fullscreen ? "Exit fullscreen" : "View fullscreen"}
      aria-pressed={fullscreen}
      title={fullscreen ? "Exit fullscreen" : "View fullscreen"}
      onclick={toggleFullscreen}
    >
      {#if fullscreen}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5"></path>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"></path>
        </svg>
      {/if}
    </button>
  </div>
  <div class="preview-presentation-frame">
    <iframe
      src={previewUrl}
      title={`${title} preview`}
      data-preview-width={width}
      style:width={`${previewWidths[width]}px`}
    ></iframe>
  </div>
</section>

<style>
  .preview-presentation {
    position: relative;
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 0.5rem;
  }

  .preview-presentation-toolbar {
    display: flex;
    min-height: 2rem;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .preview-size-controls {
    display: flex;
    align-items: center;
    padding: 0.125rem;
    border: 1px solid var(--site-border);
    border-radius: 0.625rem;
    background: var(--site-panel);
  }

  .preview-size-controls legend {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  .preview-presentation button {
    display: inline-flex;
    width: 1.75rem;
    height: 1.75rem;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--site-muted);
    cursor: pointer;
  }

  .preview-presentation button:hover,
  .preview-presentation button[aria-pressed="true"] {
    background: var(--site-accent);
    color: var(--site-foreground);
  }

  .preview-presentation button:focus-visible {
    outline: 2px solid var(--site-primary);
    outline-offset: 2px;
  }

  .preview-presentation svg {
    width: 1rem;
    height: 1rem;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.75;
  }

  .preview-presentation .preview-fullscreen-control {
    border: 1px solid var(--site-border);
    background: var(--site-panel);
  }

  .preview-presentation-frame {
    position: relative;
    display: flex;
    width: 100%;
    height: var(--preview-height);
    min-width: 0;
    justify-content: center;
    overflow: hidden;
    border: 1px solid var(--site-border);
    border-radius: 0.75rem;
    background: var(--site-panel);
  }

  .preview-presentation iframe {
    display: block;
    height: var(--preview-height);
    max-width: 100%;
    flex: 0 0 auto;
    border: 0;
    background: var(--site-background);
  }

  .preview-presentation:fullscreen {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    background: var(--site-background);
  }

  .preview-presentation:fullscreen .preview-presentation-frame {
    height: auto;
    flex: 1;
  }

  .preview-presentation:fullscreen iframe {
    height: 100%;
  }
</style>
