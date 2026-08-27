<script lang="ts">
import * as Dialog from "./index.js";
let dialogOpen = $state(false);
let nestedOpen = $state(false);
</script>
<Dialog.Root bind:open={dialogOpen} onOpenChange={(next) => (dialogOpen = next)}>
  <Dialog.Trigger>Open dialog</Dialog.Trigger>
  <Dialog.Popup>
    <Dialog.Header
      ><Dialog.Title>Profile</Dialog.Title
      ><Dialog.Description>Edit your profile.</Dialog.Description></Dialog.Header
    >
    <Dialog.Panel
      ><input aria-label="Name"><button type="button">Save</button
      ><Dialog.Root bind:open={nestedOpen}
        ><Dialog.Trigger>Open nested</Dialog.Trigger
        ><Dialog.Popup
          ><Dialog.Header
            ><Dialog.Title>Nested dialog</Dialog.Title
            ><Dialog.Description>Nested content.</Dialog.Description></Dialog.Header
          ><Dialog.Footer><Dialog.Close>Done</Dialog.Close></Dialog.Footer></Dialog.Popup
        ></Dialog.Root
      ></Dialog.Panel
    >
    <Dialog.Footer><Dialog.Close>Cancel</Dialog.Close></Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>
<output data-testid="dialog-state">{dialogOpen}:{nestedOpen}</output>
<style>
:global([data-slot="dialog-backdrop"]),
:global([data-slot="dialog-viewport"]) {
  z-index: 50;
}
</style>
