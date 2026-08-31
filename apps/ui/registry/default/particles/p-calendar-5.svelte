<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar", "select"],
    id: "p-calendar-5",
    interactive: true,
    responsive: false,
    title: "Calendar custom select dropdowns",
  });
</script>

<script lang="ts">
  import { Calendar, Select, type CalendarDropdownContext } from "@coss-sv/ui";
  let date = $state<Date | undefined>(new Date());
</script>

{#snippet dropdown(props: CalendarDropdownContext)}
  <Select.Root
    aria-label={props["aria-label"]}
    disabled={props.disabled}
    items={props.options}
    onValueChange={(value) => typeof value === "number" && props.onChange(value)}
    value={props.value}
  >
    <Select.Trigger class="min-w-none"><Select.Value /></Select.Trigger>
    <Select.Popup>
      {#each props.options as item (item.value)}<Select.Item
          disabled={item.disabled}
          value={item.value}
        >
          {item.label}
        </Select.Item>{/each}
    </Select.Popup>
  </Select.Root>
{/snippet}

<Calendar
  captionLayout="dropdown"
  components={{ Dropdown: dropdown }}
  endMonth={new Date(2030, 11)}
  mode="single"
  bind:selected={date}
  startMonth={new Date(1930, 0)}
/>
