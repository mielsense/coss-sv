<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "field", "form", "input", "sheet"],
  id: "p-sheet-2",
  interactive: true,
  responsive: true,
  title: "Inset sheet",
});
</script>
<script lang="ts">
import { Button, Field, Form, Input, Sheet, buttonVariants } from "@coss-sv/ui";
</script>
<Sheet.Root
  ><Sheet.Trigger class={buttonVariants({ variant: "outline" })}>Open Sheet</Sheet.Trigger
  ><Sheet.Popup variant="inset"
    ><Sheet.Header
      ><Sheet.Title>Edit profile</Sheet.Title
      ><Sheet.Description
        >Make changes to your profile here. Click save when you're done.</Sheet.Description
      ></Sheet.Header
    >
    <Form class="contents"
      ><Sheet.Panel class="grid gap-4"
        ><Field.Root
          ><Field.Label>Name</Field.Label><Input value="Margaret Welsh" type="text" /></Field.Root
        ><Field.Root
          ><Field.Label>Username</Field.Label>
          <Input value="@maggie.welsh" type="text" /></Field.Root
        ></Sheet.Panel
      ><Sheet.Footer
        ><Sheet.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Sheet.Close
        ><Button type="submit">Save</Button></Sheet.Footer
      ></Form
    ></Sheet.Popup
  ></Sheet.Root
>
