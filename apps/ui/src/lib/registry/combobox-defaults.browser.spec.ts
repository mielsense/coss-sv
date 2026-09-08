import { mount, unmount } from "svelte";
import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import Multiple from "../../../registry/default/particles/p-combobox-9.svelte";
import Timezone from "../../../registry/default/particles/p-combobox-16.svelte";

const mounted: { instance: Record<string, unknown>; target: HTMLElement }[] = [];
afterEach(async () => {
  for (const { instance, target } of mounted.splice(0)) {
    await unmount(instance);
    target.remove();
  }
});
function render(component: typeof Multiple) {
  const target = document.createElement("div");
  document.body.append(target);
  mounted.push({ instance: mount(component, { target }), target });
  return { container: target };
}

test("the timezone example keeps its new object selection when reopened", async () => {
  render(Timezone);
  const input = page.getByRole("combobox", { name: "Select timezone" });
  await expect.poll(() => (input.element() as HTMLInputElement).value).toContain("Europe/London");
  await input.fill("Europe/Paris");
  await page.getByRole("option", { name: /Europe\/Paris/ }).click();
  await input.click();
  const option = page.getByRole("option", { name: /Europe\/Paris/ });
  await expect.element(option).toHaveAttribute("aria-selected", "true");
  await expect.element(option.element().querySelector("svg")).toBeVisible();
});

test("the multiple example renders live selected chips without introducing a form field", async () => {
  const { container } = render(Multiple);
  expect(container.querySelector("input[name]")).toBeNull();
  const input = page.getByRole("combobox", { name: "Select a item" });
  await input.fill("Banana");
  await page.getByRole("option", { name: "Banana", exact: true }).click();
  await expect
    .element(container.querySelector<HTMLElement>("[data-slot=combobox-chip][aria-label=Banana]"))
    .toBeVisible();
});
