import { afterEach, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./select-uncontrolled.browser-fixture.svelte";

afterEach(cleanup);

function formValues(name: string) {
  return new FormData(
    page.getByTestId("uncontrolled-select-form").element() as HTMLFormElement,
  ).getAll(name);
}

test("keeps an uncontrolled object selected with a visible checkmark after reopening", async () => {
  render(Fixture);
  const trigger = page.getByRole("combobox", { name: "Uncontrolled person", exact: true });
  await trigger.click();
  await page.getByRole("option", { name: "Grace Hopper" }).click();
  await expect.element(trigger).toHaveTextContent("Grace Hopper");
  await trigger.click();
  const selected = page.getByRole("option", { name: "Grace Hopper" });
  await expect.element(selected).toHaveAttribute("aria-selected", "true");
  await expect.element(selected.element().querySelector("svg")).toBeVisible();
  expect(selected.element().querySelector("svg path")?.getAttribute("d")).toBeTruthy();
  expect(formValues("person")).toEqual(["grace"]);
});

test("toggles uncontrolled object selections without adding duplicates", async () => {
  render(Fixture);
  const trigger = page.getByRole("combobox", { name: "Uncontrolled people", exact: true });
  await trigger.click();
  const ada = page.getByRole("option", { name: "Ada Lovelace" });
  const grace = page.getByRole("option", { name: "Grace Hopper" });
  await ada.click();
  await expect.element(ada).toHaveAttribute("aria-selected", "true");
  await expect.element(ada.element().querySelector("svg")).toBeVisible();
  await grace.click();
  await expect.element(grace).toHaveAttribute("aria-selected", "true");
  expect(formValues("people")).toEqual(["ada", "grace"]);
  await ada.click();
  await expect.element(ada).toHaveAttribute("aria-selected", "false");
  await expect.poll(() => ada.element().querySelector("svg")).toBeNull();
  expect(formValues("people")).toEqual(["grace"]);
  await userEvent.keyboard("{Escape}");
  await trigger.click();
  await expect.element(grace).toHaveAttribute("aria-selected", "true");
  await expect.element(grace.element().querySelector("svg")).toBeVisible();
});

test("accepts external object writes and clearing through an initially undefined binding", async () => {
  render(Fixture);
  const trigger = page.getByRole("combobox", { name: "Late bound person", exact: true });
  await trigger.click();
  await page.getByRole("option", { name: "Grace Hopper" }).click();
  await expect.element(trigger).toHaveTextContent("Grace Hopper");
  await page.getByRole("button", { name: "Set bound Ada" }).click();
  await expect.element(trigger).toHaveTextContent("Ada Lovelace");
  await trigger.click();
  const ada = page.getByRole("option", { name: "Ada Lovelace" });
  await expect.element(ada).toHaveAttribute("aria-selected", "true");
  await expect.element(ada.element().querySelector("svg")).toBeVisible();
  await userEvent.keyboard("{Escape}");
  await page.getByRole("button", { name: "Clear bound person" }).click();
  await expect.element(trigger).toHaveTextContent("Choose");
});
