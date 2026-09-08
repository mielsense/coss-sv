import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./autocomplete-list-item.browser-fixture.svelte";

test("list item snippets render filtered objects and indexes while forwarding host props and refs", async () => {
  render(Fixture);
  await expect.element(page.getByTestId("list-ref")).toHaveTextContent("Fruit results");
  const input = page.getByRole("combobox", { name: "Search fruit" });
  await input.fill("ora");
  await expect.element(page.getByRole("option", { name: "Orange (0)", exact: true })).toBeVisible();
  await expect
    .element(page.getByRole("option", { name: "Apple (0)", exact: true }))
    .not.toBeInTheDocument();
});

test("static list children retain the primitive empty-state payload", async () => {
  render(Fixture, { staticContent: true });
  await expect.element(page.getByTestId("empty-state")).toHaveTextContent("false");
  await page.getByRole("combobox", { name: "Search fruit" }).fill("unmatched");
  await expect.element(page.getByTestId("empty-state")).toHaveTextContent("true");
});
