import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import ToolbarFixture from "./toolbar.browser-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
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
});
