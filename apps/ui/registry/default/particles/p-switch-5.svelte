<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["button", "field", "form", "switch"],
  id: "p-switch-5",
  interactive: true,
  responsive: false,
  title: "Switch form",
});
</script>

<script lang="ts">
import { Button, Label, Switch } from "@coss-sv/ui";
let loading = $state(false);
async function submit(event: SubmitEvent) {
  event.preventDefault();
  loading = true;
  await new Promise((resolve) => window.setTimeout(resolve, 800));
  loading = false;
  window.alert(
    `Marketing emails: ${new FormData(event.currentTarget as HTMLFormElement).get("marketing")}`,
  );
}
</script>

<form class="flex flex-col gap-4" onsubmit={submit}>
  <Label
    ><Switch aria-label="Enable marketing emails" checked name="marketing" />
    Enable marketing emails</Label
  >
  <Button {loading} type="submit">Submit</Button>
</form>
