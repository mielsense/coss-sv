import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./alert-dialog.browser-fixture.svelte";
import HydrationFixture from "./alert-dialog.hydration-fixture.svelte";
import { alertDialogSsrHtml } from "./alert-dialog.hydration-html.js";
afterEach(() => {
  document.body.innerHTML = "";
});
describe("Alert Dialog browser contract", () => {
  test("uses alertdialog semantics, rejects implicit dismissal, and restores focus", async () => {
    render(Fixture);
    const trigger = page.getByRole("button", { name: "Delete project" });
    await trigger.click();
    await expect.element(page.getByTestId("alert-state")).toHaveTextContent("true");
    const alert = page.getByRole("alertdialog", { name: "Delete project?" });
    await expect.element(alert).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect.element(alert).not.toBeInTheDocument();
    await expect.element(page.getByTestId("alert-state")).toHaveTextContent("false");
    expect(document.activeElement).toBe(
      document.querySelector('[data-slot="alert-dialog-trigger"]'),
    );
    await new Promise((resolve) => setTimeout(resolve, 250));
    await trigger.click();
    await expect.element(alert).toBeVisible();
    document.querySelector<HTMLElement>('[data-slot="alert-dialog-backdrop"]')?.click();
    await expect.element(alert).toBeVisible();
    document.querySelector<HTMLButtonElement>('[data-slot="alert-dialog-close"]')?.click();
    await expect.element(alert).not.toBeInTheDocument();
    await expect.element(page.getByTestId("alert-state")).toHaveTextContent("false");
    expect(document.activeElement).toBe(
      document.querySelector('[data-slot="alert-dialog-trigger"]'),
    );
  });
  test("hydrates genuine SSR output and opens its portal without mismatches", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = alertDialogSsrHtml;
    document.body.append(target);
    const component = hydrate(HydrationFixture, { target });
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    await page.getByRole("button", { name: "Open hydrated alert" }).click();
    await expect.element(page.getByRole("alertdialog", { name: "Hydrated alert" })).toBeVisible();
    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });
});
