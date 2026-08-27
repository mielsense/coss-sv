import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import MeterFixture from "./meter.browser-fixture.svelte";
import MeterRoot from "./meter-root.svelte";

afterEach(() => (document.body.innerHTML = ""));

describe("Meter browser contract", () => {
  test("links labels, formats ranges, clamps values, updates by keyboard, and forwards refs", async () => {
    render(MeterFixture);
    const meter = page.getByTestId("meter");
    const label = page.getByTestId("meter-label");
    await expect.element(meter).toHaveAttribute("role", "meter");
    await expect.element(meter).toHaveAttribute("aria-valuenow", "75");
    await expect.element(meter).toHaveAttribute("aria-labelledby", (await label.element()).id);
    await expect.element(page.getByTestId("meter-value")).toHaveTextContent("75%");
    expect((await page.getByTestId("meter-indicator").element()).style.width).toBe("75%");
    await page.getByTestId("meter-update").click();
    await expect.element(meter).toHaveAttribute("aria-valuenow", "100");
    expect((await page.getByTestId("meter-indicator").element()).style.width).toBe("100%");
    await expect.element(page.getByTestId("custom-meter-value")).toHaveTextContent("40%:700");
    expect((await page.getByTestId("custom-meter-indicator").element()).style.width).toBe("40%");
    await expect.element(page.getByTestId("meter-refs")).toHaveTextContent("DIV:DIV");
  });

  test("hydrates the default aria-labelled meter without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<div role="meter" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-valuetext="50%" class="flex w-full flex-col gap-2" aria-label="Usage"><div data-slot="meter-track" class="block h-2 w-full overflow-hidden bg-input"><div style="inset-inline-start:0;height:inherit;width:50%" data-slot="meter-indicator" class="bg-primary transition-all duration-500"></div></div><span role="presentation" style="position:fixed;top:0;left:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;border:0;padding:0;width:1px;height:1px;margin:-1px;">x</span></div>';
    document.body.append(target);
    const component = hydrate(MeterRoot, { props: { "aria-label": "Usage", value: 50 }, target });
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
