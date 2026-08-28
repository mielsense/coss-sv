<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: [
      "alert-dialog",
      "button",
      "dialog",
      "field",
      "form",
      "textarea",
    ],
    id: "p-dialog-4",
    interactive: true,
    responsive: true,
    title: "Close confirmation dialog",
  });
</script>

<script lang="ts">
  import {
    AlertDialog,
    Button,
    buttonVariants,
    Dialog,
    Field,
    Form,
    Textarea,
  } from "@coss-sv/ui";

  let dialogOpen = $state(false);
  let confirmOpen = $state(false);
  let value = $state("");
  function changeDialog(open: boolean) {
    if (!open && value) confirmOpen = true;
    else dialogOpen = open;
  }
  function discard() {
    confirmOpen = false;
    value = "";
    dialogOpen = false;
  }
</script>

<Dialog.Root open={dialogOpen} onOpenChange={changeDialog}>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
    Compose
  </Dialog.Trigger>
  <Dialog.Popup showCloseButton={false}>
    <Dialog.Header>
      <Dialog.Title>New message</Dialog.Title><Dialog.Description>
        Type something and try closing.
      </Dialog.Description>
    </Dialog.Header>
    <Form
      class="contents"
      onsubmit={(event) => {
        event.preventDefault();
        dialogOpen = false;
      }}
    >
      <Dialog.Panel>
        <Field.Root><Textarea bind:value /></Field.Root>
      </Dialog.Panel>
      <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Dialog.Close>
        <Button
          onclick={() => {
            value = "";
            dialogOpen = false;
          }}
        >
          Send
        </Button>
      </Dialog.Footer>
    </Form>
  </Dialog.Popup>
  <AlertDialog.Root
    open={confirmOpen}
    onOpenChange={(open) => (confirmOpen = open)}
  >
    <AlertDialog.Popup>
      <AlertDialog.Header>
        <AlertDialog.Title>
          Discard changes?
        </AlertDialog.Title><AlertDialog.Description>
          Your message will be lost.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Close class={buttonVariants({ variant: "ghost" })}>
          Go back
        </AlertDialog.Close><Button onclick={discard}>Discard</Button>
      </AlertDialog.Footer>
    </AlertDialog.Popup>
  </AlertDialog.Root>
</Dialog.Root>
