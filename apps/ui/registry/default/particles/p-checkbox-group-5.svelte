<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "checkbox", "checkbox-group", "field", "fieldset", "form"],
  id: "p-checkbox-group-5",
  interactive: true,
  responsive: false,
  title: "Checkbox group form",
});
</script>

<script lang="ts">
import { Button, CheckboxGroup, Label } from "@coss-sv/ui";
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
  const form = event.currentTarget as HTMLFormElement;
  window.alert(`Selected: ${new FormData(form).getAll("frameworks").join(", ") || "none"}`);
}
</script>

<form class="flex w-full max-w-[160px] flex-col gap-4" onsubmit={submit}>
  <fieldset class="flex flex-col gap-3">
    <legend class="font-medium text-sm">Frameworks</legend>
    <CheckboxGroup.Root defaultValue={["next"]}>
      {#each frameworks as framework (framework.value)}
        <Label
          ><CheckboxGroup.Item name="frameworks" value={framework.value} />{framework.label}</Label
        >
      {/each}
    </CheckboxGroup.Root>
  </fieldset>
  <Button {loading} type="submit">Submit</Button>
</form>
