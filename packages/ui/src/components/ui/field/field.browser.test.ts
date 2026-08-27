import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import FieldFixture from "./field.browser-fixture.svelte";
import FieldRoot from "./field-root.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Field browser contract", () => {
  test("generates stable relationships and propagates invalid state through nested contexts", async () => {
    render(FieldFixture);

    const control = page.getByTestId("generated-control");
    const label = page.getByTestId("generated-label");
    const description = page.getByTestId("generated-description");
    const error = page.getByTestId("generated-error");
    const controlElement = document.querySelector<HTMLInputElement>(
      '[data-testid="generated-control"]',
    );
    const labelElement = document.querySelector<HTMLLabelElement>(
      '[data-testid="generated-label"]',
    );
    const descriptionElement = document.querySelector<HTMLElement>(
      '[data-testid="generated-description"]',
    );
    const errorElement = document.querySelector<HTMLElement>('[data-testid="generated-error"]');

    expect(controlElement?.id).toBeTruthy();
    expect(labelElement?.htmlFor).toBe(controlElement?.id);
    expect(controlElement?.getAttribute("aria-describedby")?.split(" ")).toEqual(
      expect.arrayContaining([descriptionElement?.id, errorElement?.id]),
    );
    await expect.element(control).toHaveAttribute("aria-invalid", "true");
    await expect.element(label).toHaveAttribute("data-invalid");
    await expect.element(description).toHaveAttribute("data-invalid");
    await expect.element(error).toBeVisible();

    await label.click();
    await expect.element(control).toHaveFocus();

    const nestedControl = document.querySelector<HTMLInputElement>(
      '[data-testid="nested-control"]',
    );
    const nestedLabel = document.querySelector<HTMLLabelElement>('[data-testid="nested-label"]');
    expect(nestedLabel?.htmlFor).toBe(nestedControl?.id);
    expect(nestedControl?.id).not.toBe(controlElement?.id);
  });

  test("hydrates the COSS root without changing server markup", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<div data-slot="field" class="flex flex-col items-start gap-2" data-testid="hydrated-field"></div>';
    document.body.append(target);

    const component = hydrate(FieldRoot, { props: { "data-testid": "hydrated-field" }, target });

    expect(warning).not.toHaveBeenCalled();
    await expect.element(page.getByTestId("hydrated-field")).toHaveAttribute("data-slot", "field");
    await unmount(component);
    warning.mockRestore();
  });

  test("hydrates the single-root fieldset mode and restores native disabled semantics", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<fieldset data-disabled="" disabled="" data-slot="field" class="flex flex-col items-start gap-2" data-testid="hydrated-composed-field"></fieldset>';
    document.body.append(target);

    const component = hydrate(FieldRoot, {
      props: { as: "fieldset", "data-testid": "hydrated-composed-field", disabled: true },
      target,
    });

    expect(warning).not.toHaveBeenCalled();
    await expect.element(page.getByTestId("hydrated-composed-field")).toHaveAttribute("disabled");
    expect(document.querySelector('[data-testid="hydrated-composed-field"]')?.tagName).toBe(
      "FIELDSET",
    );
    await unmount(component);
    warning.mockRestore();
  });

  test("keeps Field and Fieldset behavior on one disabled DOM root", async () => {
    render(FieldFixture);

    const root = document.querySelector<HTMLFieldSetElement>('[data-testid="composed-fieldset"]');
    const legend = document.querySelector<HTMLElement>('[data-testid="composed-legend"]');
    expect(root?.tagName).toBe("FIELDSET");
    expect(root?.querySelectorAll("fieldset")).toHaveLength(0);
    expect(root?.getAttribute("aria-labelledby")).toBe(legend?.id);
    await expect.element(page.getByTestId("composed-fieldset")).toHaveAttribute("disabled");
    await expect.element(page.getByTestId("composed-control")).toBeDisabled();
    await expect.element(page.getByTestId("composed-legend")).toHaveAttribute("data-disabled");

    await page.getByTestId("toggle-composed-disabled").click();
    await expect.element(page.getByTestId("composed-fieldset")).not.toHaveAttribute("disabled");
    await expect.element(page.getByTestId("composed-control")).not.toBeDisabled();
    await expect.element(page.getByTestId("composed-legend")).not.toHaveAttribute("data-disabled");
  });
});
