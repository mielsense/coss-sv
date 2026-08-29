<script module lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  export type SidebarCollapsible = "icon" | "none" | "offcanvas";
  export type SidebarSide = "left" | "right";
  export type SidebarVariant = "floating" | "inset" | "sidebar";
  export type SidebarRootProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
    children?: Snippet;
    class?: string;
    collapsible?: SidebarCollapsible;
    ref?: HTMLDivElement | null;
    side?: SidebarSide;
    variant?: SidebarVariant;
  };
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";
  import * as Drawer from "../drawer/index.js";
  import { useSidebar } from "./context.js";

  const SIDEBAR_WIDTH_MOBILE = "18rem";

  let {
    children,
    class: className,
    collapsible = "offcanvas",
    ref = $bindable(null),
    side = "left",
    style,
    variant = "sidebar",
    ...props
  }: SidebarRootProps = $props();

  const sidebar = useSidebar();
  const getOpenMobile = (): boolean => sidebar.openMobile;
  const setDrawerOpen = (next: boolean): void => sidebar.setOpenMobile(next);
  const mobileStyle = $derived(
    `--sidebar-width: ${SIDEBAR_WIDTH_MOBILE};${typeof style === "string" && style ? ` ${style}` : ""}`,
  );
  const mobileProps = $derived(props as Record<string, unknown>);
  const gapClass = $derived(
    cn(
      "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
      "group-data-[collapsible=offcanvas]:w-0",
      "group-data-[side=right]:rotate-180",
      variant === "floating" || variant === "inset"
        ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
        : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
    ),
  );
  const containerClass = $derived(
    cn(
      "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
      side === "left"
        ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
        : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
      variant === "floating" || variant === "inset"
        ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
        : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
      className,
    ),
  );
</script>

{#if collapsible === "none"}
  <div
    bind:this={ref}
    class={cn(
      "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
      className,
    )}
    data-slot="sidebar"
    {style}
    {...props}
  >
    {@render children?.()}
  </div>
{:else if sidebar.isMobile}
  <Drawer.Root bind:open={getOpenMobile, setDrawerOpen} position={side}>
    <Drawer.Popup
      bind:ref
      class={cn(
        "w-(--sidebar-width) max-w-none bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
        className,
      )}
      data-mobile="true"
      data-sidebar="sidebar"
      data-slot="sidebar"
      position={side}
      showCloseButton={false}
      style={mobileStyle}
      variant="straight"
      {...mobileProps}
    >
      <div class="sr-only">
        <Drawer.Title>Sidebar</Drawer.Title>
        <Drawer.Description>Displays the mobile sidebar.</Drawer.Description>
      </div>
      <div class="flex h-full w-full flex-col">{@render children?.()}</div>
    </Drawer.Popup>
  </Drawer.Root>
{:else}
  <div
    class="group peer hidden text-sidebar-foreground md:block"
    data-collapsible={sidebar.state === "collapsed" ? collapsible : ""}
    data-side={side}
    data-slot="sidebar"
    data-state={sidebar.state}
    data-variant={variant}
  >
    <div class={gapClass} data-slot="sidebar-gap"></div>
    <div bind:this={ref} class={containerClass} data-slot="sidebar-container" {style} {...props}>
      <div
        class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm/5"
        data-sidebar="sidebar"
        data-slot="sidebar-inner"
      >
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
