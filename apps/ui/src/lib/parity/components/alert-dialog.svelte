<script lang="ts">
import { AlertDialog, buttonVariants } from "@coss-sv/ui";
</script>
<div class="fixture">
  {#each ["default", "bare"] as variant, index}
    <section data-particle={`p-alert-dialog-${index + 1}`}>
      <AlertDialog.Root
        ><AlertDialog.Trigger class={buttonVariants({ variant: "destructive-outline" })}
          >Delete Account</AlertDialog.Trigger
        ><AlertDialog.Popup
          ><AlertDialog.Header
            ><AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title
            ><AlertDialog.Description
              >This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.</AlertDialog.Description
            ></AlertDialog.Header
          ><AlertDialog.Footer variant={variant as "default" | "bare"}
            ><AlertDialog.Close class={buttonVariants({ variant: "ghost" })}
              >Cancel</AlertDialog.Close
            ><AlertDialog.Close class={buttonVariants({ variant: "destructive" })}
              >Delete Account</AlertDialog.Close
            ></AlertDialog.Footer
          ></AlertDialog.Popup
        ></AlertDialog.Root
      >
    </section>
  {/each}
</div>
<style>
.fixture {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 3rem;
  padding: 2rem;
}
.fixture > section {
  display: flex;
  min-height: 12rem;
  align-items: center;
  justify-content: center;
}
</style>
