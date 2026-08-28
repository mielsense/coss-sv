<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import {
  type PreviewAlignment,
  type PreviewTheme,
  type PreviewWidth,
  previewWidths,
} from "../../../routes/preview/[name]/preview-contract.js";

type Props = HTMLAttributes<HTMLElement> & {
  align?: PreviewAlignment;
  iframeHeight?: number;
  name: string;
  theme?: PreviewTheme | undefined;
  title?: string;
  width?: PreviewWidth;
};

let {
  align = "center",
  class: className,
  iframeHeight = 450,
  name,
  theme,
  title = name,
  width = "desktop",
  ...rest
}: Props = $props();
let siteTheme = $state<PreviewTheme>("light");
const resolvedTheme = $derived(theme ?? siteTheme);
const previewUrl = $derived(
  `/preview/${encodeURIComponent(name)}?theme=${resolvedTheme}&width=${width}&align=${align}&timers=real`,
);

function trackSiteTheme(_node: HTMLElement) {
  const update = () => {
    siteTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
  };
  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, { attributeFilter: ["class"], attributes: true });
  update();
  return () => observer.disconnect();
}
</script>

<section
  class={["preview-presentation", className]}
  data-align={align}
  data-preview-presentation="true"
  style:--preview-height={`${iframeHeight}px`}
  {...rest}
  {@attach trackSiteTheme}
>
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
.preview-presentation,
.preview-presentation-frame {
  width: 100%;
  height: var(--preview-height);
  min-width: 0;
}

.preview-presentation-frame {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.preview-presentation iframe {
  display: block;
  height: var(--preview-height);
  max-width: 100%;
  flex: 0 0 auto;
  border: 0;
  background: var(--site-background, var(--background));
}
</style>
