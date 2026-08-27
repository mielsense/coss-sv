import { expect, test } from "@playwright/test";
import { monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("keeps the exact nested member defaults across edit, Cancel, and reopen", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "light", "The structural Drawer contract is theme-neutral.");
  const guard = monitorConsole(page);
  const { ready } = await openReadyPreview(page, "drawer", "light", "desktop");

  const nestedParticle = ready.locator('[data-particle="p-drawer-8"]');
  await nestedParticle.getByRole("button", { name: "Nested inset drawers" }).click();
  const nestedTrigger = page.getByRole("button", { name: "Edit details" });
  await nestedTrigger.click();
  const editDialog = page.getByRole("dialog", { name: "Edit details" });
  const name = editDialog.getByRole("textbox", { name: "Name" });
  const email = editDialog.getByRole("textbox", { name: "Email" });
  await expect(name).toHaveAttribute("type", "text");
  await expect(name).toHaveAttribute("value", "Bora Baloglu");
  await expect(name).toHaveAttribute("data-filled", "");
  await expect(name).toHaveAttribute("aria-labelledby", /.+/);
  await expect(name).toHaveValue("Bora Baloglu");
  await expect(email).toHaveAttribute("type", "email");
  await expect(email).toHaveAttribute("value", "bora@example.com");
  await expect(email).toHaveAttribute("data-filled", "");
  await expect(email).toHaveAttribute("aria-labelledby", /.+/);
  await expect(email).toHaveValue("bora@example.com");
  await name.fill("Edited Name");
  await email.fill("edited@example.com");
  await expect(name).toHaveValue("Edited Name");
  await expect(email).toHaveValue("edited@example.com");
  await editDialog.getByRole("button", { name: "Cancel" }).click();
  await expect(editDialog).not.toBeAttached();
  await expect(nestedTrigger).toBeFocused();
  await nestedTrigger.click();
  const reopened = page.getByRole("dialog", { name: "Edit details" });
  await expect(reopened.getByRole("textbox", { name: "Name" })).toHaveValue("Bora Baloglu");
  await expect(reopened.getByRole("textbox", { name: "Email" })).toHaveValue("bora@example.com");
  await reopened.getByRole("button", { name: "Cancel" }).click();
  guard.assertNoErrors();
});
