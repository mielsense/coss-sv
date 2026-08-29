<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "calendar", "input-group", "popover"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-date-picker-5",
    interactive: true,
    responsive: false,
    title: "Date input picker",
  });
</script>

<script lang="ts">
  import { Calendar03Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { buttonVariants, Calendar, InputGroup, Popover } from "@coss-sv/ui";
  const today = new Date(2026, 7, 28, 12);
  let date = $state<Date | undefined>();
  let inputValue = $state("");
  let month = $state(today);
  function toInput(value: Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }
  function update(value: string) {
    inputValue = value;
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : undefined;
    if (parsed && !Number.isNaN(parsed.getTime())) {
      date = parsed;
      month = parsed;
    } else if (!value) date = undefined;
  }
</script>

<Popover.Root
  ><InputGroup.Root
    ><InputGroup.Input
      aria-label="Select date"
      class="*:[input]:[&::-webkit-calendar-picker-indicator]:hidden *:[input]:[&::-webkit-calendar-picker-indicator]:appearance-none"
      type="date"
      value={inputValue}
      onclick={(event) => event.stopPropagation()}
      oninput={(event) => update(event.currentTarget.value)}
    /><InputGroup.Addon
      ><Popover.Trigger
        aria-label="Select date"
        class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
        ><HugeiconsIcon icon={Calendar03Icon} aria-hidden="true" strokeWidth={2} /></Popover.Trigger
      ></InputGroup.Addon
    ></InputGroup.Root
  ><Popover.Popup align="start" alignOffset={-4} sideOffset={8}
    ><Calendar
      mode="single"
      bind:month
      selected={date}
      onSelect={(next) => {
        date = next;
        inputValue = next ? toInput(next) : "";
        if (next) month = next;
      }}
      {today}
    /></Popover.Popup
  ></Popover.Root
>
