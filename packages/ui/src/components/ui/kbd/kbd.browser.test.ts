import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import KbdFixture from "./kbd.browser-fixture.svelte";
import Kbd from "./kbd.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Kbd browser contract", () => {
  test("forwards group callbacks and both element refs", async () => {
    render(KbdFixture);

    await expect.element(page.getByTestId("kbd-state")).toHaveTextContent("0:KBD:KBD");
    await page.getByTestId("kbd-group").click();
    await expect.element(page.getByTestId("kbd-state")).toHaveTextContent("1:KBD:KBD");
  });

  test("hydrates server-equivalent key markup without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<kbd class="pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded-[.25rem] bg-muted px-1 font-medium font-sans text-muted-foreground text-xs [&amp;_svg:not([class*=\'size-\'])]:size-3" data-slot="kbd"></kbd>';
    document.body.append(target);

    const component = hydrate(Kbd, { target });

    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
