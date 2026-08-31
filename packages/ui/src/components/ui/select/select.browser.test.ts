import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./select.browser-fixture.svelte";
import EventsFixture from "./select-events.browser-fixture.svelte";

afterEach(cleanup);

describe("Select browser contract", () => {
  test("supports defaults and cancellable COSS change details", async () => {
    render(EventsFixture);
    await expect
      .element(page.getByRole("combobox", { name: "Default framework" }))
      .toHaveTextContent("Vite");

    await page.getByRole("combobox", { name: "Cancelable framework" }).click();
    await page.getByRole("option", { name: "Vite" }).click();
    await expect.element(page.getByTestId("cancelable-value")).toHaveTextContent("next");
    await expect.element(page.getByTestId("change-reason")).toHaveTextContent("item-press");
    await expect.element(page.getByTestId("change-event")).toHaveTextContent("click");
    await expect.element(page.getByTestId("change-trigger")).toHaveTextContent("DIV");
  });

  test("supports keyboard navigation, typeahead, disabled items, form values, and item alignment", async () => {
    render(Fixture);
    const trigger = page.getByRole("combobox", { exact: true, name: "Framework" });
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
    await expect.element(trigger).toHaveFocus();
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
    const trigger = page.getByRole("combobox", { exact: true, name: "Person" });
    await trigger.click();
    await page.getByRole("option", { name: "Grace Hopper" }).click();
    await expect.element(page.getByTestId("select-person-value")).toHaveTextContent("Grace Hopper");
    await expect.element(page.getByTestId("select-identity")).toHaveTextContent("same");
  });

  test("renders a typed custom object value snippet", async () => {
    render(Fixture);
    await expect.element(page.getByTestId("custom-select-value")).toHaveTextContent("Grace Hopper");
  });

  test("aligns the selected item label with the trigger value in RTL", async () => {
    render(Fixture);
    await page.getByRole("combobox", { name: "RTL framework" }).click();
    const positioner = document.querySelector<HTMLElement>(
      '[data-slot="select-positioner"][data-side="none"]',
    );
    const triggerValue = page
      .getByTestId("rtl-trigger")
      .element()
      .querySelector<HTMLElement>('[data-slot="select-value"]');
    const itemLabel = positioner
      ?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')
      ?.querySelector<HTMLElement>(".col-start-2");
    expect(positioner).toBeTruthy();
    expect(triggerValue).toBeTruthy();
    expect(itemLabel).toBeTruthy();
    expect(getComputedStyle(positioner as HTMLElement).direction).toBe("rtl");
    await expect
      .poll(() =>
        Math.abs(
          (triggerValue?.getBoundingClientRect().right ?? 0) -
            (itemLabel?.getBoundingClientRect().right ?? 0),
        ),
      )
      .toBeLessThanOrEqual(1);
  });

  test("realigns after selecting an item and reopening", async () => {
    render(Fixture);
    const trigger = page.getByRole("combobox", { exact: true, name: "Framework" });

    await trigger.click();
    await page.getByRole("option", { name: "Vite" }).click();
    await expect.element(trigger).toHaveTextContent("Vite");
    await userEvent.keyboard("{ArrowDown}");

    await expect
      .poll(() => {
        const value = trigger.element().querySelector<HTMLElement>('[data-slot="select-value"]');
        const label = document
          .querySelector<HTMLElement>('[role="option"][aria-selected="true"]')
          ?.querySelector<HTMLElement>(".col-start-2");
        if (!value || !label) return Number.POSITIVE_INFINITY;
        return Math.abs(value.getBoundingClientRect().left - label.getBoundingClientRect().left);
      })
      .toBeLessThanOrEqual(1);
  });
});
