import { mount, unmount } from "svelte";
import { afterEach, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import Particle from "../../../registry/default/particles/p-number-field-10.svelte";

let view: ReturnType<typeof mount> | undefined;
afterEach(async () => {
  if (view) await unmount(view);
  view = undefined;
  vi.restoreAllMocks();
});

test("submits one canonical quantity while preserving labels, bounds, and native Enter", async () => {
  const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
  view = mount(Particle, { target: document.body });
  const input = page.getByRole("spinbutton", { name: "Quantity", exact: true });
  await expect.element(input).toHaveValue("1");
  const form = input.element().closest("form");
  if (!form) throw new Error("Missing particle form");
  expect(new FormData(form).getAll("quantity")).toEqual(["1"]);
  await expect.element(input).toHaveAttribute("aria-valuemin", "1");
  await expect.element(input).toHaveAttribute("aria-valuemax", "100");
  await page.getByRole("button", { name: "Increase" }).click();
  await expect.element(input).toHaveValue("2");
  expect(new FormData(form).getAll("quantity")).toEqual(["2"]);
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect.poll(() => alert.mock.calls).toEqual([["Quantity: 2"]]);
  await input.click();
  await input.fill("3");
  await userEvent.keyboard("{Enter}");
  await expect.poll(() => alert.mock.calls).toEqual([["Quantity: 2"], ["Quantity: 3"]]);
  expect(new FormData(form).getAll("quantity")).toEqual(["3"]);
});
