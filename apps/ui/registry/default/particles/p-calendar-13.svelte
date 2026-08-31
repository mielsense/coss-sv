<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar", "combobox"],
    id: "p-calendar-13",
    interactive: true,
    responsive: false,
    title: "Calendar searchable year dropdown",
  });
</script>

<script lang="ts">
  import { Calendar, Combobox, type CalendarDropdownContext } from "@coss-sv/ui";
  let date = $state<Date | undefined>(new Date());
</script>

{#snippet yearDropdown(props: CalendarDropdownContext)}
  <Combobox.Root
    aria-label={props["aria-label"]}
    autoHighlight
    disabled={props.disabled}
    items={props.options}
    onValueChange={(item) => item && props.onChange(item.value)}
    value={props.options.find((item) => item.value === props.value)}
  >
    <Combobox.Input
      class="**:[input]:w-0 **:[input]:flex-1"
      onfocus={(event) => event.currentTarget.select()}
    /><Combobox.Popup aria-label={props["aria-label"]}>
      <Combobox.Empty>No items found.</Combobox.Empty><Combobox.List>
        <Combobox.Collection>
          {#snippet children(item: (typeof props.options)[number])}<Combobox.Item
              disabled={item.disabled}
              value={item}
            >
              {item.label}
            </Combobox.Item>{/snippet}
        </Combobox.Collection>
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
{/snippet}

<Calendar
  captionLayout="dropdown-years"
  classNames={{ dropdowns: "*:flex-1 *:[span]:text-center" }}
  components={{ Dropdown: yearDropdown }}
  endMonth={new Date(2030, 11)}
  mode="single"
  bind:selected={date}
  startMonth={new Date(1930, 0)}
/>
