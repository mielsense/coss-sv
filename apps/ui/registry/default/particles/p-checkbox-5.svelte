<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "checkbox", "field", "form"],
  id: "p-checkbox-5",
  interactive: true,
  responsive: false,
  title: "Checkbox form",
});
</script>

<script lang="ts">
import { Button, Checkbox, Label } from "@coss-sv/ui";
let loading = $state(false);
async function submit(event: SubmitEvent) {
  event.preventDefault();
  loading = true;
  await new Promise((resolve) => window.setTimeout(resolve, 800));
  loading = false;
  const form = event.currentTarget as HTMLFormElement;
  window.alert(`Terms: ${new FormData(form).get("terms")}`);
}
</script>

<form class="flex w-auto flex-col gap-4" onsubmit={submit}>
  <Label><Checkbox checked name="terms" value="yes" />Accept terms and conditions</Label>
  <Button {loading} type="submit">Submit</Button>
</form>
