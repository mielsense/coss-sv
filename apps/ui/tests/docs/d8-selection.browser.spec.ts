import "../../src/tailwind.css";
import "../../src/app.css";
import { mount, unmount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import AutocompleteExample from "../../registry/default/particles/p-autocomplete-1.svelte";
import ComboboxExample from "../../registry/default/particles/p-combobox-9.svelte";
import CommandExample from "../../registry/default/particles/p-command-1.svelte";
import ContextMenuExample from "../../registry/default/particles/p-context-menu-1.svelte";
import MenuExample from "../../registry/default/particles/p-menu-1.svelte";
import SelectExample from "../../registry/default/particles/p-select-7.svelte";
import ToolbarExample from "../../registry/default/particles/p-toolbar-1.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("D8 selection, command, and menu examples", () => {
  test("filters autocomplete and accepts the highlighted value with the keyboard", async () => {
    const view = mount(AutocompleteExample, { target: document.body });
    const input = page.getByRole("combobox", { name: "Search items" });
    await userEvent.fill(input, "gra");
    await expect.element(page.getByRole("option", { name: "Grape" })).toBeVisible();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect.element(input).toHaveValue("Grape");
    await unmount(view);
  });
  test("adds and removes combobox multiple values without losing the input", async () => {
    const view = mount(ComboboxExample, { target: document.body });
    const input = page.getByRole("combobox", { name: "Select a item" });
    await input.click();
    await userEvent.fill(input, "banana");
    await page.getByRole("option", { name: "Banana" }).click();
    await expect.element(page.getByText("Banana", { exact: true })).toBeVisible();
    const bananaChip = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="combobox-chip"]'),
    ).find((chip) => chip.textContent?.includes("Banana"));
    bananaChip?.querySelector<HTMLButtonElement>('[data-slot="combobox-chip-remove"]')?.click();
    await expect
      .poll(() => document.querySelectorAll('[data-slot="combobox-chip"]'))
      .toHaveLength(2);
    await unmount(view);
  });
  test("supports multiple select keyboard selection and escape dismissal", async () => {
    const view = mount(SelectExample, { target: document.body });
    const trigger = page.getByRole("combobox", { name: "Select languages" });
    trigger.element().focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByRole("option", { name: "Python" })).toBeVisible();
    await userEvent.keyboard("{End}{ArrowUp} ");
    await userEvent.keyboard("{Escape}");
    await expect.element(trigger).toHaveFocus();
    await unmount(view);
  });
  test("opens command palette from its global shortcut and closes on selection", async () => {
    const view = mount(CommandExample, { target: document.body });
    await userEvent.keyboard("{Control>}j{/Control}");
    await expect.element(page.getByRole("dialog")).toBeVisible();
    const input = page.getByPlaceholder("Search for apps and commands...");
    await userEvent.fill(input, "Linear");
    await page.getByRole("option", { name: /Linear/ }).click();
    await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull();
    await unmount(view);
  });
  test("operates menu checkbox, radio, and nested submenu with keyboard", async () => {
    const view = mount(MenuExample, { target: document.body });
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    const shuffle = page.getByRole("menuitemcheckbox", { name: "Shuffle" });
    await shuffle.click();
    await expect.element(shuffle).toHaveAttribute("aria-checked", "true");
    const add = page.getByRole("menuitem", { name: "Add to Playlist" });
    add.element().focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByRole("menuitem", { name: "Jazz" })).toBeVisible();
    await userEvent.keyboard("{Escape}{Escape}");
    await expect.element(trigger).toHaveFocus();
    await unmount(view);
  });
  test("opens a context menu at the pointer and dismisses it with escape", async () => {
    const view = mount(ContextMenuExample, { target: document.body });
    const region = page.getByText("Right click here", { exact: true });
    region
      .element()
      .dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, button: 2, clientX: 80, clientY: 64 }),
      );
    await expect.element(page.getByRole("menuitem", { name: "Back" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect.poll(() => document.querySelector('[role="menuitem"]')).toBeNull();
    await unmount(view);
  });
  test("keeps the toolbar one keyboard sequence with named controls", async () => {
    const view = mount(ToolbarExample, { target: document.body });
    const left = page.getByRole("button", { name: "Align left" });
    left.element().focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByRole("button", { name: "Align center" })).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect.element(page.getByRole("button", { name: "Save" })).toHaveFocus();
    await unmount(view);
  });
});
