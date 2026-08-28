import { hydrate, tick, type Component, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Calendar from "./calendar.svelte";
import CalendarFixture from "./calendar.browser-fixture.svelte";
import { CALENDAR_SSR_FIXTURE_GZIP_BASE64 } from "./calendar.ssr-fixture.js";
import type { CalendarSingleProps } from "./calendar.types.js";

const SingleCalendar = Calendar as Component<CalendarSingleProps>;

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Calendar browser contract", () => {
  test("selects single, multiple, and range values while blocking unavailable days", async () => {
    render(CalendarFixture);
    const calendar = page.getByTestId("interactive-calendar");

    const day16 = calendar.getByRole("button", { name: /Friday, January 16th, 2026/ });
    await day16.click();
    await expect.element(page.getByTestId("selection")).toHaveTextContent("2026-01-16");
    await expect
      .element(
        calendar.getByRole("button", {
          name: "Friday, January 16th, 2026, selected",
          exact: true,
        }),
      )
      .toBeInTheDocument();
    await expect
      .element(page.getByTestId("callback-evidence"))
      .toHaveTextContent("select:16:false:click|day:16:false:click");

    await page.getByTestId("multiple-mode").click();
    await day16.click();
    await calendar.getByRole("button", { name: /Saturday, January 17th, 2026/ }).click();
    await expect.element(page.getByTestId("selection")).toHaveTextContent("2026-01-16");
    await expect.element(page.getByTestId("selection")).toHaveTextContent("2026-01-17");

    const unavailable = calendar.getByRole("button", { name: /Tuesday, January 20th, 2026/ });
    await expect.element(unavailable).toBeDisabled();
    await expect
      .element(unavailable)
      .toHaveAttribute("aria-label", "Tuesday, January 20th, 2026, unavailable");

    await page.getByTestId("range-mode").click();
    await calendar.getByRole("button", { name: /Thursday, January 22nd, 2026/ }).click();
    expect(
      page
        .getByTestId("interactive-calendar")
        .getByRole("button", { name: /Thursday, January 15th, 2026/ })
        .element()
        .closest("td"),
    ).toHaveClass("range-start");
    expect(
      page
        .getByTestId("interactive-calendar")
        .getByRole("button", { name: /Thursday, January 22nd, 2026/ })
        .element()
        .closest("td"),
    ).toHaveClass("range-end");
  });

  test("implements the complete calendar grid keyboard model and month paging", async () => {
    render(CalendarFixture);
    const day15 = page
      .getByTestId("interactive-calendar")
      .getByRole("button", { name: /Thursday, January 15th, 2026/ });
    day15.element().focus();
    await expect
      .poll(() => day15.element().closest("td")?.getAttribute("data-focused"))
      .toBe("true");
    expect(day15.element().closest("td")).toHaveClass("rdp-focused");

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
      "Sunday, January 11th, 2026",
    );
    await userEvent.keyboard("{End}");
    expect(document.activeElement?.getAttribute("aria-label")).toContain(
      "Saturday, January 17th, 2026",
    );
    await userEvent.keyboard("{PageDown}");
    await expect.element(page.getByTestId("month")).toHaveTextContent("2026-2");
    expect(document.activeElement?.getAttribute("aria-label")).toContain(
      "Tuesday, February 17th, 2026",
    );
    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
    await expect.element(page.getByTestId("month")).toHaveTextContent("2025-2");
  });

  test("navigates captions and restores focus through the Shards popover composition contract", async () => {
    render(CalendarFixture);
    const calendar = page.getByTestId("interactive-calendar");
    const next = calendar.getByRole("button", { name: "Go to the Next Month" });
    await next.click();
    await expect.element(page.getByTestId("month")).toHaveTextContent("2026-2");
    await calendar.getByRole("button", { name: "Go to the Previous Month" }).click();
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

    const activeButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        '[aria-label="Interactive calendar"] button[data-calendar-date][tabindex="0"]',
      ),
    );
    expect(activeButtons).toHaveLength(1);
    expect(activeButtons[0]?.disabled).toBe(false);
  });

  test("gives disabled selections and exhausted navigation an enabled roving target", async () => {
    render(CalendarFixture);

    const disabledRoot = page.getByTestId("disabled-focus-calendar").element();
    const disabledTargets = disabledRoot.querySelectorAll<HTMLButtonElement>(
      'button[data-calendar-date][tabindex="0"]',
    );
    expect(disabledTargets).toHaveLength(1);
    expect(disabledTargets[0]?.disabled).toBe(false);
    expect(disabledTargets[0]?.getAttribute("data-calendar-date")).not.toBe("2026-01-15");

    const exhaustionRoot = page.getByTestId("exhaustion-calendar").element();
    const initial = exhaustionRoot.querySelector<HTMLButtonElement>(
      'button[data-calendar-date="2026-01-15"]',
    );
    if (!initial) throw new Error("Exhaustion fixture did not render its focus target");
    initial.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(initial);
    expect(initial).toHaveAttribute("tabindex", "0");
    expect(initial.disabled).toBe(false);
  });

  test("clamps an externally controlled month and preserves one enabled roving target", async () => {
    render(CalendarFixture);
    await page.getByTestId("external-out-of-bounds-month").click();

    const root = page.getByTestId("interactive-calendar").element();
    await expect
      .poll(() => root.querySelector('table[role="grid"]')?.getAttribute("aria-label"))
      .toBe("December 2027");
    const targets = root.querySelectorAll<HTMLButtonElement>(
      'button[data-calendar-date][tabindex="0"]',
    );
    expect(targets).toHaveLength(1);
    expect(targets[0]?.disabled).toBe(false);
  });

  test("keeps ignored controlled values rendered while bound values update", async () => {
    render(CalendarFixture);

    const controlledSelection = page.getByTestId("controlled-selection-calendar");
    await controlledSelection.getByRole("button", { name: /Friday, January 16th, 2026/ }).click();
    await expect
      .element(page.getByTestId("controlled-selection-callback"))
      .toHaveTextContent("2026-01-16");
    await expect
      .element(
        controlledSelection.getByRole("button", {
          name: "Thursday, January 15th, 2026, selected",
          exact: true,
        }),
      )
      .toBeInTheDocument();

    const controlledMonth = page.getByTestId("controlled-month-calendar");
    await controlledMonth.getByRole("button", { name: "Go to the Next Month" }).click();
    await expect
      .element(page.getByTestId("controlled-month-callback"))
      .toHaveTextContent("2026-02-01");
    await expect
      .element(controlledMonth.getByRole("grid", { name: "January 2026" }))
      .toBeInTheDocument();

    const boundSelectionRoot = page.getByTestId("bound-selection-calendar");
    await boundSelectionRoot.getByRole("button", { name: /Friday, January 16th, 2026/ }).click();
    await expect.element(page.getByTestId("bound-selection")).toHaveTextContent("2026-01-16");

    const boundMonthRoot = page.getByTestId("bound-month-calendar");
    await boundMonthRoot.getByRole("button", { name: "Go to the Next Month" }).click();
    await expect.element(page.getByTestId("bound-month")).toHaveTextContent("2026-2");
  });

  test("returns noon-safe bound and callback values in every selection mode", async () => {
    render(CalendarFixture);

    await page
      .getByTestId("noon-single-calendar")
      .getByRole("button", { name: /Monday, December 29th, 2025/ })
      .click();
    await page
      .getByTestId("noon-multiple-calendar")
      .getByRole("button", { name: /Tuesday, December 30th, 2025/ })
      .click();
    await page
      .getByTestId("noon-range-calendar")
      .getByRole("button", { name: /Wednesday, December 31st, 2025/ })
      .click();

    await expect
      .element(page.getByTestId("noon-evidence"))
      .toHaveTextContent("single:12|multiple:12|range:12:12");
  });

  test("lets DayButton and WeekNumber replace their host elements with complete props", async () => {
    render(CalendarFixture);
    const root = page.getByTestId("override-calendar").element();

    expect(root.querySelectorAll("button button")).toHaveLength(0);
    expect(root.querySelectorAll("th th")).toHaveLength(0);
    const customDay = root.querySelector<HTMLButtonElement>(
      'button[data-custom-day-button][data-calendar-date="2026-01-15"]',
    );
    if (!customDay) throw new Error("Custom DayButton did not receive the host attributes");
    expect(customDay.getAttribute("aria-label")).toContain("Thursday, January 15th, 2026");
    await customDay.click();
    await expect.element(page.getByTestId("override-evidence")).toHaveTextContent("15:false:click");

    const customWeek = root.querySelector<HTMLElement>("th[data-custom-week-number]");
    expect(customWeek).not.toBeNull();
    expect(customWeek).toHaveAttribute("role", "rowheader");
    expect(customWeek?.textContent?.trim()).toMatch(/^\d+$/);
  });

  test("anchors cross-year dropdown changes to chronological month identity when reversed", async () => {
    render(CalendarFixture);
    const root = page.getByTestId("reverse-calendar").element();
    const grids = () => Array.from(root.querySelectorAll<HTMLTableElement>('table[role="grid"]'));
    expect(grids().map((grid) => grid.getAttribute("aria-label"))).toEqual([
      "January 2027",
      "December 2026",
    ]);
    expect(root.querySelectorAll('button[data-calendar-date][tabindex="0"]')).toHaveLength(1);

    const firstMonth = root.querySelector<HTMLSelectElement>(
      'select[aria-label="Choose the Month"]',
    );
    if (!firstMonth) throw new Error("Reverse-month fixture did not render a month dropdown");
    firstMonth.value = "1";
    firstMonth.dispatchEvent(new Event("change", { bubbles: true }));
    await expect.poll(() => grids()[0]?.getAttribute("aria-label")).toBe("February 2027");
    expect(grids()[1]?.getAttribute("aria-label")).toBe("January 2027");

    const firstYear = root.querySelector<HTMLSelectElement>('select[aria-label="Choose the Year"]');
    if (!firstYear) throw new Error("Reverse-month fixture did not render a year dropdown");
    firstYear.value = "2028";
    firstYear.dispatchEvent(new Event("change", { bubbles: true }));
    await expect.poll(() => grids()[0]?.getAttribute("aria-label")).toBe("February 2028");
    expect(grids()[1]?.getAttribute("aria-label")).toBe("January 2028");
  });

  test("hydrates the server-rendered time-zone calendar at a frozen date boundary", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T01:30:00.000Z"));
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const props = {
      defaultSelected: new Date("2025-12-30T20:00:00.000Z"),
      defaultMonth: new Date("2026-01-01T01:30:00.000Z"),
      mode: "single",
      noonSafe: true,
      timeZone: "America/Los_Angeles",
    } satisfies CalendarSingleProps;
    const target = document.createElement("div");
    const compressed = Uint8Array.from(atob(CALENDAR_SSR_FIXTURE_GZIP_BASE64), (char) =>
      char.charCodeAt(0),
    );
    const reader = new Blob([compressed])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"))
      .getReader();
    const decoder = new TextDecoder();
    let serverHtml = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      serverHtml += decoder.decode(value, { stream: true });
    }
    target.innerHTML = serverHtml + decoder.decode();
    document.body.append(target);

    const component = hydrate(SingleCalendar, { props, target });
    try {
      await tick();
      await tick();
      expect(warning).not.toHaveBeenCalled();
      const todayCell = target.querySelector<HTMLElement>('[data-today="true"]');
      expect(todayCell).not.toBeNull();
      expect(todayCell?.getAttribute("data-day")).toBe("2025-12-31");
      const defaultSelectedCell = target.querySelector<HTMLElement>('[data-day="2025-12-30"]');
      expect(defaultSelectedCell).toHaveAttribute("data-selected", "true");
      const todayButton = todayCell?.querySelector<HTMLButtonElement>("button");
      if (!todayButton)
        throw new Error("Hydrated time-zone calendar did not render today's button");
      todayButton.click();
      await vi.waitFor(() => expect(todayCell).toHaveAttribute("data-selected", "true"));
    } finally {
      await unmount(component);
      warning.mockRestore();
      vi.useRealTimers();
    }
  });
});
