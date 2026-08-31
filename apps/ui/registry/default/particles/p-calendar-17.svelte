<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["calendar", "field", "input-group"],
    id: "p-calendar-17",
    interactive: true,
    responsive: false,
    title: "Calendar date input",
  });
</script>

<script lang="ts">
  import Calendar03Icon from "@hugeicons/core-free-icons/Calendar03Icon";
  import { Calendar, Field, HugeiconsIcon, InputGroup } from "@coss-sv/ui";
  import { formatDateInput, parseDateInput } from "../lib/date-format.js";
  let date = $state<Date | undefined>(new Date());
  let month = $state(new Date());
  let inputValue = $state(formatDateInput(new Date()));
  function selectDate(selected: Date | undefined) {
    date = selected;
    inputValue = selected ? formatDateInput(selected) : "";
    if (selected) month = selected;
  }
  function updateDate(value: string) {
    inputValue = value;
    const parsed = parseDateInput(value);
    if (parsed) {
      date = parsed;
      month = parsed;
    } else if (!value) date = undefined;
  }
</script>

<div class="flex flex-col gap-2">
  <Calendar
    mode="single"
    {month}
    onMonthChange={(value) => (month = value)}
    selected={date}
    onSelect={selectDate}
  /><Field.Root class="flex-row items-center gap-4">
    <Field.Label class="whitespace-nowrap">Enter date</Field.Label><InputGroup.Root>
      <InputGroup.Input
        aria-label="Select date"
        class="*:[input]:[&::-webkit-calendar-picker-indicator]:hidden *:[input]:[&::-webkit-calendar-picker-indicator]:appearance-none"
        type="date"
        value={inputValue}
        oninput={(event) => updateDate(event.currentTarget.value)}
      /><InputGroup.Addon>
        <HugeiconsIcon icon={Calendar03Icon} aria-hidden="true" strokeWidth={2} />
      </InputGroup.Addon>
    </InputGroup.Root>
  </Field.Root>
</div>
