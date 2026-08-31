<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["combobox"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-combobox-16",
    interactive: true,
    responsive: false,
    title: "Timezone combobox",
  });
</script>

<script lang="ts">
  import { Combobox } from "@coss-sv/ui";

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

<Combobox.Root
  autoHighlight
  items={timezones}
  value={timezones.find((item) => item.value === "Europe/London")}
>
  <Combobox.Input aria-label="Select timezone" placeholder="Select timezone..." />
  <Combobox.Popup>
    <Combobox.Empty>No timezones found.</Combobox.Empty><Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: Timezone)}<Combobox.Item value={item}>
            {item.label}
          </Combobox.Item>{/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
</Combobox.Root>
