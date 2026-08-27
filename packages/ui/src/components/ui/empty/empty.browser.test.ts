import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./empty.browser-fixture.svelte";

afterEach(() => (document.body.innerHTML = ""));

test("mirrors COSS media prop forwarding across the wrapper and content layer", async () => {
  render(Fixture);
  const media = page
    .getByTestId("media")
    .filter({ has: page.getByTestId("content") })
    .first();
  await expect.element(media).toHaveAttribute("data-variant", "icon");
  await expect.element(page.getByTestId("content")).toHaveTextContent("icon");
  await expect.element(page.getByTestId("state")).toHaveTextContent("0:DIV");
  await media.click();
  await expect.element(page.getByTestId("state")).toHaveTextContent("2:DIV");
});
