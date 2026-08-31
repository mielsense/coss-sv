<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  import { onMount } from "svelte";
  import { addCalendarDays } from "../lib/date-format.js";
  let date = $state<Date | undefined>(new Date());
  const key = (value: Date) =>
    `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  let prices = $state<Record<string, number>>({});

  onMount(() => {
    const start = new Date();
    prices = Object.fromEntries(
      Array.from({ length: 180 }, (_, index) => [
        key(addCalendarDays(start, index)),
        Math.floor(Math.random() * 121) + 80,
      ]),
    );
  });
</script>

{#snippet dayButton({ day, modifiers: _, children, ...props }: CalendarDayButtonProps)}
  {const price = prices[key(day.date)]}
  <button {...props} type="button">
    <span class="flex flex-col">
      {@render children()}{#if price}<span
          class={cn(
            "font-normal text-xs",
            price < 100
              ? "text-emerald-500"
              : "in-data-selected:text-primary-foreground/70 text-muted-foreground",
          )}
        >
          ${price}
        </span>{/if}
    </span>
  </button>
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
/>
