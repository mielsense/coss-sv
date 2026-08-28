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
  id: "p-switch-9",
  iframeHeight: 540,
  interactive: true,
  responsive: true,
  title: "Weekly availability 9",
});
</script>

<script lang="ts">
import { Add01Icon, Cancel01Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/svelte";
import { Button, Group, Label, Switch } from "@coss-sv/ui";

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
const times = ["9:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];
const uid = $props.id();
let nextId = 9;
let availability = $state<Record<Day, TimeRange[]>>({
  Monday: [{ id: 1, start: "9:00 AM", end: "5:00 PM" }],
  Tuesday: [
    { id: 2, start: "9:00 AM", end: "1:00 PM" },
    { id: 3, start: "3:00 PM", end: "5:00 PM" },
  ],
  Wednesday: [{ id: 4, start: "9:00 AM", end: "5:00 PM" }],
  Thursday: [{ id: 5, start: "9:00 AM", end: "5:00 PM" }],
  Friday: [{ id: 6, start: "9:00 AM", end: "5:00 PM" }],
  Saturday: [],
  Sunday: [],
});

function toggleDay(day: Day, enabled: boolean) {
  availability[day] = enabled ? [{ id: nextId++, start: "9:00 AM", end: "5:00 PM" }] : [];
}
function addRange(day: Day) {
  availability[day] = [...availability[day], { id: nextId++, start: "9:00 AM", end: "5:00 PM" }];
}
function removeRange(day: Day, id: number) {
  availability[day] = availability[day].filter((range) => range.id !== id);
}
function update(day: Day, id: number, key: "start" | "end", value: string) {
  availability[day] = availability[day].map((range) =>
    range.id === id ? { ...range, [key]: value } : range,
  );
}
</script>

<div class="divide-y">
  {#each days as day (day)}
    {const ranges = availability[day]}
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
            <p class="flex h-8 items-center text-muted-foreground sm:h-7 sm:text-sm">Unavailable</p>
          {:else}
            {#each ranges as range (range.id)}
              <div class="flex items-center gap-2">
                <Group.Root aria-label={`${day} time range`}>
                  <Group.Text><Label for={`${uid}-start-${range.id}`}>From</Label></Group.Text>
                  <Group.Separator />
                  <select
                    aria-label={`${day} start time`}
                    class="h-8 w-24 rounded-lg border border-input bg-background px-2 text-sm tabular-nums"
                    id={`${uid}-start-${range.id}`}
                    onchange={(event) => update(day, range.id, "start", event.currentTarget.value)}
                    value={range.start}
                  >
                    {#each times as time (time)}
                      <option value={time}>{time}</option>
                    {/each}
                  </select>
                  <Group.Separator />
                  <Group.Text><Label for={`${uid}-end-${range.id}`}>To</Label></Group.Text>
                  <Group.Separator />
                  <select
                    aria-label={`${day} end time`}
                    class="h-8 w-24 rounded-lg border border-input bg-background px-2 text-sm tabular-nums"
                    id={`${uid}-end-${range.id}`}
                    onchange={(event) => update(day, range.id, "end", event.currentTarget.value)}
                    value={range.end}
                  >
                    {#each times as time (time)}
                      <option value={time}>{time}</option>
                    {/each}
                  </select>
                </Group.Root>
                <Button
                  aria-label={`Delete ${range.start} to ${range.end} on ${day}`}
                  onclick={() => removeRange(day, range.id)}
                  size="icon-sm"
                  title="Delete range"
                  variant="ghost"
                >
                  <HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} />
                </Button>
              </div>
            {/each}
          {/if}
        </div>
        <div class="ml-auto flex shrink-0 gap-1">
          <Button
            aria-label={`Add time range to ${day}`}
            onclick={() => addRange(day)}
            size="icon-sm"
            title="Add range"
            variant="ghost"
          >
            <HugeiconsIcon aria-hidden="true" icon={Add01Icon} strokeWidth={2} />
          </Button>
          <Button
            aria-label={`Copy ${day} times to other days`}
            disabled={ranges.length === 0}
            size="icon-sm"
            title="Copy to other days"
            variant="ghost"
          >
            <HugeiconsIcon aria-hidden="true" icon={Copy01Icon} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </div>
  {/each}
</div>
