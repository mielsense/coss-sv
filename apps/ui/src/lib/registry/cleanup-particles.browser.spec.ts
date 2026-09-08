import { mount, unmount } from "svelte";
import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import Database from "../../../registry/default/particles/p-breadcrumb-7.svelte";
import Currency from "../../../registry/default/particles/p-group-14.svelte";
import Code from "../../../registry/default/particles/p-input-group-27.svelte";
import ReadonlyTextarea from "../../../registry/default/particles/p-textarea-10.svelte";
import Profile from "../../../registry/default/particles/p-dialog-1.svelte";
import Project from "../../../registry/default/particles/p-card-1.svelte";
import Fruits from "../../../registry/default/particles/p-field-9.svelte";

test("clipboard failure keeps the copy action available and a later attempt succeeds", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const component = mount(Code, { target });
  const write = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockRejectedValueOnce(new Error("Denied"))
    .mockResolvedValue(undefined);
  try {
    await page.getByPlaceholder("Paste your code here…").fill("const answer = 42;");
    await page.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect.poll(() => write.mock.calls.length).toBe(1);
    await expect
      .element(page.getByRole("button", { name: "Copy code", exact: true }))
      .toBeVisible();
    await page.getByRole("button", { name: "Copy code", exact: true }).click();
    await expect.element(page.getByRole("button", { name: "Copied", exact: true })).toBeVisible();
    expect(write).toHaveBeenLastCalledWith("const answer = 42;");
  } finally {
    await unmount(component);
    target.remove();
    vi.restoreAllMocks();
  }
});

test("the field example keeps initial chips and adds an item through the list snippet", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const component = mount(Fruits, { target });
  try {
    expect(target.querySelectorAll("[data-slot=combobox-chip]")).toHaveLength(2);
    await page.getByRole("combobox").fill("Banana");
    await page.getByRole("option", { name: "Banana", exact: true }).click();
    await expect.poll(() => target.querySelectorAll("[data-slot=combobox-chip]").length).toBe(3);
  } finally {
    await unmount(component);
    target.remove();
  }
});

test("readonly textarea retains its default content", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const component = mount(ReadonlyTextarea, { target });
  try {
    expect(target.querySelector("textarea")?.value).toBe("This is a read-only textarea");
  } finally {
    await unmount(component);
    target.remove();
  }
});

test("default profile values reset with the form and when the popup remounts", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const component = mount(Profile, { target });
  try {
    await page.getByRole("button", { name: "Open Dialog", exact: true }).click();
    const name = page.getByRole("textbox", { name: "Name", exact: true });
    await expect.element(name).toHaveValue("Margaret Welsh");
    await name.fill("Updated");
    (await name.element()).closest("form")?.reset();
    await expect.element(name).toHaveValue("Margaret Welsh");
    await name.fill("Updated again");
    await userEvent.keyboard("{Escape}");
    await page.getByRole("button", { name: "Open Dialog", exact: true }).click();
    await expect.element(name).toHaveValue("Margaret Welsh");
  } finally {
    await unmount(component);
    target.remove();
  }
});

test("project framework defaults allow selection and preserve its selected state on reopen", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const component = mount(Project, { target });
  try {
    const trigger = page.getByRole("combobox");
    await expect.element(trigger).toHaveTextContent("Next.js");
    await trigger.click();
    await page.getByRole("option", { name: "Astro", exact: true }).click();
    await expect.element(trigger).toHaveTextContent("Astro");
    await trigger.click();
    await expect
      .element(page.getByRole("option", { name: "Astro", exact: true }))
      .toHaveAttribute("aria-selected", "true");
  } finally {
    await unmount(component);
    target.remove();
  }
});

test("breadcrumb default selects Orion and allows a new database", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const component = mount(Database, { target });
  try {
    const trigger = page.getByRole("combobox");
    await expect.element(trigger).toHaveTextContent("Orion");
    await trigger.click();
    await page.getByRole("option", { name: "Sigma", exact: true }).click();
    await expect.element(trigger).toHaveTextContent("Sigma");
  } finally {
    await unmount(component);
    target.remove();
  }
});

test("object currency defaults preserve selection after reopening", async () => {
  const target = document.createElement("div");
  document.body.append(target);
  const component = mount(Currency, { target });
  try {
    const trigger = page.getByRole("combobox");
    await expect.element(trigger).toHaveTextContent("$");
    await trigger.click();
    await page.getByRole("option", { name: "€ Euro", exact: true }).click();
    await expect.element(trigger).toHaveTextContent("€");
    await trigger.click();
    await expect
      .element(page.getByRole("option", { name: "€ Euro", exact: true }))
      .toHaveAttribute("aria-selected", "true");
  } finally {
    await unmount(component);
    target.remove();
  }
});
