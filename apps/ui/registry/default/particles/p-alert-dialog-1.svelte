<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["alert-dialog", "button"],
    id: "p-alert-dialog-1",
    interactive: true,
    responsive: true,
    title: "Delete account alert dialog",
  });
</script>

<script lang="ts">
  import { AlertDialog, buttonVariants } from "@coss-sv/ui";
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger
    class={buttonVariants({ variant: "destructive-outline" })}
  >
    Delete Account
  </AlertDialog.Trigger>
  <AlertDialog.Popup>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Close class={buttonVariants({ variant: "ghost" })}>
        Cancel
      </AlertDialog.Close>
      <AlertDialog.Close class={buttonVariants({ variant: "destructive" })}>
        Delete Account
      </AlertDialog.Close>
    </AlertDialog.Footer>
  </AlertDialog.Popup>
</AlertDialog.Root>
