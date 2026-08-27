import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./combobox.browser-fixture.svelte";

afterEach(cleanup);

describe("Combobox browser contract", () => {
  test("renders the selected label in a trigger value", async () => {
    render(Fixture);
    await expect
      .element(page.getByRole("combobox", { name: "Framework trigger" }))
      .toHaveTextContent("Next.js");
  });

  test("filters, selects, synchronizes input text, and submits a hidden value", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Choose fruit", exact: true });
    await input.fill("ora");
    await expect.element(page.getByRole("option", { name: "Orange" })).toBeVisible();
    input.element().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect.element(page.getByTestId("single-value")).toHaveTextContent("Orange");
    await expect.element(page.getByTestId("single-input")).toHaveTextContent("Orange");
    expect(
      new FormData(page.getByTestId("combobox-form").element() as HTMLFormElement).get("fruit"),
    ).toBe("Orange");
  });

  test("supports multiple selection, chip removal, and repeated form values", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Choose fruits" });
    await input.fill("Ban");
    input.element().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect
      .element(page.getByTestId("multiple-value"))
      .toHaveTextContent("Apple,Grape,Banana");
    await page.getByRole("button", { name: "Remove" }).first().click();
    await expect.element(page.getByTestId("multiple-value")).toHaveTextContent("Grape,Banana");
    expect(
      new FormData(page.getByTestId("combobox-form").element() as HTMLFormElement).getAll("fruits"),
    ).toEqual(["Grape", "Banana"]);
  });

  test("preserves exact object identity", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Choose person" });
    await input.fill("Grace");
    input.element().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect.element(page.getByTestId("combobox-identity")).toHaveTextContent("grace:same");
  });
});
