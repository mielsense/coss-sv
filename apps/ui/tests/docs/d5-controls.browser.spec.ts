import "../../src/tailwind.css";
import "../../src/app.css";
import { mount, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import MenuButtonExample from "../../registry/default/particles/p-button-39.svelte";
import ButtonDownloadExample from "../../registry/default/particles/p-button-40.svelte";
import CheckboxExample from "../../registry/default/particles/p-checkbox-1.svelte";
import CheckboxFormExample from "../../registry/default/particles/p-checkbox-5.svelte";
import CheckboxGroupExample from "../../registry/default/particles/p-checkbox-group-4.svelte";
import CheckboxGroupFormExample from "../../registry/default/particles/p-checkbox-group-5.svelte";
import RadioGroupFormExample from "../../registry/default/particles/p-radio-group-5.svelte";
import ThemeRadioGroupExample from "../../registry/default/particles/p-radio-group-6.svelte";
import SliderExample from "../../registry/default/particles/p-slider-14.svelte";
import SliderFormExample from "../../registry/default/particles/p-slider-23.svelte";
import SwitchExample from "../../registry/default/particles/p-switch-1.svelte";
import SwitchFormExample from "../../registry/default/particles/p-switch-5.svelte";
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

  test("matches the small SelectButton trigger and availability content geometry", async () => {
    await page.viewport(1024, 768);
    const view = mount(Availability7, { target: document.body });
    const desktopTrigger = page.getByRole("combobox", { name: "Monday start time" });
    const desktopTriggerRect = desktopTrigger.element().getBoundingClientRect();
    expect(desktopTriggerRect.width).toBeCloseTo(108, 1);
    expect(desktopTriggerRect.height).toBeCloseTo(28, 1);
    expect(document.body.firstElementChild?.getBoundingClientRect().height).toBeCloseTo(382, 1);
    await unmount(view);

    await page.viewport(500, 900);
    const narrowView = mount(Availability7, { target: document.body });
    const narrowTrigger = page.getByRole("combobox", { name: "Monday start time" });
    const narrowTriggerRect = narrowTrigger.element().getBoundingClientRect();
    expect(narrowTriggerRect.width).toBeCloseTo(108, 1);
    expect(narrowTriggerRect.height).toBeCloseTo(32, 1);
    expect(document.body.firstElementChild?.getBoundingClientRect().height).toBeCloseTo(750, 1);
    await unmount(narrowView);
    await page.viewport(1024, 768);
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
    const bookmarkTarget = document.createElement("div");
    bookmarkTarget.className = "flex justify-center";
    document.body.append(bookmarkTarget);
    const bookmarkView = mount(BookmarkToggleExample, { target: bookmarkTarget });
    const bookmark = page.getByRole("button", { name: "Bookmark this" });
    bookmark.element().focus();
    await expect.element(page.getByRole("tooltip", { name: "Bookmark this" })).toBeInTheDocument();
    const bookmarkTrigger = bookmark.element().parentElement;
    expect(bookmarkTrigger).not.toBeNull();
    expect(bookmarkTrigger?.getAttribute("data-slot")).toBe("tooltip-trigger");
    expect(bookmarkTrigger).toHaveAttribute("data-popup-open");
    const bookmarkRect = bookmark.element().getBoundingClientRect();
    const bookmarkPositioner = document.querySelector<HTMLElement>(
      '[data-slot="tooltip-positioner"]',
    );
    expect(bookmarkPositioner).not.toBeNull();
    const bookmarkPositionerRect = bookmarkPositioner?.getBoundingClientRect();
    expect(
      Math.abs(
        (bookmarkPositionerRect?.left ?? 0) +
          (bookmarkPositionerRect?.width ?? 0) / 2 -
          (bookmarkRect.left + bookmarkRect.width / 2),
      ),
    ).toBeLessThanOrEqual(1);
    await userEvent.keyboard("{Escape}");
    await expect
      .element(page.getByRole("tooltip", { name: "Bookmark this" }))
      .not.toBeInTheDocument();
    bookmark.element().blur();
    await bookmark.hover();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    await new Promise((resolve) => window.setTimeout(resolve, 650));
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
    await bold.hover();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    await expect.element(page.getByRole("tooltip", { name: "Bold" })).toBeInTheDocument();
    await userEvent.unhover(bold);
    await expect.element(page.getByRole("tooltip", { name: "Bold" })).not.toBeInTheDocument();
    bold.element().focus();
    await expect.element(page.getByRole("tooltip", { name: "Bold" })).toBeInTheDocument();
    const boldTrigger = bold.element().parentElement;
    expect(boldTrigger?.getAttribute("data-slot")).toBe("tooltip-trigger");
    expect(boldTrigger).toHaveAttribute("data-popup-open");
    bold.element().blur();
    await expect.element(page.getByRole("tooltip", { name: "Bold" })).not.toBeInTheDocument();
    bold.element().focus();
    await userEvent.keyboard(" ");
    await expect.element(bold).toHaveAttribute("aria-pressed", "false");
    await unmount(groupView);
  });

  test("keeps every availability day switch mounted and focused after Space", async () => {
    for (const Example of [Availability7, Availability8, Availability9]) {
      const view = mount(Example, { target: document.body });
      const monday = page.getByRole("switch").first();
      const originalElement = monday.element();

      originalElement.focus();
      await userEvent.keyboard(" ");

      await expect.element(monday).not.toBeChecked();
      expect(page.getByRole("switch").first().element()).toBe(originalElement);
      expect(document.activeElement).toBe(originalElement);
      await unmount(view);
      document.body.innerHTML = "";
    }
  });

  test("gives theme radios exact names and activates them from cards, labels, and keys", async () => {
    const view = mount(ThemeRadioGroupExample, { target: document.body });
    const system = page.getByRole("radio", { name: "System", exact: true });
    const light = page.getByRole("radio", { name: "Light", exact: true });
    const dark = page.getByRole("radio", { name: "Dark", exact: true });

    await expect.element(system).toBeChecked();

    const systemCard = system.element().nextElementSibling?.nextElementSibling;
    const lightCard = light.element().nextElementSibling?.nextElementSibling;
    expect(systemCard).toBeInstanceOf(HTMLElement);
    expect(lightCard).toBeInstanceOf(HTMLElement);

    const assertRect = (
      element: Element | null,
      expected: { height: number; left: number; top: number; width: number },
      origin: DOMRect,
    ) => {
      expect(element).toBeInstanceOf(HTMLElement);
      const rect = (element as HTMLElement).getBoundingClientRect();
      expect(rect.left - origin.left).toBeCloseTo(expected.left, 1);
      expect(rect.top - origin.top).toBeCloseTo(expected.top, 1);
      expect(rect.width).toBeCloseTo(expected.width, 1);
      expect(rect.height).toBeCloseTo(expected.height, 1);
    };

    const lightCardRect = (lightCard as HTMLElement).getBoundingClientRect();
    expect(lightCardRect.width).toBeCloseTo(88, 1);
    expect(lightCardRect.height).toBeCloseTo(70, 1);
    const lightPanel = lightCard?.firstElementChild ?? null;
    assertRect(lightPanel, { height: 62, left: 10, top: 8, width: 78 }, lightCardRect);
    const lightPanelChildren = lightPanel?.children ?? [];
    assertRect(
      lightPanelChildren[0] ?? null,
      { height: 16, left: 10, top: 10, width: 16 },
      lightPanel?.getBoundingClientRect() ?? lightCardRect,
    );
    assertRect(
      lightPanelChildren[1] ?? null,
      { height: 4, left: 10, top: 34, width: 58 },
      lightPanel?.getBoundingClientRect() ?? lightCardRect,
    );
    assertRect(
      lightPanelChildren[2] ?? null,
      { height: 4, left: 10, top: 41, width: 58 },
      lightPanel?.getBoundingClientRect() ?? lightCardRect,
    );
    assertRect(
      lightPanelChildren[3] ?? null,
      { height: 4, left: 10, top: 48, width: 29 },
      lightPanel?.getBoundingClientRect() ?? lightCardRect,
    );

    const systemCardRect = (systemCard as HTMLElement).getBoundingClientRect();
    const systemPanels = Array.from(systemCard?.children ?? []).slice(2);
    assertRect(
      systemPanels[0] ?? null,
      { height: 62, left: 10, top: 8, width: 34 },
      systemCardRect,
    );
    assertRect(
      systemPanels[1] ?? null,
      { height: 62, left: 54, top: 8, width: 34 },
      systemCardRect,
    );

    expect(lightCard).toBeInstanceOf(HTMLElement);
    await userEvent.click(lightCard as HTMLElement);
    await expect.element(light).toBeChecked();
    await page.getByText("Dark", { exact: true }).click();
    await expect.element(dark).toBeChecked();

    system.element().focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(light).toBeChecked();
    await expect.element(light).toHaveFocus();
    await unmount(view);
  });

  test("submits all five package forms without navigation and keeps the captured values", async () => {
    const examples = [
      { Component: CheckboxFormExample, expected: "Terms: yes" },
      { Component: CheckboxGroupFormExample, expected: "Selected: next" },
      { Component: RadioGroupFormExample, expected: "Selected: next" },
      { Component: SliderFormExample, expected: "Volume: 25, 75" },
      { Component: SwitchFormExample, expected: "Marketing emails: on" },
    ];
    const alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);

    try {
      for (const { Component, expected } of examples) {
        history.replaceState({}, "", `${location.pathname}?d5-form=stable`);
        const view = mount(Component, { target: document.body });

        await page.getByRole("button", { name: "Submit" }).click();
        await expect
          .element(page.getByRole("button", { name: "Submit" }))
          .toHaveAttribute("data-loading");
        await new Promise((resolve) => window.setTimeout(resolve, 850));

        expect(location.search).toBe("?d5-form=stable");
        expect(alert).toHaveBeenLastCalledWith(expected);
        await unmount(view);
        document.body.innerHTML = "";
      }
    } finally {
      alert.mockRestore();
      history.replaceState({}, "", location.pathname);
    }
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
