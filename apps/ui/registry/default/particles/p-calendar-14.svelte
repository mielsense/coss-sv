<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar", "select"],
    id: "p-calendar-14",
    interactive: true,
    responsive: false,
    title: "Calendar dropdown navigation",
  });
</script>

<script lang="ts">
  import {
    Calendar,
    Select,
    type CalendarDropdownContext,
    type CalendarDropdownNavContext,
  } from "@coss-sv/ui";
  let date = $state<Date | undefined>(new Date());
</script>

{#snippet dropdown(props: CalendarDropdownContext)}<Select.Root
    items={props.options}
    onValueChange={(value) => typeof value === "number" && props.onChange(value)}
    value={props.value}
  >
    <Select.Trigger aria-label={props["aria-label"]} class="min-w-none">
      <Select.Value />
    </Select.Trigger><Select.Popup>
      {#each props.options as item (item.value)}<Select.Item
          disabled={item.disabled}
          value={item.value}
        >
          {item.label}
        </Select.Item>{/each}
    </Select.Popup>
  </Select.Root>{/snippet}
{#snippet dropdownNav(props: CalendarDropdownNavContext)}<div
    class="flex w-full items-center gap-2"
  >
    {@render props.children()}
  </div>{/snippet}

<Calendar
  captionLayout="dropdown"
  classNames={{ month_caption: "mx-0" }}
  components={{ Dropdown: dropdown, DropdownNav: dropdownNav }}
  defaultMonth={new Date()}
  hideNavigation
  mode="single"
  bind:selected={date}
  startMonth={new Date(1980, 6)}
/>
