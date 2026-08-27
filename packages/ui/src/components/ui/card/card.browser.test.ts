import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./card.browser-fixture.svelte";

afterEach(() => (document.body.innerHTML = ""));

test("forwards polymorphic card callbacks and refs", async () => {
  render(Fixture);
  const card = page.getByTestId("card");
  await expect.element(card).toHaveTextContent("Project details");
  await expect.element(page.getByTestId("state")).toHaveTextContent("0:ARTICLE");
  await card.click();
  await expect.element(page.getByTestId("state")).toHaveTextContent("1:ARTICLE");
});
