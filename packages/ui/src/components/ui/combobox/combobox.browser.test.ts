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

  test("recognizes and toggles raw object values in multiple mode", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Choose multiple people" });
    await input.click();
    const ada = page.getByRole("option", { name: "Ada Lovelace" });

    await expect.element(ada).toHaveAttribute("aria-selected", "true");
    await ada.click();

    await expect
      .element(page.getByTestId("multiple-people-value"))
      .toHaveTextContent("Grace Hopper");
    await expect.element(ada).toHaveAttribute("aria-selected", "false");
  });

  test("honors an explicit comparer for reactive objects with duplicate labels", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Choose duplicate-name people" });
    await input.click();
    const options = page.getByRole("option", { name: "Same name" });

    await expect.element(options.nth(0)).toHaveAttribute("aria-selected", "false");
    await expect.element(options.nth(1)).toHaveAttribute("aria-selected", "true");
    await options.nth(0).click();

    await expect
      .element(page.getByTestId("duplicate-name-value"))
      .toHaveTextContent("second,first");
    await expect.element(options.nth(0)).toHaveAttribute("aria-selected", "true");
    await options.nth(1).click();

    await expect.element(page.getByTestId("duplicate-name-value")).toHaveTextContent("first");
    await expect.element(options.nth(1)).toHaveAttribute("aria-selected", "false");
  });

  test("normalizes a controlled null value in multiple mode", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Choose from a nullable value" });
    await input.click();
    await page.getByRole("option", { name: "Ada Lovelace" }).click();

    await expect
      .element(page.getByTestId("nullable-people-value"))
      .toHaveTextContent("Ada Lovelace");
  });

  test("preserves exact object identity", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Choose person" });
    await input.fill("Grace");
    input.element().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect.element(page.getByTestId("combobox-identity")).toHaveTextContent("grace:same");
  });

  test("renders a typed custom object value snippet", async () => {
    render(Fixture);
    await expect
      .element(page.getByTestId("custom-combobox-value"))
      .toHaveTextContent("Grace Hopper");
  });

  test("clears the composed input without inventing a public clear-button child", async () => {
    render(Fixture);
    const input = page.getByRole("combobox", { name: "Choose fruit", exact: true });
    await input.fill("Orange");
    input.element().focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await page.getByRole("button", { name: "Clear" }).first().click();
    await expect.element(input).toHaveValue("");
    await expect.element(page.getByTestId("single-value")).toHaveTextContent("");
    expect(
      new FormData(page.getByTestId("combobox-form").element() as HTMLFormElement).get("fruit"),
    ).toBe("");
  });
});
