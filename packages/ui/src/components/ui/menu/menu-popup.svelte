<script lang="ts">
  import { Menu as MenuPrimitive } from "@shardsui/svelte";
  import { cn } from "$lib/utils.js";
  import type { MenuPopupProps } from "./menu.types.js";

  const popupClass =
    "relative flex not-[class*='w-']:min-w-32 origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] focus:outline-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)]";
  const generatedId = $props.id();

  let {
    align = "center",
    alignOffset,
    anchor,
    children: child,
    class: className,
    id = generatedId,
    portalProps,
    ref = $bindable(null),
    side = "bottom",
    sideOffset = 4,
    ...props
  }: MenuPopupProps = $props();

  const alignOffsetProps = $derived(alignOffset === undefined ? {} : { alignOffset });
  const anchorProps = $derived(anchor === undefined ? {} : { anchor });
</script>

<MenuPrimitive.Portal {...portalProps}>
  <MenuPrimitive.Positioner
    {align}
    {...alignOffsetProps}
    {...anchorProps}
    class="z-50"
    data-slot="menu-positioner"
    {side}
    {sideOffset}
  >
    <MenuPrimitive.Popup
      bind:ref
      class={cn(popupClass, className)}
      data-slot="menu-popup"
      {id}
      {...props}
    >
      {#snippet children(state)}
        <div class="max-h-(--available-height) w-full overflow-y-auto p-1">
          {@render child?.(state)}
        </div>
      {/snippet}
    </MenuPrimitive.Popup>
  </MenuPrimitive.Positioner>
</MenuPrimitive.Portal>
