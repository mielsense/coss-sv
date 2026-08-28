import { hydrate, unmount } from "svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import SidebarBrowserFixture from "./sidebar.browser-fixture.svelte";
import SidebarHydrationFixture from "./sidebar.hydration-fixture.svelte";

const SIDEBAR_SSR_HTML =
  '<!--[--><!--[--><div class="group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar" data-slot="sidebar-wrapper" style="--sidebar-width: 16rem; --sidebar-width-icon: 3rem;"><!--[--><!--[0--><div class="flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground" data-slot="sidebar"><!--[--><!--$s1--><div class="flex h-8 items-center gap-2 rounded-lg px-2" data-sidebar="menu-skeleton" data-slot="sidebar-menu-skeleton"><!--[-1--><!--[0--><div class="animate-skeleton [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed] dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)] size-4 rounded-lg" data-slot="skeleton" data-sidebar="menu-skeleton-icon"><!----></div><!--]--> <div class="animate-skeleton rounded-sm [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed] dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)] h-4 max-w-(--skeleton-width) flex-1" data-slot="skeleton" data-sidebar="menu-skeleton-text" style="--skeleton-width: 64%;"><!----></div><!----><!--]--></div><!--]--><!----></div><!--]--><!--]--><!----></div><!--]--><!--]-->';

function mediaQueryList(matches: boolean): MediaQueryList {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  return {
    addEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (typeof listener === "function") {
        listeners.add(listener as (event: MediaQueryListEvent) => void);
      }
    },
    addListener: (listener) => {
      if (listener) listeners.add(listener as (event: MediaQueryListEvent) => void);
    },
    dispatchEvent: () => true,
    matches,
    media: "(max-width: 799px)",
    onchange: null,
    removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (typeof listener === "function") {
        listeners.delete(listener as (event: MediaQueryListEvent) => void);
      }
    },
    removeListener: (listener) => {
      if (listener) listeners.delete(listener as (event: MediaQueryListEvent) => void);
    },
  } as MediaQueryList;
}

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => mediaQueryList(false)),
  );
});

afterEach(() => {
  document.body.innerHTML = "";
  // biome-ignore lint/suspicious/noDocumentCookie: test cleanup covers the provider's legacy fallback.
  document.cookie = "sidebar_state=; Max-Age=0; Path=/";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe.sequential("Sidebar browser contract", () => {
  test("toggles bindable desktop state from the trigger, rail, and keyboard shortcut", async () => {
    render(SidebarBrowserFixture);
    const sidebar = document.querySelector('[data-testid="primary-sidebar"]')?.parentElement;
    expect(sidebar).not.toBeNull();
    expect(
      document.querySelector('[data-slot="sidebar-trigger"] svg[aria-hidden="true"] path'),
    ).not.toBeNull();

    expect(sidebar?.getAttribute("data-state")).toBe("expanded");
    await page.getByTestId("trigger").click();
    await vi.waitFor(() => expect(sidebar?.getAttribute("data-state")).toBe("collapsed"));
    await expect.element(page.getByTestId("bound-open")).toHaveTextContent("false");

    await page.getByTestId("rail").click();
    await vi.waitFor(() => expect(sidebar?.getAttribute("data-state")).toBe("expanded"));

    await userEvent.keyboard("{Control>}b{/Control}");
    await vi.waitFor(() => expect(sidebar?.getAttribute("data-state")).toBe("collapsed"));
    await expect.element(page.getByTestId("changes")).toHaveTextContent("false,true,false");
    expect(document.cookie).toContain("sidebar_state=false");
  });

  test("lets a function binding veto controlled state changes", async () => {
    render(SidebarBrowserFixture);

    await page.getByTestId("locked-trigger").click();
    const locked = document.querySelector('[data-testid="locked-sidebar"]')?.parentElement;
    expect(locked?.getAttribute("data-state")).toBe("expanded");
    await expect.element(page.getByTestId("locked-attempts")).toHaveTextContent("1");
  });

  test("forwards refs and keeps rail out of sequential focus order", async () => {
    render(SidebarBrowserFixture);

    await expect.element(page.getByTestId("trigger-ref")).toHaveTextContent("BUTTON");
    await expect.element(page.getByTestId("rail")).toHaveAttribute("tabindex", "-1");
    page.getByTestId("trigger").element().focus();
    await userEvent.keyboard("{Tab}");
    await expect.element(page.getByTestId("after-trigger")).toHaveFocus();
  });

  test("shows menu tooltips only while the desktop sidebar is collapsed", async () => {
    render(SidebarBrowserFixture);
    const dashboard = page.getByRole("button", { name: "Dashboard", exact: true });

    await dashboard.hover();
    await vi.waitFor(() => {
      expect(document.querySelector('[data-slot="tooltip-popup"]')?.hasAttribute("hidden")).toBe(
        true,
      );
    });
    await page.getByTestId("trigger").click();
    await dashboard.hover();
    await vi.waitFor(() => {
      expect(document.querySelector('[data-slot="tooltip-popup"]')?.hasAttribute("hidden")).toBe(
        false,
      );
    });
  });

  test("hydrates provider context and the deterministic skeleton without diagnostics", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = SIDEBAR_SSR_HTML;
    document.body.append(target);

    const component = hydrate(SidebarHydrationFixture, { target });
    expect(target.querySelector('[data-sidebar="menu-skeleton-text"]')).not.toBeNull();
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    await unmount(component);
  });

  test("uses the mobile drawer at the upstream 799px breakpoint and closes with Escape", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => mediaQueryList(true)),
    );

    render(SidebarBrowserFixture);
    await page.getByTestId("trigger").click();

    const drawer = document.querySelector<HTMLElement>('[data-mobile="true"]');
    expect(drawer).not.toBeNull();
    expect(drawer?.textContent).toContain("Dashboard");
    await expect
      .element(page.getByTestId("context-state"))
      .toHaveTextContent("expanded:true:true:true");
    await userEvent.keyboard("{Escape}");
    await vi.waitFor(() => {
      expect(document.querySelector('[data-mobile="true"]')).toBeNull();
    });
    await expect.element(page.getByTestId("trigger")).toHaveFocus();
  });
});
