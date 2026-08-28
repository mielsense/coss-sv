<script module lang="ts">
import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
export const meta = defineParticleMeta({
  components: ["button", "dialog", "field", "input"],
  id: "p-dialog-3",
  interactive: true,
  responsive: true,
  title: "Nested dialogs",
});
</script>
<script lang="ts">
import { Button, Dialog, Field, Input, buttonVariants } from "@coss-sv/ui";
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Open parent</Dialog.Trigger>
  <Dialog.Popup showCloseButton={false}>
    <Dialog.Header
      ><Dialog.Title>Manage team member</Dialog.Title
      ><Dialog.Description>View and manage a user in your team.</Dialog.Description></Dialog.Header
    >
    <Dialog.Panel class="grid gap-4">
      <div class="grid gap-1">
        <p class="text-muted-foreground text-sm">Name</p>
        <p class="font-medium text-sm">Bora Baloglu</p>
      </div>
      <div class="grid gap-1">
        <p class="text-muted-foreground text-sm">Email</p>
        <p class="font-medium text-sm">bora@example.com</p>
      </div>
    </Dialog.Panel>
    <Dialog.Footer>
      <Dialog.Root>
        <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Edit details</Dialog.Trigger>
        <Dialog.Popup showCloseButton={false}>
          <Dialog.Header
            ><Dialog.Title>Edit details</Dialog.Title
            ><Dialog.Description
              >Make changes to the member's information.</Dialog.Description
            ></Dialog.Header
          >
          <Dialog.Panel class="grid gap-4">
            <Field.Root
              ><Field.Label>Name</Field.Label><Input value="Bora Baloglu" type="text" /></Field.Root
            >
            <Field.Root
              ><Field.Label>Email</Field.Label>
              <Input value="bora@example.com" type="text" /></Field.Root
            >
          </Dialog.Panel>
          <Dialog.Footer
            ><Dialog.Close class={buttonVariants({ variant: "ghost" })}>Cancel</Dialog.Close
            ><Button type="submit">Save changes</Button></Dialog.Footer
          >
        </Dialog.Popup>
      </Dialog.Root>
    </Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>
