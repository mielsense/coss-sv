import { mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import ButtonExample from "../../registry/default/particles/p-button-37.svelte";
import ButtonDownloadExample from "../../registry/default/particles/p-button-40.svelte";
import CheckboxExample from "../../registry/default/particles/p-checkbox-1.svelte";
import CheckboxGroupExample from "../../registry/default/particles/p-checkbox-group-4.svelte";
import SliderExample from "../../registry/default/particles/p-slider-14.svelte";
import SwitchExample from "../../registry/default/particles/p-switch-1.svelte";
import ToggleExample from "../../registry/default/particles/p-toggle-1.svelte";
import BookmarkToggleExample from "../../registry/default/particles/p-toggle-8.svelte";
import ToggleGroupExample from "../../registry/default/particles/p-toggle-group-9.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("D5 control examples", () => {
  test("keeps toggle, switch, and animated button state keyboard operable", async () => {
    const toggleView = mount(ToggleExample, { target: document.body });
    const toggle = page.getByRole("button", { name: "Toggle" });
    toggle.element().focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(toggle).toHaveAttribute("aria-pressed", "true");
    await unmount(toggleView);

    const switchView = mount(SwitchExample, { target: document.body });
    const switchControl = page.getByRole("switch", { name: "Marketing emails" });
    switchControl.element().focus();
    await userEvent.keyboard(" ");
    await expect.element(switchControl).toHaveAttribute("aria-checked", "true");
    await unmount(switchView);

    const buttonView = mount(ButtonExample, { target: document.body });
    const menuButton = page.getByRole("button", { name: "Open menu" });
    menuButton.element().focus();
    await userEvent.keyboard("{Enter}");
    await expect
      .element(page.getByRole("button", { name: "Close menu" }))
      .toHaveAttribute("aria-expanded", "true");
    await unmount(buttonView);
  });

  test("keeps checkbox labels and slider step buttons synchronized", async () => {
    const checkboxView = mount(CheckboxExample, { target: document.body });
    const checkbox = page.getByRole("checkbox", { name: "Accept terms and conditions" });
    await checkbox.click();
    await expect.element(checkbox).toBeChecked();
    await unmount(checkboxView);

    const sliderView = mount(SliderExample, { target: document.body });
    await expect.element(page.getByText("100 credits/mo")).toBeVisible();
    await page.getByRole("button", { name: "Increase value" }).click();
    await expect.element(page.getByText("105 credits/mo")).toBeVisible();
    const slider = document.querySelector<HTMLInputElement>('input[type="range"]');
    expect(slider).not.toBeNull();
    slider?.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByText("110 credits/mo")).toBeVisible();
    await unmount(sliderView);
  });

  test("synchronizes nested checkbox parent and child state", async () => {
    const view = mount(CheckboxGroupExample, { target: document.body });
    const manageUsers = page.getByRole("checkbox", { name: "Manage Users" });
    await manageUsers.click();
    await expect.element(page.getByRole("checkbox", { name: "Create User" })).toBeChecked();
    await expect.element(page.getByRole("checkbox", { name: "Assign Roles" })).toBeChecked();

    await page.getByRole("checkbox", { name: "Create User" }).click();
    await expect.element(manageUsers).not.toBeChecked();
    await expect
      .element(page.getByRole("checkbox", { name: "User Permissions" }))
      .toHaveAttribute("data-indeterminate");
    await unmount(view);
  });

  test("keeps tooltip-backed toggle controls keyboard operable", async () => {
    const bookmarkView = mount(BookmarkToggleExample, { target: document.body });
    const bookmark = page.getByRole("button", { name: "Bookmark this" });
    bookmark.element().focus();
    await userEvent.keyboard(" ");
    await expect
      .element(page.getByRole("button", { name: "Remove bookmark" }))
      .toHaveAttribute("aria-pressed", "true");
    await expect.element(page.getByText("Bookmarked!", { exact: true })).toBeVisible();
    await unmount(bookmarkView);

    const groupView = mount(ToggleGroupExample, { target: document.body });
    const bold = page.getByRole("button", { name: "Toggle bold" });
    await expect.element(bold).toHaveAttribute("aria-pressed", "true");
    bold.element().focus();
    await userEvent.keyboard(" ");
    await expect.element(bold).toHaveAttribute("aria-pressed", "false");
    await unmount(groupView);
  });

  test("starts and cancels the download progress flow", async () => {
    const view = mount(ButtonDownloadExample, { target: document.body });
    await userEvent.click(page.getByRole("button", { name: "Download" }));
    await new Promise((resolve) => window.setTimeout(resolve, 50));
    expect(document.querySelector('[role="status"]')).not.toBeNull();
    await page.getByRole("button", { name: "Cancel download" }).click();
    await expect.element(page.getByText("Cancelled", { exact: true })).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Download" })).toBeVisible();
    await unmount(view);
  });
});
