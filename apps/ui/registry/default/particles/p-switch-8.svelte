(eval):5: parse error near `end'
<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: [
    "button",
    "checkbox",
    "checkbox-group",
    "combobox",
    "group",
    "label",
    "popover",
    "switch",
    "tooltip",
  ],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-3xl",
  id: "p-switch-8",
  iframeHeight: 540,
  interactive: true,
  responsive: true,
  title: "Weekly availability 8",
});
</script>

<script lang="ts">
import {
  Add01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Copy01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import {
  CheckboxGroup,
  Combobox,
  Group,
  Label,
  Popover,
  Switch,
  Tooltip,
  buttonVariants,
} from "@coss-sv/ui";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
type Day = (typeof days)[number];
type TimeRange = { id: number; start: string; end: string };
const timeOptions = Array.from({ length: 96 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const minutes = (i % 4) * 15;
  const period = hours < 12 ? "AM" : "PM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
});
const timeIndex = (time: string) => timeOptions.indexOf(time);
let rangeId = 0;
const createRange = (start: string, end: string): TimeRange => ({ end, id: ++rangeId, start });
const defaultAvailability: Record<Day, TimeRange[]> = {
  Friday: [createRange("9:00 AM", "5:00 PM")],
  Monday: [createRange("9:00 AM", "5:00 PM")],
  Saturday: [],
  Sunday: [],
  Thursday: [createRange("9:00 AM", "5:00 PM")],
  Tuesday: [createRange("9:00 AM", "1:00 PM"), createRange("3:00 PM", "5:00 PM")],
  Wednesday: [createRange("9:00 AM", "5:00 PM")],
};
let availability = $state<Record<Day, TimeRange[]>>(defaultAvailability);
let copyOpen = $state<Record<Day, boolean>>({
  Monday: false,
  Tuesday: false,
  Wednesday: false,
  Thursday: false,
  Friday: false,
  Saturday: false,
  Sunday: false,
});
let selectedCopyDays = $state<Record<Day, string[]>>({
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
});

function setDayRanges(day: Day, ranges: TimeRange[]) {
  availability = { ...availability, [day]: ranges };
}
function toggleDay(day: Day, enabled: boolean) {
  setDayRanges(day, enabled ? [createRange("9:00 AM", "5:00 PM")] : []);
}
function addRange(day: Day) {
  const ranges = availability[day];
  const lastRange = ranges[ranges.length - 1];
  if (!lastRange) {
    setDayRanges(day, [createRange("9:00 AM", "5:00 PM")]);
    return;
  }
  const startIndex = Math.min(timeIndex(lastRange.end) + 4, timeOptions.length - 2);
  const endIndex = Math.min(startIndex + 4, timeOptions.length - 1);
  setDayRanges(day, [
    ...ranges,
    createRange(timeOptions[startIndex] ?? "", timeOptions[endIndex] ?? ""),
  ]);
}
function removeRange(day: Day, id: number) {
  setDayRanges(
    day,
    availability[day].filter((range) => range.id !== id),
  );
}
function updateStart(day: Day, id: number, start: string) {
  setDayRanges(
    day,
    availability[day].map((range) => {
      if (range.id !== id) return range;
      const end =
        timeIndex(start) >= timeIndex(range.end)
          ? (timeOptions[Math.min(timeIndex(start) + 4, timeOptions.length - 1)] ?? range.end)
          : range.end;
      return { ...range, end, start };
    }),
  );
}
function updateEnd(day: Day, id: number, end: string) {
  setDayRanges(
    day,
    availability[day].map((range) => (range.id === id ? { ...range, end } : range)),
  );
}
function copyTo(source: Day, targets: Day[]) {
  const next = { ...availability };
  for (const target of targets)
    next[target] = availability[source].map((range) => createRange(range.start, range.end));
  availability = next;
}
function setCopyOpen(day: Day, open: boolean) {
  if (open) selectedCopyDays = { ...selectedCopyDays, [day]: [] };
}
function toggleCopy(day: Day, event: MouseEvent) {
  event.stopPropagation();
  const open = !copyOpen[day];
  if (open) selectedCopyDays = { ...selectedCopyDays, [day]: [] };
  copyOpen = { ...copyOpen, [day]: open };
}
function setSelectedCopyDays(day: Day, value: readonly string[]) {
  selectedCopyDays = { ...selectedCopyDays, [day]: [...value] };
}
function applyCopy(day: Day) {
  copyTo(day, selectedCopyDays[day] as Day[]);
  copyOpen = { ...copyOpen, [day]: false };
}
</script>

{#snippet searchIcon()}
  <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
{/snippet}
{#snippet timeCombobox(ariaLabel: string, items: string[], value: string, onChange: (time: string) => void)}
  <Combobox.Root
    autoHighlight
    {items}
    onValueChange={(time) => { if (typeof time === "string") onChange(time); }}
    {value}
  >
    <Combobox.Trigger
      aria-label={ariaLabel}
      class={buttonVariants({ class: "w-24 font-normal tabular-nums", size: "sm", variant: "outline" })}
    >
      <Combobox.Value />
    </Combobox.Trigger>
    <Combobox.Popup aria-label={ariaLabel} class="min-w-44">
      <div class="border-b p-2">
        <Combobox.Input
          class="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
          placeholder="Search time"
          showTrigger={false}
          size="sm"
          startAddon={searchIcon}
        />
      </div>
      <Combobox.Empty>No times found.</Combobox.Empty>
      <Combobox.List>
        <Combobox.Collection>
          {#snippet children(time: string)}
            <Combobox.Item value={time}><span class="tabular-nums">{time}</span></Combobox.Item>
          {/snippet}
        </Combobox.Collection>
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
{/snippet}

<Tooltip.Provider delay={0}>
  <div class="divide-y">
    {#each days as day (day)}
      {#key JSON.stringify(availability[day])}
        {const ranges = availability[day]}
        {const lastRange = ranges[ranges.length - 1]}
        {const addDisabled = lastRange ? timeIndex(lastRange.end) >= timeOptions.length - 2 : false}
        <div
          class="flex flex-col gap-4 py-3 first:pt-0 last:pb-0 md:flex-row md:flex-wrap md:items-start"
        >
          <Label class="flex h-8 w-30 shrink-0 items-center gap-2.5 sm:h-7">
            <Switch
              checked={ranges.length > 0}
              onCheckedChange={(checked) => toggleDay(day, checked)}
            />
            {day}
          </Label>
          <div class="flex w-full min-w-0 items-start gap-4 md:flex-1">
            <div class="flex min-w-0 flex-col gap-2">
              {#if ranges.length === 0}
                <p class="flex h-8 items-center text-muted-foreground sm:h-7 sm:text-sm">
                  Unavailable
                </p>
              {:else}
                {#each ranges as range (range.id)}
                  <div class="flex items-center gap-2">
                    <Group.Root aria-label={`${day} time range`}>
                      {@render timeCombobox(`${day} start time`, timeOptions, range.start, (start) => updateStart(day, range.id, start))}
                      <Group.Separator />
                      <Group.Text aria-hidden="true" class="px-2"
                        ><HugeiconsIcon
                          class="size-3.5"
                          icon={ArrowRight01Icon}
                          strokeWidth={2}
                        /></Group.Text
                      >
                      <Group.Separator />
                      {#key range.end}
                        {@render timeCombobox(`${day} end time`, timeOptions.slice(timeIndex(range.start) + 1), range.end, (end) => updateEnd(day, range.id, end))}
                      {/key}
                    </Group.Root>
                    <Tooltip.Root disableHoverablePopup>
                      <Tooltip.Trigger
                        aria-label={`Delete ${range.start} to ${range.end} on ${day}`}
                        class={buttonVariants({ size: "icon-sm", variant: "ghost" })}
                        onclick={() => removeRange(day, range.id)}
                      >
                        <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
                      </Tooltip.Trigger>
                      <Tooltip.Popup>Delete range</Tooltip.Popup>
                    </Tooltip.Root>
                  </div>
                {/each}
              {/if}
            </div>
            <div class="ml-auto flex shrink-0 gap-1">
              <Tooltip.Root disableHoverablePopup>
                <Tooltip.Trigger
                  aria-label={`Add time range to ${day}`}
                  class={buttonVariants({ size: "icon-sm", variant: "ghost" })}
                  disabled={addDisabled}
                  onclick={() => addRange(day)}
                >
                  <HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} />
                </Tooltip.Trigger>
                <Tooltip.Popup>Add range</Tooltip.Popup>
              </Tooltip.Root>
              <Popover.Root
                bind:open={copyOpen[day]}
                onOpenChange={(open) => setCopyOpen(day, open)}
              >
                <Tooltip.Root disableHoverablePopup>
                  <Popover.Trigger as="span" class="inline-flex" role="presentation" tabindex={-1}>
                    <Tooltip.Trigger
                      aria-label={`Copy ${day} times to other days`}
                      class={buttonVariants({ size: "icon-sm", variant: "ghost" })}
                      disabled={ranges.length === 0}
                      onclick={(event) => toggleCopy(day, event)}
                    >
                      <HugeiconsIcon aria-hidden="true" icon={Copy01Icon} strokeWidth={2} />
                    </Tooltip.Trigger>
                  </Popover.Trigger>
                  <Tooltip.Popup>Copy to other days</Tooltip.Popup>
                </Tooltip.Root>
                <Popover.Popup align="end" class="w-44">
                  <div class="flex flex-col gap-3">
                    <div class="font-medium text-foreground text-sm">Copy times to</div>
                    <CheckboxGroup.Root
                      aria-label={`Copy ${day} times to`}
                      onValueChange={(value) => setSelectedCopyDays(day, value)}
                      value={selectedCopyDays[day]}
                    >
                      {#each days.filter((target) => target !== day) as target (target)}
                        <Label><CheckboxGroup.Item value={target} />{target}</Label>
                      {/each}
                    </CheckboxGroup.Root>
                    <button
                      class={buttonVariants({ size: "sm" })}
                      disabled={selectedCopyDays[day].length === 0}
                      onclick={() => applyCopy(day)}
                      type="button"
                    >
                      Apply
                    </button>
                  </div>
                </Popover.Popup>
              </Popover.Root>
            </div>
          </div>
        </div>
      {/key}
    {/each}
  </div>
</Tooltip.Provider>
