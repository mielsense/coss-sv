<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import { buttonVariants, Calendar, InputGroup, Popover } from "@coss-sv/ui";
  import { formatDateInput, parseDateInput } from "../lib/date-format.js";
  let date = $state<Date | undefined>();
  let inputValue = $state("");
  let month = $state(new Date());
  function update(value: string) {
    inputValue = value;
    const parsed = parseDateInput(value);
    if (parsed) {
      date = parsed;
      month = parsed;
    } else if (!value) date = undefined;
  }
</script>

<Popover.Root>
  <InputGroup.Root>
    <InputGroup.Input
      aria-label="Select date"
      class="*:[input]:[&::-webkit-calendar-picker-indicator]:hidden *:[input]:[&::-webkit-calendar-picker-indicator]:appearance-none"
      type="date"
      value={inputValue}
      onclick={(event) => event.stopPropagation()}
      oninput={(event) => update(event.currentTarget.value)}
    /><InputGroup.Addon>
      <Popover.Trigger
        aria-label="Select date"
        class={buttonVariants({ size: "icon-xs", variant: "ghost" })}
      >
        <HugeiconsIcon icon={Calendar03Icon} aria-hidden="true" strokeWidth={2} />
      </Popover.Trigger>
    </InputGroup.Addon>
  </InputGroup.Root><Popover.Popup align="start" alignOffset={-4} sideOffset={8}>
    <Calendar
      mode="single"
      {month}
      onMonthChange={(value) => (month = value)}
      selected={date}
      onSelect={(next) => {
        date = next;
        inputValue = next ? formatDateInput(next) : "";
        if (next) month = next;
      }}
    />
  </Popover.Popup>
</Popover.Root>
