import { hydrate, tick, type Component, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Calendar from "./calendar.svelte";
import CalendarComponentsFixture from "./calendar-components.browser-fixture.svelte";
import CalendarFixture from "./calendar.browser-fixture.svelte";
import { CALENDAR_SSR_FIXTURE_GZIP_BASE64 } from "./calendar.ssr-fixture.js";
import type { CalendarSingleProps } from "./calendar.types.js";

const SingleCalendar = Calendar as Component<CalendarSingleProps>;

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Calendar browser contract", () => {
  test("delegates every DayPicker host without nested duplicate elements", async () => {
    render(CalendarComponentsFixture);
    const root = page.getByTestId("all-calendar-components").element();

    for (const attribute of [
      "data-custom-root",
      "data-custom-months",
      "data-custom-month",
      "data-custom-month-caption",
      "data-custom-caption-label",
      "data-custom-dropdown-nav",
      "data-custom-select",
      "data-custom-option",
      "data-custom-chevron",
      "data-custom-nav",
      "data-custom-previous",
      "data-custom-next",
      "data-custom-month-grid",
      "data-custom-weekdays",
      "data-custom-week-number-header",
      "data-custom-weekday",
      "data-custom-weeks",
      "data-custom-week",
      "data-custom-week-number",
      "data-custom-day",
      "data-custom-day-button",
      "data-custom-footer",
    ]) {
      expect(root.querySelector(`[${attribute}]`), attribute).not.toBeNull();
    }
    expect(root.querySelectorAll("button button")).toHaveLength(0);
    expect(root.querySelectorAll("td td")).toHaveLength(0);
    expect(root.querySelectorAll("th th")).toHaveLength(0);

    const next = root.querySelector<HTMLButtonElement>("[data-custom-next]");
    if (!next) throw new Error("Custom next-month button was not rendered");
    await next.click();
    await expect
      .poll(() => root.querySelector("[data-custom-month-grid]")?.getAttribute("aria-label"))
      .toBe("February 2026");

    const generic = page.getByTestId("generic-calendar-dropdown").element();
    expect(generic.querySelectorAll("[data-custom-dropdown]")).toHaveLength(2);
    const specific = page.getByTestId("specific-calendar-dropdowns").element();
    expect(specific.querySelector("[data-custom-months-dropdown]")).not.toBeNull();
    expect(specific.querySelector("[data-custom-years-dropdown]")).not.toBeNull();
    expect(specific.querySelector("[data-custom-dropdown]")).toBeNull();
  });

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

  test("retains the last focused day as the roving target after focus leaves the grid", async () => {
    render(CalendarFixture);
    const root = page.getByTestId("interactive-calendar").element();
    const day17 = root.querySelector<HTMLButtonElement>('button[data-calendar-date="2026-01-17"]');
    if (!day17) throw new Error("Calendar did not render the last-focused regression day");

    day17.focus();
    page.getByTestId("single-mode").element().focus();
    await tick();

    expect(day17).toHaveAttribute("tabindex", "0");
    expect(
      root.querySelectorAll<HTMLButtonElement>('button[data-calendar-date][tabindex="0"]'),
    ).toHaveLength(1);
  });

  test("cancels every handled grid-navigation key before it reaches an ancestor", async () => {
    render(CalendarFixture);
    const root = page.getByTestId("keyboard-propagation-calendar").element();
    const day15 = root.querySelector<HTMLButtonElement>('button[data-calendar-date="2026-01-15"]');
    if (!day15) throw new Error("Calendar did not render the keyboard propagation target");

    for (const key of [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ]) {
      const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key });
      day15.dispatchEvent(event);
      expect(event.defaultPrevented, `${key} should be prevented`).toBe(true);
    }

    await expect.element(page.getByTestId("ancestor-key-count")).toHaveTextContent("0");
  });

  test("orders native and custom caption dropdowns using the locale month-year convention", () => {
    render(CalendarFixture);
    const japaneseNative = page.getByTestId("japanese-native-dropdown-calendar").element();
    const japaneseNativeOrder = Array.from(japaneseNative.querySelectorAll("select")).map((node) =>
      node.getAttribute("aria-label"),
    );
    const japaneseCustom = page.getByTestId("japanese-custom-dropdown-calendar").element();
    const japaneseCustomOrder = Array.from(
      japaneseCustom.querySelectorAll<HTMLElement>("[data-locale-dropdown]"),
    ).map((node) => node.dataset.localeDropdown);
    const englishCustom = page.getByTestId("english-custom-dropdown-calendar").element();
    const englishCustomOrder = Array.from(
      englishCustom.querySelectorAll<HTMLElement>("[data-locale-dropdown]"),
    ).map((node) => node.dataset.localeDropdown);

    expect(japaneseNativeOrder).toEqual(["Choose the Year", "Choose the Month"]);
    expect(japaneseCustomOrder).toEqual(["year", "month"]);
    expect(englishCustomOrder).toEqual(["month", "year"]);
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

  test("keeps ignored controlled values rendered while parent-managed values update", async () => {
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

  test("uses the live DayPicker controlled-state matrix", async () => {
    render(CalendarFixture);

    const undefinedControlled = page.getByTestId("undefined-controlled-selection-calendar");
    await undefinedControlled.getByRole("button", { name: /Thursday, January 15th, 2026/ }).click();
    await expect
      .element(page.getByTestId("undefined-controlled-selection-callback"))
      .toHaveTextContent("2026-01-15");
    expect(undefinedControlled.element().querySelectorAll("[data-selected=true]")).toHaveLength(0);

    const bareMonth = page.getByTestId("month-without-callback-calendar");
    await bareMonth.getByRole("button", { name: "Go to the Next Month" }).click();
    await expect.element(bareMonth.getByRole("grid", { name: "January 2026" })).toBeInTheDocument();

    const dynamicSelectionRoot = page.getByTestId("dynamic-selection-calendar");
    await dynamicSelectionRoot
      .getByRole("button", { name: /Thursday, January 15th, 2026/ })
      .click();
    await expect.element(page.getByTestId("dynamic-selection")).toHaveTextContent("2026-01-15");
    await page.getByTestId("toggle-dynamic-selection-control").click();
    await dynamicSelectionRoot.getByRole("button", { name: /Friday, January 16th, 2026/ }).click();
    await expect
      .element(page.getByTestId("dynamic-selection-callback"))
      .toHaveTextContent("2026-01-16");
    await expect.element(page.getByTestId("dynamic-selection")).toHaveTextContent("2026-01-15");
    await page.getByTestId("toggle-dynamic-selection-control").click();
    await dynamicSelectionRoot.getByRole("button", { name: /Friday, January 16th, 2026/ }).click();
    await expect.element(page.getByTestId("dynamic-selection")).toHaveTextContent("2026-01-16");

    const dynamicMonthRoot = page.getByTestId("dynamic-month-calendar");
    await dynamicMonthRoot.getByRole("button", { name: "Go to the Next Month" }).click();
    await expect
      .element(dynamicMonthRoot.getByRole("grid", { name: "February 2026" }))
      .toBeInTheDocument();
    await expect.element(page.getByTestId("dynamic-month")).toHaveTextContent("2026-2");
    await page.getByTestId("toggle-dynamic-month-control").click();
    await expect
      .element(dynamicMonthRoot.getByRole("grid", { name: "February 2026" }))
      .toBeInTheDocument();
    await dynamicMonthRoot.getByRole("button", { name: "Go to the Next Month" }).click();
    await expect
      .element(page.getByTestId("dynamic-month-callback"))
      .toHaveTextContent("2026-03-01");
    await expect
      .element(dynamicMonthRoot.getByRole("grid", { name: "February 2026" }))
      .toBeInTheDocument();
    await expect.element(page.getByTestId("dynamic-month")).toHaveTextContent("2026-2");
    await page.getByTestId("toggle-dynamic-month-control").click();
    await dynamicMonthRoot.getByRole("button", { name: "Go to the Next Month" }).click();
    await expect
      .element(dynamicMonthRoot.getByRole("grid", { name: "March 2026" }))
      .toBeInTheDocument();
    await expect.element(page.getByTestId("dynamic-month")).toHaveTextContent("2026-3");
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
      .toHaveTextContent(
        "single:2025-12-29:12|multiple:2025-12-30:12|range:2025-12-31–2025-12-31:12:12",
      );
    const noonSingleRoot = page.getByTestId("noon-single-calendar").element();
    await expect
      .poll(() =>
        Array.from(noonSingleRoot.querySelectorAll<HTMLElement>("[data-selected=true]")).map(
          (cell) => cell.querySelector("button")?.getAttribute("aria-label"),
        ),
      )
      .toEqual(["Monday, December 29th, 2025, selected"]);

    await page
      .getByTestId("opposite-single-calendar")
      .getByRole("button", { name: /Monday, January 5th, 2026/ })
      .click();
    await page
      .getByTestId("opposite-multiple-calendar")
      .getByRole("button", { name: /Tuesday, January 6th, 2026/ })
      .click();
    await page
      .getByTestId("opposite-range-calendar")
      .getByRole("button", { name: /Wednesday, January 7th, 2026/ })
      .click();
    await expect
      .element(page.getByTestId("opposite-evidence"))
      .toHaveTextContent(
        "single:2026-01-05:12|multiple:2026-01-06:12|range:2026-01-07–2026-01-07:12:12",
      );
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
    await expect.poll(() => grids()[0]?.getAttribute("aria-label")).toBe("March 2027");
    expect(grids()[1]?.getAttribute("aria-label")).toBe("February 2027");

    const firstYear = root.querySelector<HTMLSelectElement>('select[aria-label="Choose the Year"]');
    if (!firstYear) throw new Error("Reverse-month fixture did not render a year dropdown");
    firstYear.value = "2028";
    firstYear.dispatchEvent(new Event("change", { bubbles: true }));
    await expect.poll(() => grids()[0]?.getAttribute("aria-label")).toBe("April 2028");
    expect(grids()[1]?.getAttribute("aria-label")).toBe("March 2028");
  });

  test("hydrates the server-rendered time-zone calendar at a frozen date boundary", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T01:30:00.000Z"));
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const props = {
      defaultMonth: new Date("2026-01-01T01:30:00.000Z"),
      mode: "single",
      noonSafe: true,
      selected: new Date("2025-12-30T20:00:00.000Z"),
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
    const serverNavigationGlyphs = target.querySelectorAll<SVGSVGElement>(
      '[data-slot="calendar-nav"] svg',
    );
    expect(serverNavigationGlyphs).toHaveLength(2);
    for (const glyph of serverNavigationGlyphs) {
      expect(glyph).toHaveClass("rdp-chevron", "rtl:rotate-180");
    }

    const component = hydrate(SingleCalendar, { props, target });
    try {
      await tick();
      await tick();
      expect(warning).not.toHaveBeenCalled();
      const navigationGlyphs = target.querySelectorAll<SVGSVGElement>(
        '[data-slot="calendar-nav"] svg',
      );
      expect(navigationGlyphs).toHaveLength(2);
      for (const glyph of navigationGlyphs) {
        expect(glyph).toHaveClass("rdp-chevron", "rtl:rotate-180");
      }
      const todayCell = target.querySelector<HTMLElement>('[data-today="true"]');
      expect(todayCell).not.toBeNull();
      expect(todayCell?.getAttribute("data-day")).toBe("2025-12-31");
      const selectedCell = target.querySelector<HTMLElement>('[data-day="2025-12-30"]');
      expect(selectedCell).toHaveAttribute("data-selected", "true");
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
