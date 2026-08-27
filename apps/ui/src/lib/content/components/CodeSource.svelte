<script lang="ts">
import CopyButton from "./CopyButton.svelte";

type Props = {
  highlighted: string;
  language: string;
  raw: string;
  title?: string;
};

let { highlighted, language, raw, title }: Props = $props();
</script>

<figure class="relative my-6 overflow-hidden rounded-xl border bg-code text-code-foreground">
  {#if title}
    <figcaption class="flex min-h-10 items-center border-b px-4 font-mono text-xs opacity-80">
      {title}
    </figcaption>
  {/if}
  <div class="absolute right-1.5 top-1.5 z-10">
    <CopyButton value={raw} />
  </div>
  <div class="max-w-full overflow-x-auto" data-language={language}>
    {@html highlighted}
  </div>
</figure>
