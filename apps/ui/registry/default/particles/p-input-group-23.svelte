<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "input-group", "tooltip"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-input-group-23",
    interactive: true,
    responsive: false,
    title: "Search input group with loader and voice button",
  });
</script>

<script lang="ts">
  import { buttonVariants, HugeiconsIcon, InputGroup, Tooltip } from "@coss-sv/ui";
  import Loading02Icon from "@hugeicons/core-free-icons/Loading02Icon";
  import Mic01Icon from "@hugeicons/core-free-icons/Mic01Icon";
  import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
  import { onDestroy } from "svelte";

  let value = $state("");
  let loading = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  function search(next: string) {
    value = next;
    clearTimeout(timer);
    loading = Boolean(next);
    if (next) timer = setTimeout(() => (loading = false), 500);
  }

  onDestroy(() => clearTimeout(timer));
</script>

<InputGroup.Root>
  <InputGroup.Addon>
    {#if loading}
      <HugeiconsIcon
        aria-label="Loading..."
        class="animate-spin"
        icon={Loading02Icon}
        role="status"
        strokeWidth={2}
      />
    {:else}
      <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
    {/if}
  </InputGroup.Addon>
  <InputGroup.Input
    aria-label="Search"
    onValueChange={search}
    placeholder="Search..."
    type="search"
    {value}
  />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger
        aria-label="Voice search"
        class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
      >
        <HugeiconsIcon aria-hidden="true" icon={Mic01Icon} strokeWidth={2} />
      </Tooltip.Trigger>
      <Tooltip.Popup>Voice search</Tooltip.Popup>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
