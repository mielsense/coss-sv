<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

export const meta = defineParticleMeta({
  components: ["textarea"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-textarea-9",
  interactive: true,
  responsive: false,
  title: "Textarea with custom border and background",
});
</script>

<script lang="ts">
import { Textarea } from "@coss-sv/ui";
</script>

<Textarea
  aria-label="Message"
  class="border-transparent bg-muted shadow-none before:hidden"
  placeholder="Type your message here"
/>
