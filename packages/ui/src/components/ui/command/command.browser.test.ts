import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./command.browser-fixture.svelte";
import DefaultFixture from "./command-dialog-default.browser-fixture.svelte";

afterEach(cleanup);

describe("Command browser contract", () => {
  test("supports an uncontrolled default-open dialog", async () => {
    render(DefaultFixture);
    await expect
      .element(page.getByRole("dialog", { name: "Default command dialog" }))
      .toBeVisible();
  });

  test("opens in a dialog, filters grouped commands, navigates with active descendant, selects, and restores focus", async () => {
    render(Fixture);
    const trigger = page.getByRole("button", { name: "Open Command Palette" });
    await trigger.click();
    const input = page.getByRole("combobox", { name: "Search commands" });
    await expect.element(input).toHaveFocus();
    await input.fill("fig");
    await expect.element(page.getByRole("option", { name: "Figma" })).toBeVisible();
    input.element().focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(input.element().getAttribute("aria-activedescendant")).toBeTruthy();
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByTestId("command-value")).toHaveTextContent("Figma");
    await expect.element(trigger).toHaveFocus();
  });

  test("renders the exact empty message", async () => {
    render(Fixture);
    await page.getByRole("button", { name: "Open Command Palette" }).click();
    await page.getByRole("combobox", { name: "Search commands" }).fill("missing");
    await expect.element(page.getByText("No results found.")).toBeVisible();
  });

  test("dismisses with Escape and restores focus to the dialog trigger", async () => {
    render(Fixture);
    const trigger = page.getByRole("button", { name: "Open Command Palette" });
    await trigger.click();
    const input = page.getByRole("combobox", { name: "Search commands" });
    await expect.element(input).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
  });
});
