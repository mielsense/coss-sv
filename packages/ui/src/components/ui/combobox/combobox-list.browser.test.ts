import { afterEach, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./combobox-list.browser-fixture.svelte";

afterEach(cleanup);

for (const method of ["pointer", "keyboard"] as const) {
  test(`filters List item snippets and keeps ${method} selection marked on reopen`, async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "List item fruit", exact: true });
    await input.click();
    await expect
      .element(page.getByRole("option", { name: "Orange" }))
      .toHaveAttribute("data-index", "2");
    await input.fill("ban");
    const banana = page.getByRole("option", { name: "Banana" });
    await expect.element(banana).toHaveAttribute("data-index", "0");
    await expect.element(page.getByRole("option", { name: "Apple" })).not.toBeInTheDocument();
    if (method === "pointer") await banana.click();
    else await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect.element(input).toHaveValue("Banana");
    await input.click();
    await expect.element(banana).toHaveAttribute("aria-selected", "true");
    await expect.element(banana.element().querySelector("svg")).toBeVisible();
    await expect.element(banana).toHaveAttribute("data-highlighted");
    await expect.element(input).toHaveAttribute("aria-activedescendant", banana.element().id);
    await expect.element(page.getByRole("option", { name: "Orange" })).toBeVisible();
    await input.fill("unmatched");
    await expect.element(page.getByText("No fruit found.")).toBeVisible();
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(0);
  });
}

test("renders grouped List item snippets with a nested Collection and filtered indices", async () => {
  render(Fixture);
  const input = page.getByRole("combobox", { name: "Grouped list fruit", exact: true });
  await input.click();
  await expect
    .element(page.getByRole("group", { name: "Other fruit" }))
    .toHaveAttribute("data-group-index", "1");
  await expect
    .element(page.getByRole("option", { name: "Lemon" }))
    .toHaveAttribute("data-index", "1");
  await input.fill("lem");
  await expect
    .element(page.getByRole("group", { name: "Citrus" }))
    .toHaveAttribute("data-group-index", "0");
  await expect.element(page.getByRole("group", { name: "Other fruit" })).not.toBeInTheDocument();
  const lemon = page.getByRole("option", { name: "Lemon" });
  await expect.element(lemon).toHaveAttribute("data-index", "0");
  await lemon.click();
  await expect.element(input).toHaveValue("Lemon");
  await input.click();
  await expect.element(lemon).toHaveAttribute("aria-selected", "true");
  await expect.element(lemon.element().querySelector("svg")).toBeVisible();
});

test("preserves static List children and the existing list-state snippet parameter", async () => {
  render(Fixture);
  const input = page.getByRole("combobox", { name: "Static list fruit", exact: true });
  await input.click();
  await expect
    .element(page.getByRole("option", { name: "Apple" }))
    .toHaveAttribute("data-list-empty", "false");
  await page.getByRole("option", { name: "Banana" }).click();
  await expect.element(input).toHaveValue("Banana");
  await input.click();
  await expect
    .element(page.getByRole("option", { name: "Banana" }))
    .toHaveAttribute("aria-selected", "true");
});
