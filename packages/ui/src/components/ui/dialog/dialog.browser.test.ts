import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./dialog.browser-fixture.svelte";
import AdvancedFixture from "./dialog-advanced.browser-fixture.svelte";
import HydrationFixture from "./dialog.hydration-fixture.svelte";
import { dialogSsrHtml } from "./dialog.hydration-html.js";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Dialog browser contract", () => {
  test("supports detached payloads and controlled close veto", async () => {
    render(AdvancedFixture);
    await page.getByRole("button", { name: "Open detached" }).click();
    await expect.element(page.getByRole("dialog", { name: "Detached dialog" })).toBeVisible();
    await expect.element(page.getByText("Detached payload")).toBeVisible();
    document.querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')?.click();

    await page.getByRole("button", { name: "Open veto dialog" }).click();
    const vetoDialog = page.getByRole("dialog", { name: "Veto dialog" });
    document.querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')?.click();
    await expect.element(vetoDialog).toBeVisible();
    document.querySelector<HTMLButtonElement>('[data-testid="allow-close"]')?.click();
    document.querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')?.click();
    await expect.element(vetoDialog).not.toBeInTheDocument();
  });

  test("honors initial/final focus and modal versus non-modal scroll locking", async () => {
    document.body.style.overflow = "";
    render(AdvancedFixture);
    await page.getByRole("button", { name: "Open focus dialog" }).click();
    await expect.element(page.getByLabelText("Custom initial focus")).toHaveFocus();
    document.querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')?.click();
    await expect.element(page.getByRole("button", { name: "Custom final focus" })).toHaveFocus();

    const originalOverflow = "";
    await page.getByRole("button", { name: "Open modal lock" }).click();
    await expect.poll(() => document.body.style.overflow).not.toBe(originalOverflow);
    document.querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')?.click();
    await expect.poll(() => document.body.style.overflow).toBe(originalOverflow);

    await page.getByRole("button", { name: "Open non-modal" }).click();
    await expect.element(page.getByRole("dialog", { name: "Non-modal dialog" })).toBeVisible();
    expect(document.body.style.overflow).toBe(originalOverflow);
    await page.getByTestId("outside-control").click();
    await expect
      .element(page.getByRole("dialog", { name: "Non-modal dialog" }))
      .not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  test("traps focus, nests overlays, dismisses with Escape, and restores focus", async () => {
    render(Fixture);
    const trigger = page.getByRole("button", { name: "Open dialog" });
    await trigger.click();
    await expect.element(page.getByTestId("dialog-state")).toHaveTextContent("true:false");
    const popup = document.querySelector<HTMLElement>('[data-slot="dialog-popup"]');
    expect(popup).not.toBeNull();
    await expect.element(page.getByRole("dialog", { name: "Profile" })).toBeVisible();
    const expectedSeeds = [
      "Margaret Welsh",
      "@maggie.welsh",
      "Bora Baloglu",
      "bora@example.com",
      "Margaret Welsh",
      "@maggie.welsh",
    ];
    for (const [index, expected] of expectedSeeds.entries()) {
      await expect.element(page.getByLabelText(`Dialog seed ${index + 1}`)).toHaveValue(expected);
    }
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
