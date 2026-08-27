<script lang="ts">
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = HTMLButtonAttributes & {
  value: string;
};

let { value, class: className, ...rest }: Props = $props();
let copied = $state(false);
let resetTimer: number | undefined;

async function copy(): Promise<void> {
  await navigator.clipboard.writeText(value);
  copied = true;
  if (resetTimer) window.clearTimeout(resetTimer);
  resetTimer = window.setTimeout(() => {
    copied = false;
  }, 1500);
}

$effect(() => {
  return () => {
    if (resetTimer) window.clearTimeout(resetTimer);
  };
});
</script>

<button
  type="button"
  class={`inline-flex h-8 items-center rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 ${className ?? ""}`}
  aria-label={copied ? "Copied" : "Copy to clipboard"}
  {...rest}
  onclick={copy}
>
  {copied ? "Copied" : "Copy"}
</button>
