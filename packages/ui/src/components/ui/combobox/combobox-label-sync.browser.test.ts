import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./combobox-label-sync.browser-fixture.svelte";

afterEach(cleanup);
test("renders initial and default selected labels", async () => {
  render(Fixture);
  await expect
    .element(page.getByRole("combobox", { name: "Search", exact: true }))
    .toHaveValue("Apple");
  await expect
    .element(page.getByRole("combobox", { name: "Default selection" }))
    .toHaveValue("Orange");
});
test("updates and clears an external selection after editing", async () => {
  render(Fixture, { initial: null });
  const input = page.getByRole("combobox", { name: "Search", exact: true });
  await input.fill("ora");
  (page.getByTestId("external-select").element() as HTMLButtonElement).click();
  await expect.element(input).toHaveValue("Banana");
  await expect.element(page.getByTestId("input-state")).toHaveTextContent("Banana");
  (page.getByTestId("external-clear").element() as HTMLButtonElement).click();
  await expect.element(input).toHaveValue("");
});
test("preserves independently controlled input text", async () => {
  render(Fixture, { initialInput: "custom" });
  (page.getByTestId("external-select").element() as HTMLButtonElement).click();
  await expect
    .element(page.getByRole("combobox", { name: "Search", exact: true }))
    .toHaveValue("custom");
});
test("preserves input text controlled after initialization", async () => {
  render(Fixture);
  await page.getByRole("button", { name: "Set independent input" }).click();
  (page.getByTestId("external-select").element() as HTMLButtonElement).click();
  await expect
    .element(page.getByRole("combobox", { name: "Search", exact: true }))
    .toHaveValue("custom");
});
test("keeps multiple-selection search separate from selected values", async () => {
  render(Fixture, { mode: "multiple" });
  const input = page.getByRole("combobox", { name: "Multiple search", exact: true });
  await input.fill("query");
  (page.getByTestId("external-select").element() as HTMLButtonElement).click();
  await expect.element(input).toHaveValue("query");
  await expect
    .element(page.getByRole("combobox", { name: "Nested multiple search" }))
    .toHaveValue("");
});
test("keeps popup search separate from selected values", async () => {
  render(Fixture, { mode: "popup" });
  await page.getByRole("combobox", { name: "Open search" }).click();
  const input = page.getByRole("combobox", { name: "Popup search" });
  await expect.element(input).toHaveValue("");
  await input.fill("query");
  (page.getByTestId("external-select").element() as HTMLButtonElement).click();
  await expect.element(input).toHaveValue("query");
});
test("restores the accepted input after a canceled typed change", async () => {
  render(Fixture, { initialInput: "accepted", cancelInput: true });
  const input = page.getByRole("combobox", { name: "Search", exact: true });
  await input.fill("rejected");
  await expect.element(input).toHaveValue("accepted");
});

test("canceled clearing retains the selected value and input text", async () => {
  render(Fixture, { initialInput: "Apple", cancelInput: true });
  const input = page.getByRole("combobox", { name: "Search", exact: true });
  await input.fill("");
  await expect.element(input).toHaveValue("Apple");
  await expect.element(page.getByTestId("selection-state")).toHaveTextContent("Apple");
  await page.getByRole("button", { name: "Allow input" }).click();
  await input.fill("Ban");
  await page.getByRole("option", { name: "Banana", exact: true }).click();
  await expect.element(page.getByTestId("selection-state")).toHaveTextContent("Banana");
  await expect.element(input).toHaveValue("Banana");
});

test("honors explicit default input text until the selection changes", async () => {
  render(Fixture, { defaultInput: "starting query" });
  const input = page.getByRole("combobox", { name: "Search", exact: true });
  await expect.element(input).toHaveValue("starting query");
  (page.getByTestId("external-select").element() as HTMLButtonElement).click();
  await expect.element(input).toHaveValue("Banana");
});
test("labels object selections and does not emit an initial input change", async () => {
  render(Fixture);
  await expect
    .element(page.getByRole("combobox", { name: "Object label" }))
    .toHaveValue("Object label");
  await expect
    .element(page.getByRole("combobox", { name: "Custom label" }))
    .toHaveValue("Custom label");
  await expect.element(page.getByTestId("input-events")).toHaveTextContent(/^$/);
  (page.getByTestId("external-select").element() as HTMLButtonElement).click();
  await expect.element(page.getByTestId("input-events")).toHaveTextContent(/^none$/);
});
test("keeps inline search independent from external selection", async () => {
  render(Fixture, { mode: "inline" });
  const input = page.getByRole("combobox", { name: "Search", exact: true });
  await expect.element(input).toHaveValue("");
  await input.fill("query");
  (page.getByTestId("external-select").element() as HTMLButtonElement).click();
  await expect.element(input).toHaveValue("query");
});
