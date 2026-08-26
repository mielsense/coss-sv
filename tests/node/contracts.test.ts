import { render } from "svelte/server";
import { expect, test } from "vitest";
import ContractHarness from "../fixtures/ContractHarness.svelte";

test("renders snippet, binding, and typed context fixtures through SSR", () => {
  const { body } = render(ContractHarness);

  expect(body).toContain("Increment contract");
  expect(body).toContain("Bound value: 0");
  expect(body).toContain("Parent value: 0");
});
