function ordinalSuffix(day: number): string {
  const lastTwoDigits = day % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";

  if (day % 10 === 1) return "st";
  if (day % 10 === 2) return "nd";
  if (day % 10 === 3) return "rd";
  return "th";
}

/** Matches date-fns `format(date, "PPP")` with its default en-US locale. */
export function formatDatePpp(date: Date): string {
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
  const day = date.getDate();
  return `${month} ${day}${ordinalSuffix(day)}, ${date.getFullYear()}`;
}
