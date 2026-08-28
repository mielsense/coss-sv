<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["input-group"],
  containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
  id: "p-input-group-5",
  interactive: true,
  responsive: false,
  title: "Input group with start and end text",
});
</script>
<script lang="ts">
import { InputGroup } from "@coss-sv/ui";
</script>
<InputGroup.Root
  ><InputGroup.Input
    aria-label="Enter your domain"
    class="*:[input]:px-0!"
    placeholder="coss"
    type="text"
  /><InputGroup.Addon><InputGroup.Text>https://</InputGroup.Text></InputGroup.Addon
  ><InputGroup.Addon align="inline-end"
    ><InputGroup.Text>.com</InputGroup.Text></InputGroup.Addon
  ></InputGroup.Root
>
