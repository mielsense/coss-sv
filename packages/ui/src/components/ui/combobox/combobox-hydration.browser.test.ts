import { hydrate, tick, unmount } from "svelte";
import { expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import Fixture from "./combobox-hydration.browser-fixture.svelte";
import { hydrationHtml } from "./combobox-hydration.html-fixture.js";

test("hydrates the selected label and retains typing and external updates", async () => {
  const target = document.createElement("div");
  target.innerHTML = hydrationHtml;
  document.body.append(target);
  const warnings = vi.spyOn(console, "warn").mockImplementation(() => {});
  let instance: ReturnType<typeof hydrate> | undefined;
  try {
    expect(target.querySelector<HTMLInputElement>('[aria-label="Hydrated selection"]')?.value).toBe(
      "Apple",
    );
    instance = hydrate(Fixture, { target, recover: false });
    await tick();
    const input = page.getByRole("combobox", { name: "Hydrated selection" });
    await expect.element(input).toHaveValue("Apple");
    await input.fill("query");
    await expect.element(input).toHaveValue("query");
    await page.getByTestId("hydrated-external").click();
    await expect.element(input).toHaveValue("Banana");
    await expect.element(page.getByTestId("hydrated-value")).toHaveTextContent("Banana");
    expect(warnings.mock.calls.flat().map(String).join(" ")).not.toMatch(/hydration_/);
  } finally {
    if (instance) await unmount(instance);
    warnings.mockRestore();
    target.remove();
  }
});
