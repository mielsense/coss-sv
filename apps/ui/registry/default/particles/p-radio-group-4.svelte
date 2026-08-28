<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["label", "radio-group"],
  id: "p-radio-group-4",
  interactive: true,
  responsive: true,
  title: "Card radio group",
});
</script>

<script lang="ts">
import { Label, RadioGroup } from "@coss-sv/ui";

const methods = [
  { value: "r-1", title: "Email", description: "Receive notifications via email." },
  { value: "r-2", title: "SMS", description: "Receive notifications via text message." },
];
</script>

<RadioGroup.Root defaultValue="r-1">
  {#each methods as method (method.value)}
    <Label
      class="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
    >
      <RadioGroup.Item value={method.value} />
      <div class="flex flex-col gap-1">
        <p>{method.title}</p>
        <p class="text-muted-foreground text-xs">{method.description}</p>
      </div>
    </Label>
  {/each}
</RadioGroup.Root>
