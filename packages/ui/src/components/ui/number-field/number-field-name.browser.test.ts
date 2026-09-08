import { hydrate, unmount } from "svelte";
import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./number-field-name.browser-fixture.svelte";
import { numberFieldNameHtml } from "./number-field-name.hydration-fixture.js";

test("submits only the canonical number under an inherited Field name", async () => {
  render(Fixture);
  const form = page.getByTestId("number-form").element() as HTMLFormElement;
  const input = page.getByRole("spinbutton", { name: "Quantity" });
  await expect.element(input).toHaveValue("1,234.5");
  expect(new FormData(form).getAll("quantity")).toEqual(["1234.5"]);
  await userEvent.click(input);
  await userEvent.keyboard("{ArrowUp}");
  expect(new FormData(form).getAll("quantity")).toEqual(["1235"]);
  await userEvent.keyboard("{Enter}");
  await expect.element(page.getByTestId("submissions")).toHaveTextContent("1");
  await input.fill("");
  expect(form.checkValidity()).toBe(false);
  form.requestSubmit();
  await expect.element(page.getByTestId("submissions")).toHaveTextContent("1");
  form.reset();
  await expect.element(input).toHaveValue("1,234.5");
  expect(new FormData(form).getAll("quantity")).toEqual(["1234.5"]);
});

test("hydrates without duplicate entries and keeps native validation and reactive form ownership", async () => {
  const target = document.createElement("div");
  target.innerHTML = numberFieldNameHtml;
  document.body.append(target);
  const form = target.querySelector<HTMLFormElement>('[data-testid="number-form"]');
  if (!form) throw new Error("Missing native form");
  expect(new FormData(form).getAll("quantity")).toEqual(["1234.5"]);
  const warning = vi.spyOn(console, "warn");
  const error = vi.spyOn(console, "error");
  const instance = hydrate(Fixture, { target });
  try {
    const input = target.querySelector<HTMLInputElement>('[data-slot="number-field-input"]');
    if (!input) throw new Error("Missing formatted input");
    await expect.poll(() => input.form).toBe(form);
    expect(input.hasAttribute("name")).toBe(false);
    expect(new FormData(form).getAll("quantity")).toEqual(["1234.5"]);
    input.setCustomValidity("Custom error");
    expect(form.checkValidity()).toBe(false);
    input.setCustomValidity("");
    input.pattern = "[0-9]+";
    expect(form.checkValidity()).toBe(false);
    input.removeAttribute("pattern");
    expect(form.checkValidity()).toBe(true);
    await page.getByRole("button", { name: "Rename field" }).click();
    await expect.poll(() => new FormData(form).getAll("renamed")).toEqual(["1234.5"]);
    expect(input.hasAttribute("name")).toBe(false);
    await page.getByRole("button", { name: "Move form" }).click();
    const external = target.querySelector<HTMLFormElement>("#external-number");
    if (!external) throw new Error("Missing external form");
    await expect.poll(() => input.form).toBe(external);
    expect(new FormData(form).getAll("renamed")).toEqual([]);
    expect(new FormData(external).getAll("renamed")).toEqual(["1234.5"]);
    await page.getByRole("spinbutton", { name: "Quantity" }).click();
    await userEvent.keyboard("{ArrowUp}{Enter}");
    await expect.element(page.getByTestId("submissions")).toHaveTextContent("1");
    external.reset();
    await expect.poll(() => new FormData(external).getAll("renamed")).toEqual(["1234.5"]);
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  } finally {
    await unmount(instance);
    target.remove();
    vi.restoreAllMocks();
  }
});
