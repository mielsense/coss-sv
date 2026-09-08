import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./command-refs.browser-fixture.svelte";

test("forwards command host refs for focus and clears them when removed", async () => {
  render(Fixture);
  await expect.element(page.getByTestId("ref-tags")).toHaveTextContent("INPUT,DIV,DIV,DIV,KBD");
  await page.getByRole("button", { name: "Focus search" }).click();
  await expect.element(page.getByRole("combobox", { name: "Search commands" })).toHaveFocus();
  await page.getByRole("button", { name: "Remove command" }).click();
  await expect.element(page.getByTestId("ref-tags")).toHaveTextContent("null,null,null,null,null");
});
