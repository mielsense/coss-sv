import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./combobox-anchor.browser-fixture.svelte";

afterEach(cleanup);

for (const mode of ["input", "chips", "popup", "custom"] as const) {
  test(`anchors the ${mode} popup to the matching control`, async () => {
    render(Fixture, { mode });
    if (mode === "popup") await page.getByTestId("anchor").click();
    else await page.getByRole("combobox", { name: "Choose" }).click();
    await expect.element(page.getByRole("option", { name: "Apple" })).toBeVisible();
    const anchor = page.getByTestId(mode === "custom" ? "custom-anchor" : "anchor").element();
    const positioner = document.querySelector<HTMLElement>("[data-slot=combobox-positioner]");
    if (!positioner) throw new Error("Expected an open positioner");
    await expect
      .poll(() => Number.parseFloat(positioner.style.getPropertyValue("--anchor-width")))
      .toBeCloseTo(anchor.getBoundingClientRect().width, 1);
    await expect
      .poll(() => positioner.getBoundingClientRect().left)
      .toBeCloseTo(anchor.getBoundingClientRect().left, 1);
    await expect
      .poll(() => positioner.getBoundingClientRect().top)
      .toBeCloseTo(anchor.getBoundingClientRect().bottom + 4, 1);
  });
}
