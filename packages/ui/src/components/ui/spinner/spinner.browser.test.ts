import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import SpinnerFixture from "./spinner.browser-fixture.svelte";
import Spinner from "./spinner.svelte";

afterEach(() => (document.body.innerHTML = ""));
describe("Spinner browser contract", () => {
  test("announces status, forwards callbacks and refs, animates, and stays out of the tab order", async () => {
    render(SpinnerFixture);
    const spinner = page.getByTestId("spinner");
    await expect.element(spinner).toHaveAttribute("role", "status");
    await expect.element(spinner).toHaveAccessibleName("Loading");
    await expect.element(spinner).toHaveClass(/animate-spin/);
    await spinner.click();
    await expect.element(page.getByTestId("spinner-state")).toHaveTextContent("1:svg");
    const button = await page.getByTestId("after-spinner").element();
    button.focus();
    expect(document.activeElement).toBe(button);
    await expect.element(page.getByTestId("custom-spinner")).toHaveAccessibleName("Saving");
    const hugeiconsPropsSpinner = page.getByTestId("hugeicons-props-spinner");
    await expect.element(hugeiconsPropsSpinner).toHaveAttribute("width", "18");
    await expect.element(hugeiconsPropsSpinner).toHaveAttribute("height", "20");
    await expect.element(hugeiconsPropsSpinner).toHaveAttribute("stroke-width", "2.5");
    await expect.element(hugeiconsPropsSpinner).toHaveAttribute("fill", "gold");
    await expect.element(hugeiconsPropsSpinner).toHaveAttribute("stroke", "purple");
    await expect.element(hugeiconsPropsSpinner).toHaveAttribute("stroke-linecap", "square");
    await expect.element(hugeiconsPropsSpinner).toHaveAttribute("stroke-linejoin", "bevel");
    const glyph = (await hugeiconsPropsSpinner.element()).querySelector("path");
    expect(glyph).not.toBeNull();
    expect(glyph).toHaveAttribute("fill", "gold");
    expect(glyph).toHaveAttribute("stroke", "purple");
    expect(glyph).toHaveAttribute("stroke-linecap", "square");
    expect(glyph).toHaveAttribute("stroke-linejoin", "bevel");
    expect(glyph).toHaveAttribute("stroke-width", "2.5");
    expect(
      (await hugeiconsPropsSpinner.element()).querySelector(
        '[data-testid="spinner-consumer-child"]',
      ),
    ).not.toBeNull();
  });
  test("hydrates without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    render(Spinner);
    const hydrationHtml = document.body.firstElementChild?.innerHTML ?? "";
    cleanup();
    const target = document.createElement("div");
    target.innerHTML = hydrationHtml;
    document.body.append(target);
    const component = hydrate(Spinner, { target });
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
