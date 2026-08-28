import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import CalendarFixture from "./calendar.browser-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Calendar browser contract", () => {
  test("selects single, multiple, and range values while blocking unavailable days", async () => {
    render(CalendarFixture);

    const day16 = page.getByRole("button", { name: /Friday, January 16th, 2026/ });
    await day16.click();
    await expect.element(page.getByTestId("selection")).toHaveTextContent("2026-01-16");
    await expect
      .element(day16)
      .toHaveAttribute("aria-label", "Friday, January 16th, 2026, selected");

    await page.getByTestId("multiple-mode").click();
    await day16.click();
    await page.getByRole("button", { name: /Saturday, January 17th, 2026/ }).click();
    await expect.element(page.getByTestId("selection")).toHaveTextContent("2026-01-16");
    await expect.element(page.getByTestId("selection")).toHaveTextContent("2026-01-17");

    const unavailable = page.getByRole("button", { name: /Tuesday, January 20th, 2026/ });
    await expect.element(unavailable).toBeDisabled();
    await expect
      .element(unavailable)
      .toHaveAttribute("aria-label", "Tuesday, January 20th, 2026, unavailable");

    await page.getByTestId("range-mode").click();
    await page.getByRole("button", { name: /Thursday, January 22nd, 2026/ }).click();
    expect(
      page
        .getByRole("button", { name: /Thursday, January 15th, 2026/ })
        .element()
        .closest("td"),
    ).toHaveClass("range-start");
    expect(
      page
        .getByRole("button", { name: /Thursday, January 22nd, 2026/ })
        .element()
        .closest("td"),
    ).toHaveClass("range-end");
  });

  test("implements the complete calendar grid keyboard model and month paging", async () => {
    render(CalendarFixture);
    const day15 = page.getByRole("button", { name: /Thursday, January 15th, 2026/ });
    day15.element().focus();

    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement?.getAttribute("aria-label")).toContain(
      "Friday, January 16th, 2026",
    );
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement?.getAttribute("aria-label")).toContain(
      "Friday, January 23rd, 2026",
    );
    await userEvent.keyboard("{Home}");
    expect(document.activeElement?.getAttribute("aria-label")).toContain(
      "Monday, January 19th, 2026",
    );
    await userEvent.keyboard("{End}");
    expect(document.activeElement?.getAttribute("aria-label")).toContain(
      "Saturday, January 24th, 2026",
    );
    await userEvent.keyboard("{PageDown}");
    await expect.element(page.getByTestId("month")).toHaveTextContent("2026-2");
    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
    await expect.element(page.getByTestId("month")).toHaveTextContent("2025-2");
  });

  test("navigates captions and restores focus through the Shards popover composition contract", async () => {
    render(CalendarFixture);
    const next = page.getByRole("button", { name: "Go to the Next Month" });
    await next.click();
    await expect.element(page.getByTestId("month")).toHaveTextContent("2026-2");
    await page.getByRole("button", { name: "Go to the Previous Month" }).click();
    await expect.element(page.getByTestId("month")).toHaveTextContent("2026-1");

    const trigger = page.getByTestId("date-picker-trigger");
    await trigger.click();
    const popup = page.getByTestId("date-picker-popup");
    await popup.getByRole("button", { name: /Friday, January 16th, 2026/ }).click();
    await expect.element(popup).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
  });

  test("changes the visible month and year through native caption dropdowns", async () => {
    render(CalendarFixture);
    const dropdowns = document.querySelectorAll<HTMLSelectElement>("select");
    const monthDropdown = dropdowns[0];
    if (!monthDropdown || !dropdowns[1])
      throw new Error("Calendar caption dropdowns did not render");

    monthDropdown.value = "2";
    monthDropdown.dispatchEvent(new Event("change", { bubbles: true }));
    await expect.element(page.getByTestId("month")).toHaveTextContent("2026-3");

    const yearDropdown = document.querySelectorAll<HTMLSelectElement>("select")[1];
    if (!yearDropdown) throw new Error("Calendar year dropdown did not render after month change");
    yearDropdown.value = "2027";
    yearDropdown.dispatchEvent(new Event("change", { bubbles: true }));
    await expect.element(page.getByTestId("month")).toHaveTextContent("2027-3");
  });
});
