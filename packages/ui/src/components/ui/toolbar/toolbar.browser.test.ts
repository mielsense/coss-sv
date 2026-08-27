import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import ToolbarFixture from "./toolbar.browser-fixture.svelte";

afterEach(() => {
  cleanup();
});

describe("Toolbar browser contract", () => {
  test("uses orientation and direction-aware roving focus and includes disabled items", async () => {
    render(ToolbarFixture);
    const one = document.querySelector<HTMLElement>('[data-testid="one"]');
    one?.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(document.querySelector('[data-testid="disabled"]'));
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(document.querySelector('[data-testid="two"]'));

    document.querySelector<HTMLElement>('[data-testid="v-one"]')?.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(document.querySelector('[data-testid="v-two"]'));

    document.querySelector<HTMLElement>('[data-testid="rtl-one"]')?.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(document.querySelector('[data-testid="rtl-two"]'));
    await expect.element(page.getByRole("toolbar", { name: "Horizontal toolbar" })).toBeVisible();
  });

  test("keeps text selection arrows inside an input until a boundary", async () => {
    render(ToolbarFixture);
    const input = document.querySelector<HTMLInputElement>('[data-testid="input"]');
    input?.focus();
    input?.setSelectionRange(2, 2);
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(input);
  });

  test("integrates toggle, tooltip, and Select into one non-looping roving sequence", async () => {
    render(ToolbarFixture);
    const toggle = page.getByTestId("toggle");
    toggle.element().focus();
    await expect.element(page.getByRole("tooltip", { name: "Toggle bold" })).toBeVisible();
    await toggle.click();
    await expect.element(toggle).toHaveAttribute("aria-pressed", "true");
    await expect.element(page.getByTestId("alignment")).toHaveTextContent("bold");

    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(page.getByTestId("select-trigger").element());
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByTestId("font-helvetica")).toBeVisible();
    await new Promise((resolve) => setTimeout(resolve, 450));
    await page.getByTestId("font-arial").click();
    await expect.element(page.getByTestId("font")).toHaveTextContent("arial");

    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(page.getByTestId("composition-save").element());
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(page.getByTestId("composition-save").element());
  });
});
