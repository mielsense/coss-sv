<script lang="ts">
  import CopyButton from "./CopyButton.svelte";

  type Props = {
    pnpm: string;
    shadcnSvelte: string;
  };

  let { pnpm, shadcnSvelte }: Props = $props();
  let selected = $state<"pnpm" | "shadcn-svelte">("shadcn-svelte");
  let command = $derived(selected === "pnpm" ? pnpm : shadcnSvelte);
  const id = $props.id();
  const panelId = `${id}-panel`;
  const pnpmTabId = `${id}-pnpm-tab`;
  const shadcnTabId = `${id}-shadcn-svelte-tab`;

  function selectTab(next: "pnpm" | "shadcn-svelte", focus = false): void {
    selected = next;
    if (focus) document.getElementById(next === "pnpm" ? pnpmTabId : shadcnTabId)?.focus();
  }

  function navigateTabs(event: KeyboardEvent): void {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    selectTab(selected === "pnpm" ? "shadcn-svelte" : "pnpm", true);
  }
</script>

<div class="relative my-6 overflow-hidden rounded-xl border bg-code text-code-foreground">
  <div
    class="flex min-h-10 items-center gap-1 border-b px-2"
    role="tablist"
    aria-label="Install method"
  >
    <button
      type="button"
      id={shadcnTabId}
      role="tab"
      aria-controls={panelId}
      aria-selected={selected === "shadcn-svelte"}
      tabindex={selected === "shadcn-svelte" ? 0 : -1}
      class="rounded-lg px-2.5 py-1.5 text-xs font-medium aria-selected:bg-accent aria-selected:text-foreground"
      onclick={() => selectTab("shadcn-svelte")}
      onkeydown={navigateTabs}
    >
      shadcn-svelte
    </button>
    <button
      type="button"
      id={pnpmTabId}
      role="tab"
      aria-controls={panelId}
      aria-selected={selected === "pnpm"}
      tabindex={selected === "pnpm" ? 0 : -1}
      class="rounded-lg px-2.5 py-1.5 text-xs font-medium aria-selected:bg-accent aria-selected:text-foreground"
      onclick={() => selectTab("pnpm")}
      onkeydown={navigateTabs}
    >
      pnpm
    </button>
  </div>
  <div id={panelId} role="tabpanel" aria-labelledby={selected === "pnpm" ? pnpmTabId : shadcnTabId}>
    <pre class="overflow-x-auto px-4 py-3.5 text-xs"><code>{command}</code></pre>
  </div>
  <CopyButton class="absolute right-1.5 top-1.5" value={command} />
</div>
