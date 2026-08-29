<script module lang="ts">
  import type { Select as ShardsSelect } from "@shardsui/svelte";
  import type { ComponentProps, Snippet } from "svelte";

  type P = ComponentProps<typeof ShardsSelect.Positioner>;
  export type SelectPopupProps = Omit<ComponentProps<typeof ShardsSelect.Popup>, "children"> & {
    align?: P["align"];
    alignItemWithTrigger?: boolean;
    alignOffset?: P["alignOffset"];
    anchor?: P["anchor"];
    children?: Snippet;
    portalProps?: ComponentProps<typeof ShardsSelect.Portal>;
    side?: P["side"];
    sideOffset?: P["sideOffset"];
  };
</script>

<script lang="ts">
  import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
  import { Select as S } from "@shardsui/svelte";
  import { tick } from "svelte";
  import HugeiconsIcon from "$lib/hugeicons-icon.svelte";
  import { cn } from "$lib/utils.js";
  import { getSelectWrapperContext } from "./context.svelte.js";

  let {
    align = "start",
    alignItemWithTrigger = true,
    alignOffset = 0,
    anchor,
    children: child,
    class: className,
    portalProps = {},
    ref = $bindable(null),
    side = "bottom",
    sideOffset = 4,
    ...props
  }: SelectPopupProps = $props();
  const context = getSelectWrapperContext();
  let positioner = $state<HTMLElement | null>(null);
  let alignDelta = $state(0);
  let sideDelta = $state(0);
  const anchorProps = $derived(anchor === undefined ? {} : { anchor });
  const positionerStyle = $derived(
    alignItemWithTrigger && (alignDelta !== 0 || sideDelta !== 0)
      ? `translate: ${alignDelta}px ${sideDelta}px`
      : undefined,
  );
  function frame() {
    return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
  async function alignSelected(cancelled: () => boolean) {
    const trigger = context.triggerRef;
    const pos = positioner;
    if (!trigger || !pos) return;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await tick();
      await frame();
      if (cancelled()) return;
      if (pos.hidden || pos.style.opacity === "0" || pos.style.transform === "") continue;
      const item = pos.querySelector<HTMLElement>('[role="option"][aria-selected="true"]');
      const triggerLabel = trigger.querySelector<HTMLElement>('[data-slot="select-value"]');
      const itemLabel = item?.querySelector<HTMLElement>(".col-start-2");
      if (!item || !triggerLabel || !itemLabel) return;
      const tr = trigger.getBoundingClientRect();
      const ir = item.getBoundingClientRect();
      const tl = triggerLabel.getBoundingClientRect();
      const il = itemLabel.getBoundingClientRect();
      const y = tr.top + tr.height / 2 - (ir.top + ir.height / 2);
      const rtl = getComputedStyle(pos).direction === "rtl";
      const x = rtl ? tl.right - il.right : tl.left - il.left;
      if (Math.abs(y) <= 0.5 && Math.abs(x) <= 0.5) return;
      const needsX = Math.abs(x) > 0.5;
      const needsY = Math.abs(y) > 0.5;
      const previousRect = pos.getBoundingClientRect();
      if (Math.abs(y) > 0.5) sideDelta += y;
      if (Math.abs(x) > 0.5) alignDelta += x;
      await tick();
      let movedX = !needsX;
      let movedY = !needsY;
      for (let wait = 0; wait < 8 && (!movedX || !movedY); wait += 1) {
        await frame();
        if (cancelled()) return;
        const nextRect = pos.getBoundingClientRect();
        movedX ||= Math.abs(nextRect.left - previousRect.left) > 0.5;
        movedY ||= Math.abs(nextRect.top - previousRect.top) > 0.5;
      }
      if (!movedX || !movedY) return;
    }
  }
  $effect(() => {
    const open = context.open;
    const trigger = context.triggerRef;
    const pos = positioner;
    void context.value;
    if (!open || !trigger || !pos || !alignItemWithTrigger) {
      if (!open) {
        alignDelta = 0;
        sideDelta = 0;
      }
      return;
    }
    let cancelled = false;
    void alignSelected(() => cancelled);
    return () => {
      cancelled = true;
    };
  });
</script>

<S.Portal {...portalProps}
  ><S.Positioner
    {align}
    {alignOffset}
    {...anchorProps}
    bind:ref={positioner}
    class="z-50 select-none"
    data-side={alignItemWithTrigger ? "none" : undefined}
    data-slot="select-positioner"
    {side}
    {sideOffset}
    style={positionerStyle}
    ><S.Popup
      bind:ref
      class="origin-(--transform-origin) text-foreground outline-none"
      data-slot="select-popup"
      {...props}
      ><S.ScrollUpArrow
        class="top-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:top-px before:h-[200%] before:rounded-t-[calc(var(--radius-lg)-1px)] before:bg-linear-to-b before:from-50% before:from-popover"
        data-slot="select-scroll-up-arrow"
        ><HugeiconsIcon
          aria-hidden="true"
          class="relative size-4.5 sm:size-4"
          icon={ArrowUp01Icon}
          strokeWidth={2}
        /></S.ScrollUpArrow
      >
      <div
        class="relative h-full min-w-(--anchor-width) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]"
      >
        <S.List
          class={cn("max-h-(--available-height) overflow-y-auto p-1", className)}
          data-slot="select-list">{@render child?.()}</S.List
        >
      </div>
      <S.ScrollDownArrow
        class="bottom-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:bottom-px before:h-[200%] before:rounded-b-[calc(var(--radius-lg)-1px)] before:bg-linear-to-t before:from-50% before:from-popover"
        data-slot="select-scroll-down-arrow"
        ><HugeiconsIcon
          aria-hidden="true"
          class="relative size-4.5 sm:size-4"
          icon={ArrowDown01Icon}
          strokeWidth={2}
        /></S.ScrollDownArrow
      ></S.Popup
    ></S.Positioner
  ></S.Portal
>
