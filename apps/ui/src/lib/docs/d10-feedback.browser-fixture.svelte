<script lang="ts">
  import { Alert, AlertDescription, AlertTitle, Button, Progress, Toast } from "@coss-sv/ui";

  function perform() {
    const id = Toast.toastManager.add({
      actionProps: {
        children: "Undo",
        onclick: () => {
          Toast.toastManager.close(id);
        },
      },
      description: "You can undo this action.",
      timeout: 1_000_000,
      title: "Action performed",
      type: "success",
    });
  }
</script>

<section aria-label="Alert example">
  <Alert><AlertTitle>Heads up!</AlertTitle><AlertDescription>Details</AlertDescription></Alert>
</section>
<section aria-label="Progress example">
  <Progress.Root value={60}>
    <Progress.Label>Export data</Progress.Label>
    <Progress.Track><Progress.Indicator /></Progress.Track>
  </Progress.Root>
</section>
<section aria-label="Toast example">
  <Toast.Provider><Button onclick={perform}>Perform Action</Button></Toast.Provider>
</section>
