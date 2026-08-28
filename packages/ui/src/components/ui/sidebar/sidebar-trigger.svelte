<script module lang="ts">
import type { ComponentProps } from "svelte";

type ButtonComponent = typeof import("../button/button.svelte").default;
export type SidebarTriggerProps = ComponentProps<ButtonComponent>;
</script>

<script lang="ts">
import SidebarLeftIcon from "@hugeicons/core-free-icons/SidebarLeftIcon";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { cn } from "$lib/utils.js";
import Button from "../button/button.svelte";
import { useSidebar } from "./context.js";

let {
  children,
  class: className,
  onclick,
  ref = $bindable(null),
  ...props
}: SidebarTriggerProps = $props();
const sidebar = useSidebar();

function handleClick(event: MouseEvent): void {
  onclick?.(event);
  sidebar.toggleSidebar();
}
</script>

<Button
  bind:ref
  class={cn("size-7", className)}
  data-sidebar="trigger"
  data-slot="sidebar-trigger"
  onclick={handleClick}
  size="icon"
  variant="ghost"
  {...props}
>
  {#if children}
    {@render children()}
  {:else}
    <HugeiconsIcon aria-hidden="true" icon={SidebarLeftIcon} strokeWidth={2} />
    <span class="sr-only">Toggle Sidebar</span>
  {/if}
</Button>
