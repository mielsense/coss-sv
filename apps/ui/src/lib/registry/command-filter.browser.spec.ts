import { mount, unmount } from "svelte";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import CommandPalette from "$particles/p-command-1.svelte";
import AICommandPalette from "$particles/p-command-2.svelte";

for (const scenario of [
  {
    component: CommandPalette,
    trigger: "Open Command Palette",
    query: "fig",
    match: "Figma",
    count: 10,
    hiddenGroup: "Commands",
  },
  {
    component: AICommandPalette,
    trigger: "Cmdk with AI",
    query: "docs",
    match: "Documentation",
    count: 9,
    hiddenGroup: "Pages",
  },
]) {
  test(`${scenario.trigger} filters groups, clears results, and executes a matching command`, async () => {
    const target = document.createElement("div");
    document.body.append(target);
    const component = mount(scenario.component, { target });
    try {
      await page.getByRole("button", { name: new RegExp(scenario.trigger) }).click();
      const input = page.getByRole("combobox");
      await expect
        .poll(() => document.querySelectorAll('[role="option"]').length)
        .toBe(scenario.count);
      await input.fill(scenario.query);
      await expect.poll(() => document.querySelectorAll('[role="option"]').length).toBe(1);
      await expect
        .element(page.getByRole("option", { name: new RegExp(scenario.match) }))
        .toBeVisible();
      await expect
        .element(page.getByRole("group", { name: scenario.hiddenGroup, exact: true }))
        .not.toBeInTheDocument();
      await input.fill("no-such-command");
      await expect.poll(() => document.querySelectorAll('[role="option"]').length).toBe(0);
      await expect.element(page.getByText("No results found.", { exact: true })).toBeVisible();
      await input.fill("");
      await expect
        .poll(() => document.querySelectorAll('[role="option"]').length)
        .toBe(scenario.count);
      await input.fill(scenario.query);
      await expect.poll(() => document.querySelectorAll('[role="option"]').length).toBe(1);
      (await input.element()).focus();
      await userEvent.keyboard("{ArrowDown}{Enter}");
      await expect.element(page.getByRole("dialog")).not.toBeInTheDocument();
    } finally {
      await unmount(component);
      target.remove();
    }
  });
}

test("grouped autocomplete filters tags and restores all groups when cleared", async () => {
  const { default: Tags } = await import("$particles/p-autocomplete-10.svelte");
  const target = document.createElement("div");
  document.body.append(target);
  const component = mount(Tags, { target });
  try {
    const input = page.getByRole("combobox", { name: "Search tags" });
    await input.fill("urgent");
    await expect.poll(() => document.querySelectorAll('[role="option"]').length).toBe(1);
    await expect.element(page.getByRole("option", { name: "Urgent", exact: true })).toBeVisible();
    await expect
      .element(page.getByRole("group", { name: "Status", exact: true }))
      .not.toBeInTheDocument();
    await input.fill("no-such-tag");
    await expect.poll(() => document.querySelectorAll('[role="option"]').length).toBe(0);
    await expect.element(page.getByText("No tags found.")).toBeVisible();
    await input.fill("");
    await userEvent.keyboard("{ArrowDown}");
    await expect.poll(() => document.querySelectorAll('[role="option"]').length).toBe(42);
    await input.fill("urgent");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect.element(input).toHaveValue("Urgent");
  } finally {
    await unmount(component);
    target.remove();
  }
});
