import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./undefined-bindings.browser-fixture.svelte";
afterEach(cleanup);
for (const [button, role, name, attribute] of [
  ["Set checkbox", "checkbox", "Late checkbox", "aria-checked"],
  ["Set switch", "switch", "Late switch", "aria-checked"],
  ["Set toggle", "button", "Late toggle", "aria-pressed"],
  ["Set radio", "radio", "Second radio", "aria-checked"],
  ["Set toggle group", "button", "Second toggle", "aria-pressed"],
  ["Set tab", "tab", "Second tab", "aria-selected"],
  ["Set checkbox group", "checkbox", "Second group checkbox", "aria-checked"],
] as const) {
  test(`${name} accepts programmatic state after an initially undefined binding`, async () => {
    render(Fixture);
    await page.getByRole("button", { name: button, exact: true }).click();
    await expect
      .element(page.getByRole(role, { name, exact: true }))
      .toHaveAttribute(attribute, "true");
  });
}
for (const part of ["value", "input"] as const) {
  test(`Combobox ${part} accepts programmatic state after an initially undefined binding`, async () => {
    render(Fixture);
    await page.getByRole("button", { name: `Set combobox ${part}`, exact: true }).click();
    if (part === "value") {
      await expect.element(page.getByTestId("combobox-selection")).toHaveTextContent("Second");
    } else {
      await expect
        .element(page.getByRole("combobox", { name: "Late combobox input" }))
        .toHaveValue("Second");
    }
  });
}
test("Combobox open accepts programmatic state after an initially undefined binding", async () => {
  render(Fixture);
  await page.getByRole("button", { name: "Set combobox open", exact: true }).click();
  await expect
    .element(page.getByRole("combobox", { name: "Late combobox open" }))
    .toHaveAttribute("aria-expanded", "true");
});

test("primitive selection synchronizes an uncontrolled input label", async () => {
  render(Fixture);
  await page.getByRole("button", { name: "Set primitive value", exact: true }).click();
  await expect
    .element(page.getByRole("combobox", { name: "Primitive selection input" }))
    .toHaveValue("Second");
});
