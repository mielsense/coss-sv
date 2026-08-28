<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "field", "fieldset", "form", "radio-group"],
  id: "p-radio-group-5",
  interactive: true,
  responsive: false,
  title: "Radio group form",
});
</script>

<script lang="ts">
import { Button, Label, RadioGroup } from "@coss-sv/ui";
const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "vite", label: "Vite" },
  { value: "astro", label: "Astro" },
];
let loading = $state(false);
async function submit(event: SubmitEvent) {
  event.preventDefault();
  loading = true;
  await new Promise((resolve) => window.setTimeout(resolve, 800));
  loading = false;
  window.alert(
    `Selected: ${new FormData(event.currentTarget as HTMLFormElement).get("frameworks")}`,
  );
}
</script>

<form class="flex w-full max-w-[160px] flex-col gap-4" onsubmit={submit}>
  <fieldset class="flex flex-col gap-2">
    <legend class="font-medium text-sm">Frameworks</legend>
    <RadioGroup.Root defaultValue="next" name="frameworks">
      {#each frameworks as framework (framework.value)}
        <Label><RadioGroup.Item value={framework.value} />{framework.label}</Label>
      {/each}
    </RadioGroup.Root>
  </fieldset>
  <Button {loading} type="submit">Submit</Button>
</form>
