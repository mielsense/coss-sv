<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["combobox", "select"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-17",
    interactive: true,
    responsive: false,
    title: "Timezone combobox with search input",
  });
</script>

<script lang="ts">
  import { Combobox, HugeiconsIcon, Select } from "@coss-sv/ui";
  import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";

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
      const minutes =
        (match?.[1] === "-" ? -1 : 1) * (Number(match?.[2] ?? 0) * 60 + Number(match?.[3] ?? 0));
      return {
        label: `(${offset === "GMT" ? "GMT+0" : offset}) ${timezone.replaceAll("_", " ")}`,
        numericOffset: minutes,
        value: timezone,
      };
    })
    .sort((a, b) => a.numericOffset - b.numericOffset);
  type Timezone = (typeof timezones)[number];
</script>

<Combobox.Root autoHighlight items={timezones}>
  <Combobox.Trigger class={Select.selectTriggerClass}>
    <Combobox.Value placeholder="Select timezone" />
  </Combobox.Trigger>
  <Combobox.Popup aria-label="Select timezone">
    <div class="border-b p-2">
      <Combobox.Input
        class="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
        placeholder="e.g. Europe/London"
        showTrigger={false}
      >
        {#snippet startAddon()}<HugeiconsIcon
            aria-hidden="true"
            icon={Search01Icon}
            strokeWidth={2}
          />{/snippet}
      </Combobox.Input>
    </div>
    <Combobox.Empty>No timezones found.</Combobox.Empty><Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: Timezone)}<Combobox.Item value={item}>
            {item.label}
          </Combobox.Item>{/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
