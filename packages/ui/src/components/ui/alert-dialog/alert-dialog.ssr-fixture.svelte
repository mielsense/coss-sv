<script lang="ts">
  import * as AlertDialog from "./index.js";
</script>

<AlertDialog.Root open>
  <AlertDialog.Popup>
    <AlertDialog.Header
      ><AlertDialog.Title>Delete project?</AlertDialog.Title><AlertDialog.Description
        >This cannot be undone.</AlertDialog.Description
      ></AlertDialog.Header
    >
    <AlertDialog.Footer
      ><AlertDialog.Close>Cancel</AlertDialog.Close><AlertDialog.Close>Delete</AlertDialog.Close
      ></AlertDialog.Footer
    >
  </AlertDialog.Popup>
</AlertDialog.Root>
