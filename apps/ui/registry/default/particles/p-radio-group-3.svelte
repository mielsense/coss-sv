<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["label", "radio-group"],
    id: "p-radio-group-3",
    interactive: true,
    responsive: false,
    title: "Radio group with descriptions",
  });
</script>

<script lang="ts">
  import { Label, RadioGroup } from "@coss-sv/ui";

  const plans = [
    { value: "r-1", title: "Free", description: "Basic features for personal use." },
    { value: "r-2", title: "Pro", description: "Advanced tools for professionals." },
  ];
</script>

<RadioGroup.Root defaultValue="r-1">
  {#each plans as plan (plan.value)}
    <div class="flex items-start gap-2">
      <RadioGroup.Item id={plan.value} value={plan.value} />
      <div class="flex flex-col gap-1">
        <Label for={plan.value}>{plan.title}</Label>
        <p class="text-muted-foreground text-xs">{plan.description}</p>
      </div>
    </div>
  {/each}
</RadioGroup.Root>
