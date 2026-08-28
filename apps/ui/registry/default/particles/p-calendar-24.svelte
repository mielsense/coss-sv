<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-24",
    interactive: true,
    responsive: true,
    title: "Calendar flight prices",
    colSpan: 2,
  });
</script>

<script lang="ts">
  import { Calendar, cn, type CalendarDayButtonProps } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>(today);
  const key = (value: Date) =>
    `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  const prices: Record<string, number> = Object.fromEntries(
    Array.from({ length: 180 }, (_, index) => {
      const current = new Date(2026, 7, 28 + index, 12);
      return [key(current), 80 + ((index * 47) % 121)];
    }),
  );
</script>

{#snippet dayButton(props: CalendarDayButtonProps)}
  {const price = prices[key(props.day.date)]}
  <button {...props} type="button"
    ><span class="flex flex-col"
      >{@render props.children()}{#if price}<span
          class={cn(
            "font-normal text-xs",
            price < 100
              ? "text-emerald-500"
              : "in-data-selected:text-primary-foreground/70 text-muted-foreground",
          )}>${price}</span
        >{/if}</span
    ></button
  >
{/snippet}

<Calendar
  classNames={{
    day_button: "size-12",
    month:
      "relative first-of-type:before:hidden before:absolute max-md:before:inset-x-2 max-md:before:h-px max-md:before:-top-4 md:before:inset-y-2 md:before:w-px before:bg-border md:before:-left-4",
    months: "sm:flex-col md:flex-row gap-8",
    today: "*:after:hidden",
    weekday: "w-12",
  }}
  components={{ DayButton: dayButton }}
  disabled={(value) => !prices[key(value)]}
  mode="single"
  numberOfMonths={2}
  bind:selected={date}
  pagedNavigation
  showOutsideDays={false}
  {today}
/>
