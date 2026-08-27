import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./badge.browser-fixture.svelte";

afterEach(() => (document.body.innerHTML = ""));

test("forwards polymorphic badge callbacks and refs", async () => {
  render(Fixture);
  const badge = page.getByTestId("badge");
  await expect.element(badge).toHaveAttribute("type", "button");
  await expect.element(page.getByTestId("state")).toHaveTextContent("0:BUTTON");
  await badge.click();
  await expect.element(page.getByTestId("state")).toHaveTextContent("1:BUTTON");
});
