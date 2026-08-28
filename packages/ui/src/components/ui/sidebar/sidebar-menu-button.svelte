<script module lang="ts">
import type { Component, Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { TooltipPopupProps } from "../tooltip/tooltip-popup.svelte";

export type SidebarMenuButtonSize = "default" | "lg" | "sm";
export type SidebarMenuButtonVariant = "default" | "outline";
export type SidebarMenuButtonTooltip = string | TooltipPopupProps;
export type SidebarMenuButtonProps = Omit<HTMLButtonAttributes, "children" | "class"> & {
  as?: keyof HTMLElementTagNameMap;
  children?: Snippet;
  class?: string;
  href?: string;
  isActive?: boolean;
  ref?: HTMLElement | null;
  size?: SidebarMenuButtonSize;
  tooltip?: SidebarMenuButtonTooltip;
  variant?: SidebarMenuButtonVariant;
};
</script>

<script lang="ts">
import { cn } from "$lib/utils.js";
import * as Tooltip from "../tooltip/index.js";
import { useSidebar } from "./context.js";

type ForwardedTooltipTriggerProps = Record<string, unknown> & {
  children?: Snippet;
  ref?: HTMLElement | null;
};
const SidebarTooltipTrigger = Tooltip.Trigger as unknown as Component<
  ForwardedTooltipTriggerProps,
  object,
  "ref"
>;

const baseClass =
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pe-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg:not([class*='size-'])]:size-4 [&>svg]:shrink-0";

let {
  as,
  children,
  class: className,
  href,
  isActive = false,
  ref = $bindable(null),
  size = "default",
  tooltip,
  type = "button",
  variant = "default",
  ...props
}: SidebarMenuButtonProps = $props();

const sidebar = useSidebar();
const tag = $derived(as ?? (href ? "a" : "button"));
const classes = $derived(
  cn(
    baseClass,
    size === "default" && "h-8 text-sm",
    size === "lg" && "h-12 text-sm group-data-[collapsible=icon]:p-0!",
    size === "sm" && "h-7 text-xs",
    variant === "default" && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    variant === "outline" &&
      "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
    className,
  ),
);
const tooltipProps = $derived(typeof tooltip === "string" ? {} : (tooltip ?? {}));
</script>

{#snippet buttonContent()}
  {@render children?.()}
{/snippet}

{#if tooltip}
  <Tooltip.Root>
    <SidebarTooltipTrigger
      as={tag}
      bind:ref
      class={classes}
      data-active={isActive}
      data-sidebar="menu-button"
      data-size={size}
      data-slot="sidebar-menu-button"
      {href}
      type={tag === "button" ? type : undefined}
      {...props}
    >
      {@render buttonContent()}
    </SidebarTooltipTrigger>
    <Tooltip.Popup
      align="center"
      hidden={sidebar.state !== "collapsed" || sidebar.isMobile}
      side="right"
      {...tooltipProps}
    >
      {#if typeof tooltip === "string"}
        {tooltip}
      {:else}
        {@render tooltip.children?.()}
      {/if}
    </Tooltip.Popup>
  </Tooltip.Root>
{:else}
  <svelte:element
    this={tag}
    bind:this={ref}
    class={classes}
    data-active={isActive}
    data-sidebar="menu-button"
    data-size={size}
    data-slot="sidebar-menu-button"
    {href}
    type={tag === "button" ? type : undefined}
    {...props}
  >
    {@render buttonContent()}
  </svelte:element>
{/if}
