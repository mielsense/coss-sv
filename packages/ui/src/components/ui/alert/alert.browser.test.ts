import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./alert.browser-fixture.svelte";

afterEach(() => (document.body.innerHTML = ""));

test("forwards alert callbacks and refs in the browser", async () => {
  render(Fixture);
  const alert = page.getByTestId("alert");
  await expect.element(alert).toHaveAttribute("role", "alert");
  await expect.element(page.getByTestId("state")).toHaveTextContent("0:DIV");
  await alert.click();
  await expect.element(page.getByTestId("state")).toHaveTextContent("1:DIV");
});
