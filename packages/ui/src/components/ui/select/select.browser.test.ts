import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./select.browser-fixture.svelte";

afterEach(cleanup);

describe("Select browser contract", () => {
  test("supports keyboard navigation, typeahead, disabled items, form values, and item alignment", async () => {
    render(Fixture);
    const trigger = page.getByRole("combobox", { name: "Framework" });
    await expect.element(trigger).toHaveTextContent("Next.js");
    trigger.element().focus();
    await userEvent.keyboard("v");
    await expect.element(page.getByTestId("framework-value")).toHaveTextContent("vite");
    await userEvent.keyboard("{Enter}");
    const positioner = document.querySelector<HTMLElement>('[data-slot="select-positioner"]');
    expect(positioner?.getAttribute("data-side")).toBe("none");
    await userEvent.keyboard("{ArrowDown}");
    const highlighted = document.querySelector<HTMLElement>('[role="option"][data-highlighted]');
    expect(highlighted?.getAttribute("aria-disabled")).toBe("true");
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByTestId("framework-value")).toHaveTextContent("vite");
    await userEvent.keyboard("{Escape}");
    expect(
      new FormData(page.getByTestId("select-form").element() as HTMLFormElement).get("framework"),
    ).toBe("vite");
  });

  test("supports multiple selection and repeated hidden form values", async () => {
    render(Fixture);
    page.getByRole("combobox", { name: "Languages" }).element().focus();
    await userEvent.keyboard("{Enter}");
    await page.getByRole("option", { name: "TypeScript" }).click();
    await expect
      .element(page.getByTestId("languages-value"))
      .toHaveTextContent("JavaScript,TypeScript");
    expect(
      new FormData(page.getByTestId("select-form").element() as HTMLFormElement).getAll(
        "languages",
      ),
    ).toEqual(["JavaScript", "TypeScript"]);
  });

  test("preserves exact object identity", async () => {
    render(Fixture);
    const trigger = page.getByRole("combobox", { name: "Person" });
    await trigger.click();
    await page.getByRole("option", { name: "Grace Hopper" }).click();
    await expect.element(page.getByTestId("select-identity")).toHaveTextContent("same");
  });
});
