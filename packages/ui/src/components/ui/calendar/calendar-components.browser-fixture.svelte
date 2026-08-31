<script lang="ts">
  import Calendar from "./calendar.svelte";
  import type {
    CalendarCaptionLabelProps,
    CalendarChevronContext,
    CalendarDayButtonProps,
    CalendarDayProps,
    CalendarDropdownContext,
    CalendarDropdownNavContext,
    CalendarFooterProps,
    CalendarMonthCaptionProps,
    CalendarMonthGridProps,
    CalendarMonthProps,
    CalendarMonthsProps,
    CalendarNavigationButtonProps,
    CalendarNavProps,
    CalendarOptionProps,
    CalendarRootComponentProps,
    CalendarSelectProps,
    CalendarWeekdayProps,
    CalendarWeekdaysProps,
    CalendarWeekNumberHeaderProps,
    CalendarWeekNumberProps,
    CalendarWeekProps,
    CalendarWeeksProps,
  } from "./calendar.types.js";
</script>

{#snippet root(props: CalendarRootComponentProps)}
  <div data-custom-root>{@render props.children()}</div>
{/snippet}

{#snippet months(props: CalendarMonthsProps)}
  <div data-custom-months>{@render props.children()}</div>
{/snippet}

{#snippet month(props: CalendarMonthProps)}
  <div data-custom-month={props.calendarMonth.date.getMonth()} data-index={props.displayIndex}>
    {@render props.children()}
  </div>
{/snippet}

{#snippet monthCaption(props: CalendarMonthCaptionProps)}
  <div data-custom-month-caption>{@render props.children()}</div>
{/snippet}

{#snippet captionLabel(props: CalendarCaptionLabelProps)}
  <span data-custom-caption-label>{@render props.children()}</span>
{/snippet}

{#snippet dropdownNav(props: CalendarDropdownNavContext)}
  <div data-custom-dropdown-nav>{@render props.children()}</div>
{/snippet}

{#snippet select(props: CalendarSelectProps)}
  <select
    aria-label={props["aria-label"]}
    data-custom-select
    disabled={props.disabled}
    onchange={props.onchange}
    value={props.value}
  >
    {@render props.children()}
  </select>
{/snippet}

{#snippet option(props: CalendarOptionProps)}
  <option data-custom-option disabled={props.disabled} value={props.value}>
    {@render props.children()}
  </option>
{/snippet}

{#snippet chevron(props: CalendarChevronContext)}
  <span data-custom-chevron={props.orientation}></span>
{/snippet}

{#snippet nav(props: CalendarNavProps)}
  <nav data-custom-nav>{@render props.children()}</nav>
{/snippet}

{#snippet previousButton(props: CalendarNavigationButtonProps)}
  <button data-custom-previous onclick={props.onclick} type="button"
    >{@render props.children()}</button
  >
{/snippet}

{#snippet nextButton(props: CalendarNavigationButtonProps)}
  <button data-custom-next onclick={props.onclick} type="button">{@render props.children()}</button>
{/snippet}

{#snippet monthGrid(props: CalendarMonthGridProps)}
  <!-- biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: WAI-ARIA calendar grids use role=grid on the semantic table. -->
  <table aria-label={props["aria-label"]} data-custom-month-grid role="grid">
    {@render props.children()}
  </table>
{/snippet}

{#snippet weekdays(props: CalendarWeekdaysProps)}
  <thead aria-hidden="true" data-custom-weekdays><tr>{@render props.children()}</tr></thead>
{/snippet}

{#snippet weekNumberHeader(props: CalendarWeekNumberHeaderProps)}
  <th data-custom-week-number-header>{@render props.children()}</th>
{/snippet}

{#snippet weekday(props: CalendarWeekdayProps)}
  <th data-custom-weekday={props.weekday.getDay()}>{@render props.children()}</th>
{/snippet}

{#snippet weeks(props: CalendarWeeksProps)}
  <tbody data-custom-weeks>{@render props.children()}</tbody>
{/snippet}

{#snippet week(props: CalendarWeekProps)}
  <tr data-custom-week={props.week.weekNumber}>{@render props.children()}</tr>
{/snippet}

{#snippet weekNumber(props: CalendarWeekNumberProps)}
  <th data-custom-week-number={props.week.weekNumber}>{@render props.children()}</th>
{/snippet}

{#snippet day(props: CalendarDayProps)}
  <td data-custom-day={props.day.date.getDate()}>{@render props.children()}</td>
{/snippet}

{#snippet dayButton(props: CalendarDayButtonProps)}
  <button
    aria-label={props["aria-label"]}
    data-calendar-date={props["data-calendar-date"]}
    data-custom-day-button
    disabled={props.disabled}
    onclick={props.onclick}
    tabindex={props.tabindex}
    type="button"
  >
    {@render props.children()}
  </button>
{/snippet}

{#snippet footer(props: CalendarFooterProps)}
  <div data-custom-footer>{@render props.children()}</div>
{/snippet}

{#snippet dropdown(props: CalendarDropdownContext)}
  <span data-custom-dropdown={props.kind}>{props.value}</span>
{/snippet}

{#snippet monthsDropdown(props: CalendarDropdownContext)}
  <span data-custom-months-dropdown>{props.value}</span>
{/snippet}

{#snippet yearsDropdown(props: CalendarDropdownContext)}
  <span data-custom-years-dropdown>{props.value}</span>
{/snippet}

<div data-testid="all-calendar-components">
  <Calendar
    captionLayout="dropdown"
    components={{
      CaptionLabel: captionLabel,
      Chevron: chevron,
      Day: day,
      DayButton: dayButton,
      DropdownNav: dropdownNav,
      Footer: footer,
      Month: month,
      MonthCaption: monthCaption,
      MonthGrid: monthGrid,
      Months: months,
      Nav: nav,
      NextMonthButton: nextButton,
      Option: option,
      PreviousMonthButton: previousButton,
      Root: root,
      Select: select,
      Week: week,
      Weekday: weekday,
      Weekdays: weekdays,
      WeekNumber: weekNumber,
      WeekNumberHeader: weekNumberHeader,
      Weeks: weeks,
    }}
    defaultMonth={new Date(2026, 0, 1)}
    endMonth={new Date(2027, 11, 1)}
    footer="Calendar status"
    showWeekNumber
    startMonth={new Date(2025, 0, 1)}
  />
</div>

<div data-testid="generic-calendar-dropdown">
  <Calendar
    captionLayout="dropdown"
    components={{ Dropdown: dropdown }}
    defaultMonth={new Date(2026, 0, 1)}
  />
</div>

<div data-testid="specific-calendar-dropdowns">
  <Calendar
    captionLayout="dropdown"
    components={{
      Dropdown: dropdown,
      MonthsDropdown: monthsDropdown,
      YearsDropdown: yearsDropdown,
    }}
    defaultMonth={new Date(2026, 0, 1)}
  />
</div>
