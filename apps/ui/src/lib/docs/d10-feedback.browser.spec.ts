import { mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import Fixture from "./d10-feedback.browser-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("D10 feedback browser behavior", () => {
  test("preserves alert, progress, and toast semantics", async () => {
    const view = mount(Fixture, { target: document.body });

    await expect.element(page.getByRole("alert")).toHaveTextContent("Heads up!");
    await expect.element(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "60");
    await expect.element(page.getByRole("progressbar")).toHaveAccessibleName("Export data");

    const trigger = page.getByRole("button", { name: "Perform Action" });
    trigger.element().focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByText("Action performed")).toBeInTheDocument();
    await expect.element(page.getByRole("button", { name: "Undo" })).toBeInTheDocument();

    await unmount(view);
  });
});
