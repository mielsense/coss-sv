import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import NativeWrapperBrowser from "./fixtures/native-wrapper-browser.svelte";
import ShardsButtonCompat from "./fixtures/shards-button-compat.svelte";

test("forwards native attributes, event callbacks, and snippet content in a browser", async () => {
  render(NativeWrapperBrowser);

  const button = page.getByRole("button", { name: "Increment" });
  await expect.element(button).toHaveAttribute("data-forwarded", "yes");
  await button.click();
  await expect.element(page.getByRole("status")).toHaveTextContent("1");
});

test("renders against the published Shards UI beta package", async () => {
  render(ShardsButtonCompat);

  await expect
    .element(page.getByRole("button", { name: "Shards button" }))
    .toHaveAttribute("data-shards-compat", "0.1.0-beta.0");
});
