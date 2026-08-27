import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import ProgressFixture from "./progress.browser-fixture.svelte";
import ProgressRoot from "./progress-root.svelte";

afterEach(() => (document.body.innerHTML = ""));
describe("Progress browser contract", () => {
  test("links labels and tracks determinate, complete, and indeterminate states", async () => {
    render(ProgressFixture);
    const progress = page.getByTestId("progress");
    const indicator = page.getByTestId("progress-indicator");
    const labelId = (await page.getByTestId("progress-label").element()).id;
    await expect.element(progress).toHaveAttribute("aria-labelledby", labelId);
    await expect.element(progress).toHaveAttribute("data-progressing");
    expect((await indicator.element()).style.width).toBe("20%");
    await page.getByTestId("complete").click();
    await expect.element(progress).toHaveAttribute("data-complete");
    await expect.element(progress).toHaveAttribute("aria-valuenow", "100");
    await page.getByTestId("indeterminate").click();
    await expect.element(progress).toHaveAttribute("data-indeterminate");
    await expect.element(progress).not.toHaveAttribute("aria-valuenow");
    expect((await indicator.element()).style.width).toBe("");
    await expect.element(page.getByTestId("progress-ref")).toHaveTextContent("DIV");
  });
  test("hydrates an indeterminate root without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<div data-indeterminate="" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuetext="indeterminate progress" data-slot="progress" class="flex w-full flex-col gap-2" aria-label="Upload"><div data-indeterminate="" data-slot="progress-track" class="block h-1.5 w-full overflow-hidden rounded-full bg-input"><div data-indeterminate="" data-slot="progress-indicator" class="bg-primary transition-all duration-500"></div></div><span role="presentation" style="position:fixed;top:0;left:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;border:0;padding:0;width:1px;height:1px;margin:-1px;">x</span></div>';
    document.body.append(target);
    const component = hydrate(ProgressRoot, {
      props: { "aria-label": "Upload", value: null },
      target,
    });
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
