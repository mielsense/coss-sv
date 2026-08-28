<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "field", "form", "popover", "textarea"],
  id: "p-popover-1",
  interactive: true,
  responsive: true,
  title: "Feedback popover",
});
</script>
<script lang="ts">
import { Button, Field, Form, Popover, Textarea, buttonVariants } from "@coss-sv/ui";
</script>
<Popover.Root
  ><Popover.Trigger class={buttonVariants({ variant: "outline" })}>Open Popover</Popover.Trigger
  ><Popover.Popup class="w-80"
    ><div class="mb-4">
      <Popover.Title class="text-base">Send us feedback</Popover.Title
      ><Popover.Description>Let us know how we can improve.</Popover.Description>
    </div>
    <Form class="flex w-full flex-col gap-4"
      ><Field.Root
        ><Textarea
          aria-label="Send feedback"
          id="feedback"
          placeholder="How can we improve?"
        /></Field.Root
      ><Button type="submit">Send feedback</Button></Form
    ></Popover.Popup
  ></Popover.Root
>
