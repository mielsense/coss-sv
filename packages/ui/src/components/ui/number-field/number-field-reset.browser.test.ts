import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./number-field-reset.browser-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

function input(testId: string, value: string): HTMLInputElement {
  const element = document.querySelector<HTMLInputElement>(`[data-testid="${testId}"]`);
  if (!element) throw new Error(`Missing ${testId}`);
  element.focus();
  element.value = value;
  element.dispatchEvent(new InputEvent("input", { bubbles: true, data: value }));
  return element;
}

function form(testId: string): HTMLFormElement {
  const element = document.querySelector<HTMLFormElement>(`[data-testid="${testId}"]`);
  if (!element) throw new Error(`Missing ${testId}`);
  return element;
}

test("resets formatted display, binding, and submitted value to the initial default", async () => {
  render(Fixture);
  input("reset-input", "5");
  await expect.element(page.getByTestId("reset-value")).toHaveTextContent("5");
  form("reset-form").reset();
  await expect.element(page.getByTestId("reset-value")).toHaveTextContent("2");
  await expect.element(page.getByTestId("reset-input")).toHaveValue("2,0");
  expect(new FormData(form("reset-form")).get("quantity")).toBe("2");
  await expect.element(page.getByTestId("reset-callbacks")).toHaveTextContent("1:0");
});

test("preserves a controlled value when its binding declines the reset", async () => {
  render(Fixture);
  form("controlled-form").reset();
  await expect.element(page.getByTestId("controlled-input")).toHaveValue("7");
  expect(new FormData(form("controlled-form")).get("locked")).toBe("7");
});

test("honors canceled resets and the native input's external form owner", async () => {
  render(Fixture);
  input("reset-input", "5");
  await page.getByTestId("cancel-reset").click();
  form("reset-form").reset();
  await expect.element(page.getByTestId("reset-value")).toHaveTextContent("5");
  await expect.element(page.getByTestId("reset-input")).toHaveValue("5,0");
  expect(new FormData(form("reset-form")).get("quantity")).toBe("5");
  input("external-input", "8");
  await expect.element(page.getByTestId("external-value")).toHaveTextContent("8");
  form("external-form").reset();
  await expect.element(page.getByTestId("external-value")).toHaveTextContent("3");
  await expect.element(page.getByTestId("external-input")).toHaveValue("3");
  expect(new FormData(form("external-form")).get("external")).toBe("3");
});

test("restores canceled text edits and clears without changing ARIA, form data, or commit callbacks", async () => {
  render(Fixture);
  const element = input("canceled-input", "9");
  await expect.element(page.getByTestId("canceled-input")).toHaveValue("2");
  await expect.element(page.getByTestId("canceled-input")).toHaveAttribute("aria-valuenow", "2");
  input("canceled-input", "");
  await expect.element(page.getByTestId("canceled-input")).toHaveValue("2");
  element.blur();
  await expect.element(page.getByTestId("canceled-value")).toHaveTextContent("2:0");
  expect(new FormData(form("canceled-form")).get("canceled")).toBe("2");
});
