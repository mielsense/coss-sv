import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import FieldsetFixture from "./fieldset.browser-fixture.svelte";
import FieldsetRoot from "./fieldset-root.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Fieldset browser contract", () => {
  test("links generated legends and propagates disabled state through nested contexts", async () => {
    render(FieldsetFixture);

    const outer = document.querySelector<HTMLFieldSetElement>('[data-testid="outer-fieldset"]');
    const legend = document.querySelector<HTMLElement>('[data-testid="outer-legend"]');
    const inner = document.querySelector<HTMLFieldSetElement>('[data-testid="inner-fieldset"]');
    const innerLegend = document.querySelector<HTMLElement>('[data-testid="inner-legend"]');

    expect(legend?.tagName).toBe("DIV");
    expect(outer?.getAttribute("aria-labelledby")).toBe(legend?.id);
    expect(inner?.getAttribute("aria-labelledby")).toBe(innerLegend?.id);
    await expect.element(page.getByTestId("inner-fieldset")).toHaveAttribute("data-disabled");
    await expect.element(page.getByTestId("inner-legend")).toHaveAttribute("data-disabled");
    await expect.element(page.getByTestId("inner-legend-state")).toHaveTextContent("true");
    await expect.element(page.getByTestId("disabled-control")).toBeDisabled();
    await expect.element(page.getByTestId("native-disabled-control")).toBeDisabled();
    await expect.element(page.getByTestId("inner-fieldset")).toHaveAttribute("disabled");

    await page.getByTestId("toggle-outer-disabled").click();
    await expect.element(page.getByTestId("inner-fieldset")).not.toHaveAttribute("data-disabled");
    await expect.element(page.getByTestId("inner-legend")).not.toHaveAttribute("data-disabled");
    await expect.element(page.getByTestId("inner-legend-state")).toHaveTextContent("false");
    await expect.element(page.getByTestId("native-disabled-control")).not.toBeDisabled();
  });

  test("hydrates a server-equivalent fieldset without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = '<fieldset data-slot="fieldset" data-testid="hydrated-fieldset"></fieldset>';
    document.body.append(target);

    const component = hydrate(FieldsetRoot, {
      props: { "data-testid": "hydrated-fieldset" },
      target,
    });

    expect(warning).not.toHaveBeenCalled();
    await expect
      .element(page.getByTestId("hydrated-fieldset"))
      .toHaveAttribute("data-slot", "fieldset");
    await unmount(component);
    warning.mockRestore();
  });
});
