import { render } from "@testing-library/svelte";
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import ContractHarness from "../fixtures/ContractHarness.svelte";

test("supports snippet, binding, and typed context contracts in Chromium", async () => {
  render(ContractHarness);

  const button = page.getByRole("button", { name: "Increment contract" });
  await button.click();
  await expect.element(page.getByText("Bound value: 1")).toBeVisible();
  await expect.element(page.getByText("Parent value: 1")).toHaveAttribute("data-parent-value", "1");
});
