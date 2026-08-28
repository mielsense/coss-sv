import { afterEach, describe, expect, test } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./selection-parts-ref.browser-fixture.svelte";

afterEach(cleanup);

describe("selection part ref contracts", () => {
  test("binds every delegated part ref and clears each binding on unmount", async () => {
    render(Fixture);

    await expect.element(page.getByTestId("selection-part-ref-state")).toHaveTextContent("bound");
    await page.getByRole("button", { name: "Unmount selection parts" }).click();
    await expect
      .element(page.getByTestId("selection-part-ref-cleanup"))
      .toHaveTextContent("cleared");
  });
});
