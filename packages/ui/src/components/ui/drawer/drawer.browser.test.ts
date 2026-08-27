import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./drawer.browser-fixture.svelte";
import HydrationFixture from "./drawer.hydration-fixture.svelte";
import { drawerSsrHtml } from "./drawer.hydration-html.js";
function getTransformScale(element: HTMLElement | null): number {
  if (!element) throw new Error("Drawer popup did not mount.");
  const transform = getComputedStyle(element).transform;
  return transform === "none" ? 1 : new DOMMatrixReadOnly(transform).a;
}
function pointerDrag(target: HTMLElement, deltaX: number, deltaY: number, pointerId: number): void {
  const rect = target.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;
  target.dispatchEvent(
    new PointerEvent("pointerdown", {
      bubbles: true,
      button: 0,
      clientX: startX,
      clientY: startY,
      isPrimary: true,
      pointerId,
      pointerType: "mouse",
    }),
  );
  target.dispatchEvent(
    new PointerEvent("pointermove", {
      bubbles: true,
      buttons: 1,
      clientX: startX + deltaX,
      clientY: startY + deltaY,
      isPrimary: true,
      pointerId,
      pointerType: "mouse",
    }),
  );
}
function pointerSwipe(
  target: HTMLElement,
  deltaX: number,
  deltaY: number,
  pointerId: number,
): void {
  const rect = target.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;
  target.dispatchEvent(
    new PointerEvent("pointerdown", {
      bubbles: true,
      button: 0,
      buttons: 1,
      clientX: startX,
      clientY: startY,
      isPrimary: true,
      pointerId,
      pointerType: "mouse",
    }),
  );
  target.dispatchEvent(
    new PointerEvent("pointermove", {
      bubbles: true,
      buttons: 1,
      clientX: startX + Math.sign(deltaX),
      clientY: startY + Math.sign(deltaY),
      isPrimary: true,
      pointerId,
      pointerType: "mouse",
    }),
  );
  target.dispatchEvent(
    new PointerEvent("pointermove", {
      bubbles: true,
      buttons: 1,
      clientX: startX + deltaX,
      clientY: startY + deltaY,
      isPrimary: true,
      pointerId,
      pointerType: "mouse",
    }),
  );
  target.dispatchEvent(
    new PointerEvent("pointerup", {
      bubbles: true,
      clientX: startX + deltaX,
      clientY: startY + deltaY,
      isPrimary: true,
      pointerId,
      pointerType: "mouse",
    }),
  );
}
function touchSwipe(
  target: HTMLElement,
  start: { x: number; y: number },
  end: { x: number; y: number },
): void {
  const touch = (point: { x: number; y: number }) =>
    new Touch({
      clientX: point.x,
      clientY: point.y,
      identifier: 1,
      target,
    });
  const startTouch = touch(start);
  target.dispatchEvent(
    new TouchEvent("touchstart", { bubbles: true, cancelable: true, touches: [startTouch] }),
  );
  const stepTouch = touch({
    x: start.x + Math.sign(end.x - start.x || 0),
    y: start.y + Math.sign(end.y - start.y || 0),
  });
  target.dispatchEvent(
    new TouchEvent("touchmove", { bubbles: true, cancelable: true, touches: [stepTouch] }),
  );
  const endTouch = touch(end);
  target.dispatchEvent(
    new TouchEvent("touchmove", { bubbles: true, cancelable: true, touches: [endTouch] }),
  );
  target.dispatchEvent(
    new TouchEvent("touchend", {
      bubbles: true,
      cancelable: true,
      changedTouches: [endTouch],
      touches: [],
    }),
  );
}
afterEach(() => {
  document.body.innerHTML = "";
});
describe("Drawer browser contract", () => {
  test("supports detached handles and typed payload content", async () => {
    render(Fixture);
    await page.getByRole("button", { name: "Open detached drawer" }).click();
    await expect.element(page.getByRole("dialog", { name: "Detached drawer" })).toBeVisible();
    await expect.element(page.getByText("Detached drawer payload")).toBeVisible();
    await expect.element(page.getByLabelText("Close")).toHaveAttribute("data-slot", "button");
    await page.getByRole("button", { name: "Close detached drawer" }).click();
  });
  test("resets edited form values after close and reopen", async () => {
    render(Fixture);
    const trigger = page.getByRole("button", { name: "Open bottom drawer" });
    await trigger.click();
    const name = page.getByLabelText("Drawer seed 1");
    await name.fill("Edited drawer name");
    await expect.element(name).toHaveValue("Edited drawer name");
    await page.getByRole("button", { name: "Close bottom" }).click();
    await expect
      .element(page.getByRole("dialog", { name: "bottom drawer" }))
      .not.toBeInTheDocument();
    await trigger.click();
    await expect.element(page.getByLabelText("Drawer seed 1")).toHaveValue("Bora Baloglu");
  });
  test("renders each direction, traps focus, dismisses, and restores focus", async () => {
    render(Fixture);
    for (const position of ["bottom", "top", "left", "right"] as const) {
      const trigger = page.getByRole("button", { name: `Open ${position} drawer` });
      await trigger.click();
      const popup = page.getByRole("dialog", { name: `${position} drawer` });
      await expect.element(popup).toBeVisible();
      if (position === "bottom") {
        const expectedSeeds = [
          "Bora Baloglu",
          "bora@example.com",
          "Margaret Welsh",
          "@maggie.welsh",
          "Margaret Welsh",
          "@maggie.welsh",
          "Margaret Welsh",
          "@maggie.welsh",
        ];
        for (const [index, expected] of expectedSeeds.entries()) {
          await expect
            .element(page.getByLabelText(`Drawer seed ${index + 1}`))
            .toHaveValue(expected);
        }
      }
      expect(document.querySelector(`[data-testid="${position}-drawer"]`)?.className).toContain(
        position === "bottom" ? "translateY" : position === "top" ? "-100%" : "translateX",
      );
      await expect
        .element(popup)
        .toHaveAttribute(
          "data-swipe-direction",
          ({ bottom: "down", left: "left", right: "right", top: "up" } as const)[position],
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

  test("translates menu defaultValue and defaultChecked into interactive initial state", async () => {
    render(Fixture);
    await page.getByRole("button", { name: "Open menu defaults" }).click();
    const shuffle = page.getByRole("checkbox", { name: "Shuffle" });
    const artist = page.getByRole("radio", { name: "Artist" });
    const album = page.getByRole("radio", { name: "Album" });
    await expect.element(shuffle).toBeChecked();
    await expect.element(artist).toBeChecked();
    await expect.element(album).not.toBeChecked();
    (document.querySelector('[role="radio"][data-checked]') as HTMLElement | null)?.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(album).toBeChecked();
    (document.querySelector('[role="checkbox"]') as HTMLElement | null)?.focus();
    await userEvent.keyboard(" ");
    await expect.element(shuffle).not.toBeChecked();
  });

  test("keeps nested drawers stacked and exposes snap-point state", async () => {
    render(Fixture);
    await page.getByRole("button", { name: "Open bottom drawer" }).click();
    await expect.element(page.getByTestId("bottom-state")).toHaveTextContent("true:100px");
    const popup = document.querySelector<HTMLElement>('[data-testid="bottom-drawer"]');
    expect(popup?.style.getPropertyValue("--drawer-snap-point-offset")).not.toBe("");
    const header = popup?.querySelector<HTMLElement>('[data-slot="drawer-header"]');
    if (!header) throw new Error("Bottom drawer header did not mount.");
    pointerSwipe(header, 0, -24, 21);
    await expect.element(page.getByTestId("bottom-state")).toHaveTextContent("true:200px");
    pointerSwipe(header, 0, -24, 22);
    await expect.element(page.getByTestId("bottom-state")).toHaveTextContent("true:1");
    const parentScale = getTransformScale(popup);
    const nestedTrigger = page.getByRole("button", { name: "Open nested drawer" });
    await nestedTrigger.click();
    await expect.element(page.getByRole("dialog", { name: "Nested drawer" })).toBeVisible();
    expect(document.querySelectorAll('[data-slot="drawer-popup"]')).toHaveLength(2);
    expect(popup?.hasAttribute("data-nested-drawer-open")).toBe(true);
    expect(popup?.style.getPropertyValue("--nested-drawers")).toBe("1");
    await expect.poll(() => getTransformScale(popup)).toBeLessThan(parentScale);
    const nestedScale = getTransformScale(popup);
    await userEvent.keyboard("{Escape}");
    await expect
      .element(page.getByRole("dialog", { name: "Nested drawer" }))
      .not.toBeInTheDocument();
    await expect.poll(() => popup?.hasAttribute("data-nested-drawer-open")).toBe(false);
    expect(popup?.style.getPropertyValue("--nested-drawers")).toBe("0");
    await expect.poll(() => getTransformScale(popup)).toBeGreaterThan(nestedScale);
    await expect.element(nestedTrigger).toHaveFocus();
    await userEvent.keyboard("{Escape}");
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

  test("tracks real pointer drags in every drawer direction", async () => {
    render(Fixture);
    const deltas = {
      bottom: [0, 24],
      left: [-24, 0],
      right: [24, 0],
      top: [0, -24],
    } as const;
    let pointerId = 40;
    for (const position of ["bottom", "top", "left", "right"] as const) {
      await page.getByRole("button", { name: `Open ${position} drawer` }).click();
      const popup = document.querySelector<HTMLElement>(`[data-testid="${position}-drawer"]`);
      const dragTarget = popup?.querySelector<HTMLElement>('[data-slot="drawer-header"]');
      if (!popup || !dragTarget) throw new Error(`Missing ${position} drawer drag target.`);
      const [deltaX, deltaY] = deltas[position];
      pointerDrag(dragTarget, deltaX, deltaY, pointerId);
      await expect.poll(() => popup.hasAttribute("data-swiping")).toBe(true);
      const rect = dragTarget.getBoundingClientRect();
      dragTarget.dispatchEvent(
        new PointerEvent("pointercancel", {
          bubbles: true,
          clientX: rect.left + rect.width / 2 + deltaX,
          clientY: rect.top + rect.height / 2 + deltaY,
          isPrimary: true,
          pointerId,
          pointerType: "mouse",
        }),
      );
      await expect.poll(() => popup.hasAttribute("data-swiping")).toBe(false);
      await userEvent.keyboard("{Escape}");
      pointerId += 1;
    }
  });

  test("opens from SwipeArea and dismisses with real touch events", async () => {
    render(Fixture);
    const edge = document.querySelector<HTMLElement>('[data-testid="edge-swipe"]');
    if (!edge) throw new Error("Missing edge swipe area.");
    touchSwipe(edge, { x: 10, y: 120 }, { x: 10, y: 40 });
    const popup = page.getByRole("dialog", { name: "Edge drawer" });
    await expect.element(popup).toBeVisible();
    const popupElement = document.querySelector<HTMLElement>('[data-slot="drawer-popup"]');
    const dragTarget = popupElement?.querySelector<HTMLElement>('[data-slot="drawer-header"]');
    if (!popupElement || !dragTarget) throw new Error("Missing touch-dismiss drawer target.");
    const rect = dragTarget.getBoundingClientRect();
    touchSwipe(
      dragTarget,
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      { x: rect.left + rect.width / 2, y: rect.bottom + 500 },
    );
    await expect.element(popup).not.toBeInTheDocument();
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
