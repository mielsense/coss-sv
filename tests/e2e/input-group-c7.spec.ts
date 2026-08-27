import { expect, test } from "@playwright/test";
import { monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("preserves the password value when the visibility control changes its type", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "The binding contract is theme-independent.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready } = await openReadyPreview(page, "input-group", theme, "desktop");
  const particle = ready.locator('[data-particle="p-input-group-26"]');
  const input = particle.getByRole("textbox", { name: "Password" });

  await input.fill("Abcdefg1");
  await expect(input).toHaveValue("Abcdefg1");
  await expect(particle.getByRole("progressbar", { name: "Password strength" })).toHaveAttribute(
    "aria-valuenow",
    "4",
  );
  await expect(particle).toContainText("Strong password");

  await particle.getByRole("button", { name: "Show password" }).click();
  await expect(input).toHaveAttribute("type", "text");
  await expect(input).toHaveValue("Abcdefg1");
  await expect(particle.getByRole("button", { name: "Hide password" })).toBeVisible();
  guard.assertNoErrors();
});
