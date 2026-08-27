import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import ToggleGroupFixture from "./toggle-group.browser-fixture.svelte";
import ToggleGroupRoot from "./toggle-group-root.svelte";
import { toggleGroupClasses } from "./toggle-group-styles.js";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Toggle Group browser contract", () => {
  test("supports single and multiple selection, callbacks, bindings, and refs", async () => {
    render(ToggleGroupFixture);
    const singleBold = page.getByLabelText("Single bold");
    const singleItalic = page.getByLabelText("Single italic");

    await expect.element(singleBold).toHaveAttribute("aria-pressed", "true");
    await expect.element(singleItalic).toHaveAttribute("aria-pressed", "false");
    await singleItalic.click();
    await expect.element(singleBold).toHaveAttribute("aria-pressed", "false");
    await expect.element(singleItalic).toHaveAttribute("aria-pressed", "true");
    await expect.element(page.getByTestId("single-changes")).toHaveTextContent("italic");
    await expect.element(page.getByTestId("group-ref")).toHaveTextContent("DIV");

    const multipleItalic = page.getByLabelText("Multiple italic");
    await multipleItalic.click();
    await expect
      .element(page.getByLabelText("Multiple bold"))
      .toHaveAttribute("aria-pressed", "true");
    await expect.element(multipleItalic).toHaveAttribute("aria-pressed", "true");
    await expect.element(page.getByTestId("multiple-value")).toHaveTextContent("bold,italic");
  });

  test("keeps horizontal, vertical, disabled-skip, Home, End, wrap, and declined-write behavior", async () => {
    render(ToggleGroupFixture);

    const singleBold = page.getByLabelText("Single bold");
    document.querySelector<HTMLElement>('[aria-label="Single bold"]')?.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByLabelText("Single italic")).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect.element(page.getByLabelText("Single underline")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(singleBold).toHaveFocus();
    await userEvent.keyboard("{End}");
    await userEvent.keyboard("{Home}");
    await expect.element(singleBold).toHaveFocus();

    document.querySelector<HTMLElement>('[aria-label="Vertical bold"]')?.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(page.getByLabelText("Vertical underline")).toHaveFocus();
    await expect.element(page.getByLabelText("Vertical italic")).toBeDisabled();

    const declinedItalic = page.getByLabelText("Declined italic");
    await declinedItalic.click();
    await expect
      .element(page.getByLabelText("Declined bold"))
      .toHaveAttribute("aria-pressed", "true");
    await expect.element(declinedItalic).toHaveAttribute("aria-pressed", "false");
    await expect.element(page.getByTestId("declined-writes")).toHaveTextContent("1");
  });

  test("hydrates exact server-equivalent root markup without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<div data-orientation="horizontal" role="group" data-size="default" data-slot="toggle-group" data-variant="default" class="${toggleGroupClasses()}"></div>`;
    document.body.append(target);

    const component = hydrate(ToggleGroupRoot, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector('[role="group"]')?.getAttribute("data-orientation")).toBe(
      "horizontal",
    );
    await unmount(component);
    warning.mockRestore();
  });
});
