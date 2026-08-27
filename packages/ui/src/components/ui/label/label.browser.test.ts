import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import LabelFixture from "./label.browser-fixture.svelte";
import Label from "./label.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Label browser contract", () => {
  test("activates an associated control and forwards its ref", async () => {
    render(LabelFixture);
    await expect.element(page.getByTestId("label-state")).toHaveTextContent("false:LABEL");
    await page.getByTestId("native-label").click();
    await expect.element(page.getByTestId("label-state")).toHaveTextContent("true:LABEL");
  });

  test("hydrates native label markup without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<label data-slot="label" class="inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground sm:text-sm/4"></label>';
    document.body.append(target);

    const component = hydrate(Label, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector("label")?.dataset.slot).toBe("label");
    await unmount(component);
    warning.mockRestore();
  });
});
