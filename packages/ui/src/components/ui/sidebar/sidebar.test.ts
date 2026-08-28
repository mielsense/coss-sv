import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Sidebar from "./index.js";
import SidebarHydrationFixture from "./sidebar.hydration-fixture.svelte";
import SidebarSsrFixture from "./sidebar.ssr-fixture.svelte";
import SidebarContextProbe from "./sidebar-context-probe.svelte";
import SidebarVariantFixture from "./sidebar-variant-fixture.svelte";

describe("Sidebar SSR contract", () => {
  test("exports every COSS part through the namespace barrel", () => {
    const parts = [
      "Provider",
      "Root",
      "Trigger",
      "Rail",
      "Inset",
      "Input",
      "Header",
      "Footer",
      "Separator",
      "Content",
      "Group",
      "GroupLabel",
      "GroupAction",
      "GroupContent",
      "Menu",
      "MenuItem",
      "MenuButton",
      "MenuAction",
      "MenuBadge",
      "MenuSkeleton",
      "MenuSub",
      "MenuSubItem",
      "MenuSubButton",
    ] as const;

    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: this intentionally verifies the public namespace.
    for (const part of parts) expect(Sidebar[part]).toBeTypeOf("function");
    expect(Sidebar.Sidebar).toBe(Sidebar.Root);
    expect(Sidebar.SidebarProvider).toBe(Sidebar.Provider);
    expect(Sidebar.SidebarMenuButton).toBe(Sidebar.MenuButton);
  });

  test("throws the COSS provider error outside context", () => {
    expect(() => render(SidebarContextProbe).body).toThrow(
      "useSidebar must be used within a SidebarProvider.",
    );
  });

  test("renders the collapsed desktop contract and all structural parts", () => {
    const { body } = render(SidebarSsrFixture);

    expect(body).toContain('data-slot="sidebar-wrapper"');
    expect(body).toContain('style="--sidebar-width: 16rem; --sidebar-width-icon: 3rem;"');
    expect(body).toContain('data-state="collapsed"');
    expect(body).toContain('data-collapsible="icon"');
    expect(body).toContain('data-side="right"');
    expect(body).toContain('data-variant="floating"');
    expect(body).toContain('data-slot="sidebar-gap"');
    expect(body).toContain('data-slot="sidebar-container"');
    expect(body).toContain('data-slot="sidebar-inner"');
    expect(body).toContain('data-sidebar="menu-button"');
    expect(body).toContain('data-active="true"');
    expect(body).toContain('data-sidebar="menu-action"');
    expect(body).toContain('data-sidebar="menu-badge"');
    expect(body).toContain('data-sidebar="menu-sub"');
    expect(body).toContain('data-sidebar="menu-skeleton-icon"');
    expect(body).toContain('data-sidebar="menu-skeleton-text"');
    expect(body).toContain('aria-label="Toggle Sidebar"');
    expect(body).toContain("Navigation");
    expect(body).toContain("Reports");
    expect(body).toContain("<label");
    expect(body).toContain('for="sidebar-filter"');
    for (const [href, download] of [
      ["/new", "new.txt"],
      ["/dashboard", "dashboard.txt"],
      ["/more", "more.txt"],
      ["/reports", "reports.txt"],
    ]) {
      expect(body).toContain(`href="${href}"`);
      expect(body).toContain(`download="${download}"`);
    }
    expect(body.match(/rel="noreferrer"/g)).toHaveLength(4);
    expect(body.match(/target="_blank"/g)).toHaveLength(4);
  });

  test("keeps the skeleton width deterministic and inside the upstream range", () => {
    const first = render(SidebarSsrFixture).body;
    const second = render(SidebarSsrFixture).body;
    const width = first.match(/--skeleton-width:\s*(\d+)%/)?.[1];

    expect(second).toBe(first);
    expect(Number(width)).toBeGreaterThanOrEqual(50);
    expect(Number(width)).toBeLessThanOrEqual(89);
  });

  test("keeps the focused hydration fixture deterministic", () => {
    const first = render(SidebarHydrationFixture).body;
    const second = render(SidebarHydrationFixture).body;

    expect(first).toBe(second);
    expect(first).toContain('data-slot="sidebar-menu-skeleton"');
  });

  test("renders every desktop side, variant, and collapse mode", () => {
    for (const side of ["left", "right"] as const) {
      for (const variant of ["sidebar", "floating", "inset"] as const) {
        for (const collapsible of ["offcanvas", "icon"] as const) {
          const { body } = render(SidebarVariantFixture, {
            props: { collapsible, side, variant },
          });
          expect(body).toContain(`data-collapsible="${collapsible}"`);
          expect(body).toContain(`data-side="${side}"`);
          expect(body).toContain(`data-variant="${variant}"`);
        }
      }
    }

    const expanded = render(SidebarVariantFixture, { props: { open: true } }).body;
    expect(expanded).toContain('data-collapsible=""');
    expect(expanded).toContain('data-state="expanded"');

    const fixed = render(SidebarVariantFixture, { props: { collapsible: "none" } }).body;
    expect(fixed).toContain('data-slot="sidebar"');
    expect(fixed).not.toContain('data-slot="sidebar-gap"');
  });
});
