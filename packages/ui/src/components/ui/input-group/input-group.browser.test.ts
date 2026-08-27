import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import InputGroupFixture from "./input-group.browser-fixture.svelte";
import InputGroupRoot from "./input-group-root.svelte";
import { inputGroupClass } from "./input-group-styles.js";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Input Group browser contract", () => {
  test("hands non-interactive addons to the control without stealing interactive targets", async () => {
    render(InputGroupFixture);

    await expect.element(page.getByTestId("state")).toHaveTextContent("seed:INPUT");
    await page.getByTestId("focus-addon").click();
    await expect.element(page.getByTestId("control")).toHaveFocus();
    await page.getByTestId("control").fill("updated");
    await expect.element(page.getByTestId("state")).toHaveTextContent("updated:INPUT");

    await page.getByTestId("interactive").click();
    await expect.element(page.getByTestId("interactive")).toHaveFocus();

    document.body.focus();
    await page.getByTestId("overridden-addon").click();
    await expect.element(page.getByTestId("overridden-control")).not.toHaveFocus();

    await expect
      .element(page.getByTestId("block-addon"))
      .toHaveAttribute("data-align", "block-end");
    await page.getByTestId("textarea").fill("updated notes");
    await expect.element(page.getByTestId("textarea")).toHaveValue("updated notes");
  });

  test("hydrates the exact root class and role without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<div data-slot="input-group" role="group" class="${inputGroupClass}" data-testid="hydrated-input-group"></div>`;
    document.body.append(target);

    const component = hydrate(InputGroupRoot, {
      props: { "data-testid": "hydrated-input-group" },
      target,
    });

    expect(warning).not.toHaveBeenCalled();
    await expect.element(page.getByTestId("hydrated-input-group")).toHaveAttribute("role", "group");
    await unmount(component);
    warning.mockRestore();
  });

  test("preserves a bound password value while its type changes", async () => {
    render(InputGroupFixture);

    const input = page.getByTestId("password-control");
    await input.fill("Abcdefg1");
    await expect.element(page.getByTestId("password-state")).toHaveTextContent("Abcdefg1");
    await expect.element(input).toHaveValue("Abcdefg1");

    await page.getByTestId("password-toggle").click();
    await expect.element(input).toHaveAttribute("type", "text");
    await expect.element(input).toHaveValue("Abcdefg1");
    await expect.element(page.getByTestId("password-state")).toHaveTextContent("Abcdefg1");
  });
});
