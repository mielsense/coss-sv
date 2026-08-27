import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./drawer.browser-fixture.svelte";
import HydrationFixture from "./drawer.hydration-fixture.svelte";
import { drawerSsrHtml } from "./drawer.hydration-html.js";
afterEach(() => {
  document.body.innerHTML = "";
});
describe("Drawer browser contract", () => {
  test("renders each direction, traps focus, dismisses, and restores focus", async () => {
    render(Fixture);
    for (const position of ["bottom", "top", "left", "right"] as const) {
      const trigger = page.getByRole("button", { name: `Open ${position} drawer` });
      await trigger.click();
      const popup = page.getByRole("dialog", { name: `${position} drawer` });
      await expect.element(popup).toBeVisible();
      expect(document.querySelector(`[data-testid="${position}-drawer"]`)?.className).toContain(
        position === "bottom" ? "translateY" : position === "top" ? "-100%" : "translateX",
      );
      await userEvent.keyboard("{Tab}{Tab}{Tab}");
      expect(
        document
          .querySelector(`[data-testid="${position}-drawer"]`)
          ?.contains(document.activeElement),
      ).toBe(true);
      await userEvent.keyboard("{Escape}");
      await expect.element(popup).not.toBeInTheDocument();
      expect((document.activeElement as HTMLElement | null)?.textContent).toContain(
        `Open ${position} drawer`,
      );
    }
  });

  test("keeps nested drawers stacked and exposes snap-point state", async () => {
    render(Fixture);
    await page.getByRole("button", { name: "Open bottom drawer" }).click();
    await expect.element(page.getByTestId("bottom-state")).toHaveTextContent("true:0.35");
    const popup = document.querySelector<HTMLElement>('[data-testid="bottom-drawer"]');
    expect(popup?.style.getPropertyValue("--drawer-snap-point-offset")).not.toBe("");
    await page.getByRole("button", { name: "Open nested drawer" }).click();
    await expect.element(page.getByRole("dialog", { name: "Nested drawer" })).toBeVisible();
    expect(document.querySelectorAll('[data-slot="drawer-popup"]')).toHaveLength(2);
    await userEvent.keyboard("{Escape}{Escape}");
  });

  test("dismisses from the backdrop", async () => {
    render(Fixture);
    await page.getByRole("button", { name: "Open right drawer" }).click();
    const backdrop = document.querySelector<HTMLElement>('[data-slot="drawer-backdrop"]');
    backdrop?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    backdrop?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));
    backdrop?.click();
    await expect
      .element(page.getByRole("dialog", { name: "right drawer" }))
      .not.toBeInTheDocument();
  });

  test("preserves Shards pointer dragging and non-modal edge swipe semantics", async () => {
    render(Fixture);
    await page.getByRole("button", { name: "Open bottom drawer" }).click();
    const popup = document.querySelector<HTMLElement>('[data-testid="bottom-drawer"]');
    if (!popup) throw new Error("Bottom drawer did not mount.");
    const dragTarget = popup.querySelector<HTMLElement>('[data-slot="drawer-header"]');
    if (!dragTarget) throw new Error("Drawer header did not mount.");
    const rect = dragTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const hitTarget = document.elementFromPoint(startX, startY);
    if (!hitTarget || !popup.contains(hitTarget)) {
      throw new Error(`Drawer drag target is outside popup: ${hitTarget?.outerHTML ?? "none"}`);
    }
    dragTarget.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        clientX: startX,
        clientY: startY,
        isPrimary: true,
        pointerId: 9,
        pointerType: "mouse",
      }),
    );
    dragTarget.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        buttons: 1,
        clientX: startX,
        clientY: startY + 160,
        isPrimary: true,
        pointerId: 9,
        pointerType: "mouse",
      }),
    );
    await expect.poll(() => popup.hasAttribute("data-swiping")).toBe(true);
    dragTarget.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        clientX: startX,
        clientY: rect.bottom + 300,
        isPrimary: true,
        pointerId: 9,
        pointerType: "mouse",
      }),
    );
    await expect.poll(() => popup.hasAttribute("data-swiping")).toBe(false);
    await expect.element(page.getByRole("dialog", { name: "bottom drawer" })).toBeVisible();
    const edge = page.getByTestId("edge-swipe");
    await expect.element(edge).toHaveAttribute("role", "presentation");
    await expect.element(edge).toHaveAttribute("aria-hidden", "true");
  });
  test("hydrates genuine SSR output and opens its portal without mismatches", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = drawerSsrHtml;
    document.body.append(target);
    const component = hydrate(HydrationFixture, { target });
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    await page.getByRole("button", { name: "Open hydrated drawer" }).click();
    await expect.element(page.getByRole("dialog", { name: "Hydrated drawer" })).toBeVisible();
    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });
});
