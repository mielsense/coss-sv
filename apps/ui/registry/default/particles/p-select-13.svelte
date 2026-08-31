<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-select-13",
    interactive: true,
    responsive: false,
    title: "Timezone select",
  });
</script>

<script lang="ts">
  import { Select } from "@coss-sv/ui";

  const timezones = Intl.supportedValuesOf("timeZone")
    .map((timezone) => {
      const formatter = new Intl.DateTimeFormat("en", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
      });
      const offset =
        formatter.formatToParts(new Date()).find((part) => part.type === "timeZoneName")?.value ??
        "";
      const match = offset.match(/GMT([+-]?)(\d+)(?::(\d+))?/);
      const numericOffset =
        (match?.[1] === "-" ? -1 : 1) * (Number(match?.[2] ?? 0) * 60 + Number(match?.[3] ?? 0));
      return {
        label: `(${offset === "GMT" ? "GMT+0" : offset}) ${timezone.replaceAll("_", " ")}`,
        numericOffset,
        value: timezone,
      };
    })
    .sort((a, b) => a.numericOffset - b.numericOffset);
  type Timezone = (typeof timezones)[number];
</script>

<Select.Root
  aria-label="Select timezone"
  value={timezones.find((item) => item.value === "Europe/London")}
  itemToStringValue={(item: Timezone) => item.value}
>
  <Select.Trigger>
    <Select.Value>
      {#snippet children(item: Timezone | null)}{#if item}<span class="truncate">
            {item.label}
          </span>{/if}{/snippet}
    </Select.Value>
  </Select.Trigger><Select.Popup>
    {#each timezones as item (item.value)}<Select.Item value={item}>
        {item.label}
      </Select.Item>{/each}
  </Select.Popup>
</Select.Root>
