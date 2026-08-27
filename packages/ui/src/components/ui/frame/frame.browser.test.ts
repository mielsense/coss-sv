import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import FrameFixture from "./frame.browser-fixture.svelte";
import Frame from "./frame.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Frame browser contract", () => {
  test("forwards callbacks and refs through the exact semantic structure", async () => {
    render(FrameFixture);

    await expect.element(page.getByTestId("frame-state")).toHaveTextContent("0:DIV:DIV");
    await expect.element(page.getByText("Section header")).toBeVisible();
    await expect.element(page.getByText("Brief description")).toBeVisible();
    await expect.element(page.getByText("Footer")).toBeVisible();
    await page.getByTestId("frame-panel").click();
    await expect.element(page.getByTestId("frame-state")).toHaveTextContent("1:DIV:DIV");
  });

  test("hydrates server-equivalent root markup without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<div class="relative flex flex-col rounded-2xl bg-muted/72 p-1 *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1" data-slot="frame"></div>';
    document.body.append(target);

    const component = hydrate(Frame, { target });

    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
