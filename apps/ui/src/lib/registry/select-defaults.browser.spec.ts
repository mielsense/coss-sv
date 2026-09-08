import { mount, unmount } from "svelte";
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import Timezone from "../../../registry/default/particles/p-select-13.svelte";
import Country from "../../../registry/default/particles/p-select-17.svelte";

for (const { component, name, initial, next } of [
  { component: Timezone, name: "Select timezone", initial: "Europe/London", next: "Europe/Paris" },
  { component: Country, name: "Select country", initial: "Canada", next: "France" },
]) {
  test(`${name} preserves its object selection after reopening`, async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const instance = mount(component, { target });
    try {
      const trigger = page.getByRole("combobox", { name });
      await expect.element(trigger).toHaveTextContent(initial);
      await trigger.click();
      await page.getByRole("option", { name: new RegExp(next) }).click();
      await expect.element(trigger).toHaveTextContent(next);
      await trigger.click();
      const selected = page.getByRole("option", { name: new RegExp(next) });
      await expect.element(selected).toHaveAttribute("aria-selected", "true");
      expect(selected.element().querySelector("svg")).not.toBeNull();
    } finally {
      await unmount(instance);
      target.remove();
    }
  });
}
