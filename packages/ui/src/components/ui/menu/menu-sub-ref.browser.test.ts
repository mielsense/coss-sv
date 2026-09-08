import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./menu-sub-ref.browser-fixture.svelte";

test("forwards the submenu popup ref and clears it on removal", async () => {
  render(Fixture);
  await expect.element(page.getByTestId("sub-ref")).toHaveTextContent("menu");
  (page.getByTestId("remove-menu").element() as HTMLButtonElement).click();
  await expect.element(page.getByTestId("sub-ref")).toHaveTextContent("null");
});
