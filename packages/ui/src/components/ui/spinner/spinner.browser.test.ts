import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
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
    await expect.element(hugeiconsPropsSpinner).toHaveAttribute("stroke-width", "2");
    expect((await hugeiconsPropsSpinner.element()).querySelectorAll("path").length).toBeGreaterThan(
      0,
    );
  });
  test("hydrates without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="animate-spin" aria-label="Loading" role="status"></svg>';
    document.body.append(target);
    const component = hydrate(Spinner, { target });
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
