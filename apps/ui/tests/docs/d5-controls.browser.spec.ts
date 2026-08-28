import "../../src/tailwind.css";
import "../../src/app.css";
import { mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import MenuButtonExample from "../../registry/default/particles/p-button-39.svelte";
import ButtonDownloadExample from "../../registry/default/particles/p-button-40.svelte";
import CheckboxExample from "../../registry/default/particles/p-checkbox-1.svelte";
import CheckboxGroupExample from "../../registry/default/particles/p-checkbox-group-4.svelte";
import SliderExample from "../../registry/default/particles/p-slider-14.svelte";
import SwitchExample from "../../registry/default/particles/p-switch-1.svelte";
import Availability7 from "../../registry/default/particles/p-switch-7.svelte";
import Availability8 from "../../registry/default/particles/p-switch-8.svelte";
import Availability9 from "../../registry/default/particles/p-switch-9.svelte";
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

    const buttonView = mount(MenuButtonExample, { target: document.body });
    const menuButton = page.getByRole("button", { name: "Open menu" });
    menuButton.element().focus();
    await userEvent.keyboard("{Enter}");
    await expect
      .element(page.getByRole("button", { name: "Close menu" }))
      .toHaveAttribute("aria-expanded", "true");
    await unmount(buttonView);
  });

  test("renders and filters all 96 quarter-hour options in each availability editor", async () => {
    for (const Example of [Availability7, Availability8, Availability9]) {
      const view = mount(Example, { target: document.body });
      const start = page.getByRole("combobox", { name: "Monday start time" });
      await start.click();
      await expect.element(page.getByPlaceholder("Search time")).toBeVisible();
      expect(document.querySelectorAll('[role="option"]')).toHaveLength(96);

      await userEvent.fill(page.getByPlaceholder("Search time"), "11:45 PM");
      await expect.element(page.getByRole("option", { name: "11:45 PM" })).toBeVisible();
      expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);
      await userEvent.keyboard("{Escape}");
      await unmount(view);
      document.body.innerHTML = "";
    }
  });

  test("adjusts ranges, clamps end choices, and copies Monday ranges to selected days", async () => {
    const view = mount(Availability7, { target: document.body });
    const start = page.getByRole("combobox", { name: "Monday start time" });
    await start.click();
    await userEvent.fill(page.getByPlaceholder("Search time"), "6:00 PM");
    await page.getByRole("option", { name: "6:00 PM" }).click();
    await expect.element(start).toHaveTextContent("6:00 PM");
    await expect
      .element(page.getByRole("combobox", { name: "Monday end time" }))
      .toHaveTextContent("7:00 PM");

    await page.getByRole("button", { name: "Add time range to Monday" }).click();
    const mondayStarts = document.querySelectorAll(
      '[role="combobox"][aria-label="Monday start time"]',
    );
    const mondayEnds = document.querySelectorAll('[role="combobox"][aria-label="Monday end time"]');
    expect(mondayStarts).toHaveLength(2);
    expect(mondayEnds).toHaveLength(2);
    expect(mondayStarts[1]?.textContent).toContain("8:00 PM");
    expect(mondayEnds[1]?.textContent).toContain("9:00 PM");

    await page.getByRole("button", { name: "Copy Monday times to other days" }).click();
    expect(document.querySelectorAll('[role="dialog"] [role="checkbox"]')).toHaveLength(6);
    await page.getByRole("checkbox", { name: "Tuesday" }).click();
    await page.getByRole("checkbox", { name: "Sunday" }).click();
    await page.getByRole("button", { name: "Apply" }).click();
    expect(document.querySelector('[role="dialog"]')).toBeNull();

    expect(
      document.querySelectorAll('[role="combobox"][aria-label="Sunday start time"]'),
    ).toHaveLength(2);
    expect(
      document.querySelectorAll('[role="combobox"][aria-label="Tuesday start time"]'),
    ).toHaveLength(2);

    const sundayStart = page.getByRole("combobox", { name: "Sunday start time" }).first();
    await sundayStart.click();
    await userEvent.fill(page.getByPlaceholder("Search time"), "not a time");
    await expect.element(page.getByText("No times found.", { exact: true })).toBeVisible();
    await unmount(view);
  });

  test("keeps the menu button transition at 300ms and removes it for reduced motion", async () => {
    const view = mount(MenuButtonExample, { target: document.body });
    const menuIcon = document.querySelector<SVGElement>('[data-menu-icon="menu"]');
    const cancelIcon = document.querySelector<SVGElement>('[data-menu-icon="cancel"]');
    expect(menuIcon).not.toBeNull();
    expect(cancelIcon).not.toBeNull();

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const menuStyle = getComputedStyle(menuIcon as SVGElement);
    expect(menuStyle.transitionDuration).toBe(reduced ? "0s" : "0.3s");
    expect(menuStyle.transitionProperty).toContain("transform");
    expect(menuStyle.transitionProperty).toContain("opacity");

    await page.getByRole("button", { name: "Open menu" }).click();
    await new Promise((resolve) => window.setTimeout(resolve, reduced ? 0 : 350));
    expect(getComputedStyle(menuIcon as SVGElement).opacity).toBe("0");
    expect(getComputedStyle(cancelIcon as SVGElement).opacity).toBe("1");
    await unmount(view);
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
    await expect.element(page.getByRole("tooltip", { name: "Bookmark this" })).toBeInTheDocument();
    bookmark.element().blur();
    await expect
      .element(page.getByRole("tooltip", { name: "Bookmark this" }))
      .not.toBeInTheDocument();
    await bookmark.hover();
    await expect.element(page.getByRole("tooltip", { name: "Bookmark this" })).toBeInTheDocument();
    await userEvent.unhover(bookmark);
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
    await expect.element(page.getByRole("tooltip", { name: "Bold" })).toBeInTheDocument();
    bold.element().blur();
    await expect.element(page.getByRole("tooltip", { name: "Bold" })).not.toBeInTheDocument();
    await bold.hover();
    await expect.element(page.getByRole("tooltip", { name: "Bold" })).toBeInTheDocument();
    await userEvent.unhover(bold);
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
