<script lang="ts">
import { Toast as ToastPrimitive } from "@shardsui/svelte";
import { buttonVariants } from "../button/index.js";
import { getToastReplayClass, type ToastData, type ToastPortalProps } from "./toast.types.js";
import ToastIcon from "./toast-icon.svelte";
import ToastPortal from "./toast-portal.svelte";

let { portalProps }: { portalProps?: ToastPortalProps | undefined } = $props();
const manager = ToastPrimitive.getToastManager();
</script>

<ToastPortal {...portalProps} dataSlot="toast-portal-anchored">
  <ToastPrimitive.Viewport class="outline-none" data-slot="toast-viewport-anchored">
    {#each manager.toasts as toast (toast.id)}
      {const toastData = toast.data as ToastData | undefined}
      {#if toast.positionerProps?.anchor}
        <ToastPrimitive.Positioner
          class="z-50 max-w-[min(--spacing(64),var(--available-width))]"
          data-slot="toast-positioner"
          side={toast.positionerProps.side ?? "top"}
          sideOffset={toast.positionerProps.sideOffset ?? 4}
          {toast}
        >
          <ToastPrimitive.Root
            class={[
              "relative text-balance border bg-popover not-dark:bg-clip-padding text-popover-foreground text-xs transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
              toastData?.tooltipStyle
                ? "rounded-md shadow-md/5 before:rounded-[calc(var(--radius-md)-1px)]"
                : "rounded-lg shadow-lg/5 before:rounded-[calc(var(--radius-lg)-1px)]",
              getToastReplayClass(toast),
            ]}
            {...toastData?.rootProps}
            data-slot="toast-popup"
            {toast}
          >
            {#if toastData?.tooltipStyle}
              <ToastPrimitive.Content class="pointer-events-auto px-2 py-1">
                <ToastPrimitive.Title data-slot="toast-title" />
              </ToastPrimitive.Content>
            {:else}
              <ToastPrimitive.Content
                class="pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm"
              >
                <div class="flex gap-2">
                  {#if toast.type && ["error", "info", "loading", "success", "warning"].includes(toast.type)}
                    <div
                      class="[&>svg]:h-lh [&>svg]:w-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
                      data-slot="toast-icon"
                    >
                      <ToastIcon type={toast.type} />
                    </div>
                  {/if}
                  <div class="flex flex-col gap-0.5">
                    <ToastPrimitive.Title class="font-medium" data-slot="toast-title" />
                    <ToastPrimitive.Description
                      class="text-muted-foreground"
                      data-slot="toast-description"
                    />
                  </div>
                </div>
                {#if toast.actionProps}
                  <ToastPrimitive.Action
                    class={buttonVariants({ size: "xs" })}
                    data-slot="toast-action"
                  />
                {/if}
              </ToastPrimitive.Content>
            {/if}
          </ToastPrimitive.Root>
        </ToastPrimitive.Positioner>
      {/if}
    {/each}
  </ToastPrimitive.Viewport>
</ToastPortal>

<style>
:global(.animate-toast-success-odd) {
  animation: toast-success-odd 0.32s cubic-bezier(0.5, 1, 0.89, 1);
}
:global(.animate-toast-success-even) {
  animation: toast-success-even 0.32s cubic-bezier(0.5, 1, 0.89, 1);
}
:global(.animate-toast-error-odd) {
  animation: toast-error-odd 0.28s cubic-bezier(0.5, 1, 0.89, 1);
}
:global(.animate-toast-error-even) {
  animation: toast-error-even 0.28s cubic-bezier(0.5, 1, 0.89, 1);
}
@keyframes toast-success-odd {
  0% {
    scale: 1;
  }
  30% {
    scale: 1.025;
  }
  60% {
    scale: 0.99;
  }
  100% {
    scale: 1;
  }
}
@keyframes toast-success-even {
  0% {
    scale: 1;
  }
  30% {
    scale: 1.025;
  }
  60% {
    scale: 0.99;
  }
  100% {
    scale: 1;
  }
}
@keyframes toast-error-odd {
  0%,
  100% {
    translate: 0 0;
  }
  25%,
  75% {
    translate: -3px 0;
  }
  50% {
    translate: 3px 0;
  }
}
@keyframes toast-error-even {
  0%,
  100% {
    translate: 0 0;
  }
  25%,
  75% {
    translate: -3px 0;
  }
  50% {
    translate: 3px 0;
  }
}
</style>
