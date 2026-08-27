<script lang="ts">
import * as AlertDialog from "./index.js";
let open = $state(false);
</script>
<AlertDialog.Root bind:open
  ><AlertDialog.Trigger>Delete project</AlertDialog.Trigger
  ><AlertDialog.Popup
    ><AlertDialog.Header
      ><AlertDialog.Title>Delete project?</AlertDialog.Title
      ><AlertDialog.Description
        >This action cannot be undone.</AlertDialog.Description
      ></AlertDialog.Header
    ><AlertDialog.Footer
      ><AlertDialog.Close>Cancel</AlertDialog.Close
      ><AlertDialog.Close>Delete</AlertDialog.Close></AlertDialog.Footer
    ></AlertDialog.Popup
  ></AlertDialog.Root
>
<output data-testid="alert-state">{open}</output>
<style>
:global([data-slot="alert-dialog-backdrop"]),
:global([data-slot="alert-dialog-viewport"]) {
  z-index: 50;
}
</style>
