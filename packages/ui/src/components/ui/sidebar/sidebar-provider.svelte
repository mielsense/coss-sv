<script module lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type SidebarProviderProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "class"> & {
  children?: Snippet;
  class?: string;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  ref?: HTMLDivElement | null;
};
</script>

<script lang="ts">
import { untrack } from "svelte";
import { MediaQuery } from "svelte/reactivity";
import { cn } from "$lib/utils.js";
import { setSidebarContext } from "./context.js";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

let {
  children,
  class: className,
  defaultOpen = true,
  onOpenChange,
  open = $bindable(),
  ref = $bindable(null),
  style,
  ...props
}: SidebarProviderProps = $props();

const initialOpen = untrack(() => defaultOpen);
const mobile = new MediaQuery("(max-width: 799px)", false);
let openMobile = $state(false);
const resolvedOpen = $derived(open ?? initialOpen);

function persistOpen(next: boolean): void {
  if (typeof window === "undefined") return;
  const expires = Date.now() + SIDEBAR_COOKIE_MAX_AGE * 1000;
  if ("cookieStore" in window && window.cookieStore) {
    void window.cookieStore.set({
      expires,
      name: SIDEBAR_COOKIE_NAME,
      path: "/",
      value: String(next),
    });
    return;
  }
  // biome-ignore lint/suspicious/noDocumentCookie: Safari still needs the cookie fallback used by COSS.
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${String(next)}; Path=/; Max-Age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function setOpen(nextOrUpdater: boolean | ((current: boolean) => boolean)): void {
  const next = typeof nextOrUpdater === "function" ? nextOrUpdater(resolvedOpen) : nextOrUpdater;
  onOpenChange?.(next);
  open = next;
  persistOpen(next);
}

function setOpenMobile(nextOrUpdater: boolean | ((current: boolean) => boolean)): void {
  openMobile = typeof nextOrUpdater === "function" ? nextOrUpdater(openMobile) : nextOrUpdater;
}

function toggleSidebar(): void {
  if (mobile.current) setOpenMobile((current) => !current);
  else setOpen((current) => !current);
}

setSidebarContext({
  get isMobile() {
    return mobile.current;
  },
  get open() {
    return resolvedOpen;
  },
  get openMobile() {
    return openMobile;
  },
  get state() {
    return resolvedOpen ? "expanded" : "collapsed";
  },
  setOpen,
  setOpenMobile,
  toggleSidebar,
});

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    toggleSidebar();
  }
}

const providerStyle = $derived(
  `--sidebar-width: ${SIDEBAR_WIDTH}; --sidebar-width-icon: ${SIDEBAR_WIDTH_ICON};${typeof style === "string" && style ? ` ${style}` : ""}`,
);
</script>

<svelte:window onkeydown={handleKeydown} />
<div
  bind:this={ref}
  class={cn(
    "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
    className,
  )}
  data-slot="sidebar-wrapper"
  style={providerStyle}
  {...props}
>
  {@render children?.()}
</div>
