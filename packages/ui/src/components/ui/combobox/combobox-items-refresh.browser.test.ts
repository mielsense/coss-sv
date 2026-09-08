import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./combobox-items-refresh.browser-fixture.svelte";

afterEach(cleanup);
for (const primitive of [true, false]) {
  test(`${primitive ? "primitive" : "wrapper"} refreshes labels after a typed query closes and reopens`, async () => {
    render(Fixture, { primitive });
    const input = page.getByRole("combobox", { name: "Items input" });
    await input.fill("App");
    (page.getByTestId("close").element() as HTMLButtonElement).click();
    await expect.element(page.getByTestId("close-count")).toHaveTextContent("1");
    await expect.element(input).toHaveValue("Apple");
    (page.getByTestId("reopen").element() as HTMLButtonElement).click();
    (page.getByTestId("refresh-items").element() as HTMLButtonElement).click();
    await expect.element(input).toHaveValue("Renamed apple");
  });
  test(`${primitive ? "primitive" : "wrapper"} preserves an edited query matching the selected label`, async () => {
    render(Fixture, { primitive });
    const input = page.getByRole("combobox", { name: "Items input" });
    await input.fill("App");
    await input.fill("Apple");
    (page.getByTestId("refresh-items").element() as HTMLButtonElement).click();
    await expect.element(input).toHaveValue("Apple");
  });
  test(`${primitive ? "primitive" : "wrapper"} refreshes a selected label when items change`, async () => {
    render(Fixture, { primitive });
    const input = page.getByRole("combobox", { name: "Items input" });
    await expect.element(input).toHaveValue("Apple");
    (page.getByTestId("refresh-items").element() as HTMLButtonElement).click();
    await expect.element(input).toHaveValue("Renamed apple");
  });
  test(`${primitive ? "primitive" : "wrapper"} preserves a typed query when items change`, async () => {
    render(Fixture, { primitive });
    const input = page.getByRole("combobox", { name: "Items input" });
    await input.fill("query");
    (page.getByTestId("refresh-items").element() as HTMLButtonElement).click();
    await expect.element(input).toHaveValue("query");
  });
}
