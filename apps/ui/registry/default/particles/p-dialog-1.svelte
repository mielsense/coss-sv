<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "dialog", "field", "form", "input"],
    id: "p-dialog-1",
    interactive: true,
    responsive: true,
    title: "Edit profile dialog",
  });
</script>

<script lang="ts">
  import {
    Button,
    buttonVariants,
    Dialog,
    Field,
    Form,
    Input,
  } from "@coss-sv/ui";
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
    Open Dialog
  </Dialog.Trigger>
  <Dialog.Popup class="sm:max-w-sm">
    <Dialog.Header>
      <Dialog.Title>Edit profile</Dialog.Title><Dialog.Description>
        Make changes to your profile here. Click save when you're done.
      </Dialog.Description>
    </Dialog.Header>
    <Form class="contents">
      <Dialog.Panel class="grid gap-4">
        <Field.Root>
          <Field.Label>Name</Field.Label><Input
            value="Margaret Welsh"
            type="text"
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Input value="@maggie.welsh" type="text" />
        </Field.Root>
      </Dialog.Panel>
      <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Dialog.Close><Button type="submit">Save</Button>
      </Dialog.Footer>
    </Form>
  </Dialog.Popup>
</Dialog.Root>
