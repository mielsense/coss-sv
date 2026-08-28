import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./autocomplete.browser-fixture.svelte";

afterEach(cleanup);

describe("Autocomplete browser contract", () => {
  test("filters, exposes active descendant state, selects exact values, clears, and submits text", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Fruit search" });
    await input.fill("ap");
    await expect.element(page.getByRole("option", { name: "Apple" })).toBeVisible();
    expect(
      Array.from(document.querySelectorAll('[role="option"]'), (option) => option.textContent),
    ).toEqual(["Apple", "Grape"]);
    input.element().focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(input.element().getAttribute("aria-activedescendant")).toBeTruthy();
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByTestId("autocomplete-value")).toHaveTextContent("Apple");
    expect(
      new FormData(page.getByTestId("autocomplete-form").element() as HTMLFormElement).get("fruit"),
    ).toBe("Apple");
    await page.getByRole("button", { name: /clear/i }).click();
    await expect.element(page.getByTestId("autocomplete-value")).toHaveTextContent("");
  });

  test("supports inline completion and empty results", async () => {
    render(Fixture);
    const inline = page.getByRole("combobox", { name: "Inline fruit" });
    await inline.fill("Ba");
    inline.element().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect.element(page.getByTestId("inline-value")).toHaveTextContent("Banana");

    const input = page.getByRole("combobox", { name: "Fruit search" });
    await input.fill("zzz");
    await expect.element(page.getByText("No fruit found.")).toBeVisible();
  });

  test("replaces async results after a loading status", async () => {
    render(Fixture);
    const asyncInput = page.getByRole("combobox", { name: "Async search" });
    await asyncInput.fill("query");
    await expect.element(page.getByText("Searching...")).toBeVisible();
    await expect.element(page.getByRole("option", { name: "Async result" })).toBeVisible();
    await expect.element(page.getByText("Searching...")).not.toBeInTheDocument();
  });

  test("stringifies object items to the exact selected text", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Person search" });
    await input.fill("Grace");
    input.element().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect
      .element(page.getByTestId("autocomplete-object-value"))
      .toHaveTextContent("Grace Hopper");
    await expect.element(input).toHaveValue("Grace Hopper");
  });
});
