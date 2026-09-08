import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./select-undefined.browser-fixture.svelte";
afterEach(cleanup);
test("reflects a programmatic write through a binding that starts undefined", async () => {
  render(Fixture);
  await page.getByRole("button", { name: "Set second" }).click();
  await expect.element(page.getByTestId("value")).toHaveTextContent("second");
  await expect
    .element(page.getByRole("combobox", { name: "Initially undefined" }))
    .toHaveTextContent("Second");
});

test("reflects an open binding that starts undefined and accepts subsequent interaction", async () => {
  render(Fixture);
  await page.getByRole("button", { name: "Open select" }).click();
  await expect
    .element(page.getByRole("combobox", { name: "Initially undefined" }))
    .toHaveAttribute("aria-expanded", "true");
  await page.getByRole("option", { name: "Second" }).click();
  await expect.element(page.getByTestId("value")).toHaveTextContent("second");
  await page.getByRole("button", { name: "Clear selection" }).click();
  await expect
    .element(page.getByRole("combobox", { name: "Initially undefined" }))
    .toHaveTextContent("Empty");
});
