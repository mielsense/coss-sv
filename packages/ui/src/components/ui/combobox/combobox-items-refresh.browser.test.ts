import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./combobox-items-refresh.browser-fixture.svelte";

afterEach(cleanup);
async function compose(element: HTMLInputElement) {
  element.focus();
  element.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true }));
  element.value = "りんご";
  element.dispatchEvent(
    new InputEvent("input", {
      bubbles: true,
      inputType: "insertCompositionText",
      data: "りんご",
      isComposing: true,
    }),
  );
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  element.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true, data: "りんご" }));
}

test("wrapper cancels composition and forwards its native callback", async () => {
  render(Fixture, { cancelComposition: true });
  const input = page.getByRole("combobox", { name: "Items input" });
  await compose(input.element() as HTMLInputElement);
  await expect.element(input).toHaveValue("Apple");
  await expect.element(page.getByTestId("composition-count")).toHaveTextContent("1");
  (page.getByTestId("refresh-items").element() as HTMLButtonElement).click();
  await expect.element(input).toHaveValue("Renamed apple");
});
for (const primitive of [true, false]) {
  test(`${primitive ? "primitive" : "wrapper"} preserves a committed composition when items change`, async () => {
    render(Fixture, { primitive });
    const input = page.getByRole("combobox", { name: "Items input" });
    const element = input.element() as HTMLInputElement;
    await compose(element);
    await expect.element(input).toHaveValue("りんご");
    (page.getByTestId("refresh-items").element() as HTMLButtonElement).click();
    await expect.element(input).toHaveValue("りんご");
  });
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
