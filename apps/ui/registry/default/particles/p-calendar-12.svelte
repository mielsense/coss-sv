<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar"],
    id: "p-calendar-12",
    interactive: true,
    responsive: false,
    title: "Calendar week numbers",
  });
</script>

<script lang="ts">
  import { Calendar, type CalendarWeekNumberProps } from "@coss-sv/ui";
  let date = $state<Date | undefined>(new Date());
</script>

{#snippet weekNumber(props: CalendarWeekNumberProps)}
  <th {...props}>
    <span class="inline-flex size-(--cell-size) items-center justify-center">
      {props.week.weekNumber}
    </span>
  </th>
{/snippet}

<Calendar
  components={{ WeekNumber: weekNumber }}
  fixedWeeks
  mode="single"
  bind:selected={date}
  showWeekNumber
/>
