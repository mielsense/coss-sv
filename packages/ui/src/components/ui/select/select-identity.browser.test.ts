import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./select-identity.browser-fixture.svelte";

afterEach(cleanup);

test("preserves the selected object's identity when labels are duplicated", async () => {
  render(Fixture);
  await page.getByRole("combobox", { name: "Duplicate labels" }).click();
  await page.getByRole("option", { name: "Alex" }).nth(1).click();
  await expect.element(page.getByTestId("selected-id")).toHaveTextContent("second");
  await expect.element(page.getByTestId("identity")).toHaveTextContent("same");
});
