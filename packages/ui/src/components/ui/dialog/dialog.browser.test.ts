import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./dialog.browser-fixture.svelte";
import HydrationFixture from "./dialog.hydration-fixture.svelte";
import { dialogSsrHtml } from "./dialog.hydration-html.js";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Dialog browser contract", () => {
  test("traps focus, nests overlays, dismisses with Escape, and restores focus", async () => {
    render(Fixture);
    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.click();
    await expect.element(page.getByTestId("dialog-state")).toHaveTextContent("true:false");
    const popup = document.querySelector<HTMLElement>('[data-slot="dialog-popup"]');
    expect(popup).not.toBeNull();
    await expect.element(page.getByRole("dialog", { name: "Profile" })).toBeVisible();
    expect(popup?.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard("{Tab}{Tab}{Tab}{Tab}{Tab}");
    expect(popup?.contains(document.activeElement)).toBe(true);
    await page.getByRole("button", { name: "Open nested" }).click();
    await expect.element(page.getByTestId("dialog-state")).toHaveTextContent("true:true");
    await expect.element(page.getByRole("dialog", { name: "Nested dialog" })).toBeVisible();
    expect(document.querySelectorAll('[data-slot="dialog-popup"]')).toHaveLength(2);
    await userEvent.keyboard("{Escape}");
    await expect
      .element(page.getByRole("dialog", { name: "Nested dialog" }))
      .not.toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect.element(page.getByRole("dialog", { name: "Profile" })).not.toBeInTheDocument();
    await expect.element(page.getByTestId("dialog-state")).toHaveTextContent("false:false");
    expect(document.activeElement).toBe(document.querySelector('[data-slot="dialog-trigger"]'));
  });

  test("dismisses from the backdrop without hydration or console warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    render(Fixture);
    await page.getByRole("button", { name: "Open dialog" }).click();
    const backdrop = document.querySelector<HTMLElement>('[data-slot="dialog-backdrop"]');
    backdrop?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    backdrop?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));
    backdrop?.click();
    await expect.element(page.getByRole("dialog", { name: "Profile" })).not.toBeInTheDocument();
    expect(warning).not.toHaveBeenCalled();
    warning.mockRestore();
  });

  test("hydrates genuine SSR output and opens its portal without mismatches", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = dialogSsrHtml;
    document.body.append(target);
    const component = hydrate(HydrationFixture, { target });
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    await page.getByRole("button", { name: "Open hydrated dialog" }).click();
    await expect.element(page.getByRole("dialog", { name: "Hydrated dialog" })).toBeVisible();
    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });
});
