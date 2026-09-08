import { afterEach, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./combobox-items.browser-fixture.svelte";

afterEach(cleanup);

for (const grouped of [false, true]) {
  test(`filters source records and preserves primitive selection with grouped=${grouped}`, async () => {
    render(Fixture, { grouped });
    const input = page.getByRole("combobox", { name: "Choose person" });
    await expect.element(input).toHaveValue("Ada Lovelace");
    await input.fill("Grace");
    await page.getByRole("option", { name: "Grace Hopper", exact: true }).click();
    await expect.element(input).toHaveValue("Grace Hopper");
    await expect.element(page.getByTestId("value")).toHaveTextContent('"grace"');
    expect(new FormData(page.getByTestId("form").element() as HTMLFormElement).get("person")).toBe(
      "grace",
    );
    await input.click();
    await expect
      .element(page.getByRole("option", { name: "Grace Hopper", exact: true }))
      .toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Escape}");
    await page.getByRole("button", { name: "Replace items" }).click();
    await expect.element(input).toHaveValue("Grace Hopper updated");
    await expect.element(page.getByTestId("label")).toHaveTextContent("Grace Hopper updated");
  });
}

test("uses label fallback for an unknown primitive ID", async () => {
  render(Fixture, { initial: "missing" });
  await expect
    .element(page.getByRole("combobox", { name: "Choose person" }))
    .toHaveValue("Unknown missing");
  await expect.element(page.getByTestId("label")).toHaveTextContent("Unknown missing");
});

test("submits repeated primitive IDs in multiple mode", async () => {
  render(Fixture, { multiple: true });
  await page.getByRole("combobox", { name: "Choose person" }).fill("Grace");
  await page.getByRole("option", { name: "Grace Hopper", exact: true }).click();
  await expect.element(page.getByTestId("value")).toHaveTextContent('["ada","grace"]');
  expect(
    new FormData(page.getByTestId("form").element() as HTMLFormElement).getAll("person"),
  ).toEqual(["ada", "grace"]);
});

test("custom filters receive source records and the source label accessor", async () => {
  render(Fixture, { customFilter: true });
  const input = page.getByRole("combobox", { name: "Choose person" });
  await input.fill("Gra");
  await expect.element(page.getByRole("option", { name: "Grace Hopper" })).toBeVisible();
  await expect.element(page.getByRole("option", { name: "Ada Lovelace" })).not.toBeInTheDocument();
});

test("externally filtered records supply their labels and primitive selection", async () => {
  render(Fixture, { externalOnly: true, initial: "katherine" });
  const input = page.getByRole("combobox", { name: "Choose person" });
  await expect.element(input).toHaveValue("Katherine Johnson");
  await input.fill("Kath");
  await page.getByRole("option", { name: "Katherine Johnson" }).click();
  await expect.element(page.getByTestId("value")).toHaveTextContent('"katherine"');
  await expect.element(input).toHaveValue("Katherine Johnson");
});
