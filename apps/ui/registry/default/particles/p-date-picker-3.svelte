<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar", "combobox", "field", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-date-picker-3",
    interactive: true,
    responsive: false,
    title: "Date picker with searchable year",
  });
</script>

<script lang="ts">
  import {
    buttonVariants,
    Calendar,
    type CalendarDropdownContext,
    Combobox,
    Field,
    HugeiconsIcon,
    Popover,
  } from "@coss-sv/ui";
  import { Calendar03Icon } from "@hugeicons/core-free-icons";
  import { formatDatePpp } from "../lib/date-format.js";

  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>();
  const id = $props.id();
</script>

{#snippet dropdown(props: CalendarDropdownContext)}<Combobox.Root
    aria-label={props["aria-label"]}
    autoHighlight
    items={props.options}
    onValueChange={(item) => item && props.onChange(item.value)}
    value={props.options.find((item) => item.value === props.value)}
    ><Combobox.Input
      class="**:[input]:w-0 **:[input]:flex-1"
      onfocus={(event) => event.currentTarget.select()}
    /><Combobox.Popup aria-label={props["aria-label"]}
      ><Combobox.Empty>No items found.</Combobox.Empty><Combobox.List
        ><Combobox.Collection
          >{#snippet children(item: (typeof props.options)[number])}<Combobox.Item
              disabled={item.disabled}
              value={item}>{item.label}</Combobox.Item
            >{/snippet}</Combobox.Collection
        ></Combobox.List
      ></Combobox.Popup
    ></Combobox.Root
  >{/snippet}

<Field.Root
  ><Field.Label for={id}>Start date</Field.Label><Popover.Root
    ><Popover.Trigger
      {id}
      class={buttonVariants({ class: "w-full justify-start", variant: "outline" })}
      ><HugeiconsIcon icon={Calendar03Icon} aria-hidden="true" strokeWidth={2} />{date
        ? formatDatePpp(date)
        : "Pick a date"}</Popover.Trigger
    ><Popover.Popup
      ><Calendar
        captionLayout="dropdown"
        components={{ Dropdown: dropdown }}
        defaultMonth={date}
        endMonth={today}
        mode="single"
        bind:selected={date}
        startMonth={new Date(1900, 0, 1, 12)}
        {today}
      /></Popover.Popup
    ></Popover.Root
  ></Field.Root
>
