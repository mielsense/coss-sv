<script lang="ts">
  import { Label, Switch } from "@coss-sv/ui";

  let formValue = $state("not submitted");
  let controlled = $state(false);

  function submitProbe(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    formValue = String(formData.get("marketing"));
  }
</script>

<div data-particle="p-switch-1">
  <Label>
    <Switch data-testid="switch-primary" />
    Marketing emails
  </Label>
</div>

<div data-particle="p-switch-2">
  <Label>
    <Switch disabled />
    Marketing emails
  </Label>
</div>

<div class="flex items-start gap-2" data-particle="p-switch-3">
  <Switch checked id="switch-description" />
  <div class="flex flex-col gap-1">
    <Label for="switch-description">Marketing emails</Label>
    <p class="text-muted-foreground text-xs">
      By enabling marketing emails, you agree to receive emails.
    </p>
  </div>
</div>

<div data-particle="p-switch-4">
  <Label
    class="flex items-center gap-6 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
    for="switch-card"
  >
    <div class="flex flex-col gap-1">
      <p>Enable notifications</p>
      <p class="text-muted-foreground text-xs">
        You can enable or disable notifications at any time.
      </p>
    </div>
    <Switch
      checked
      class="[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3)]"
      id="switch-card"
    />
  </Label>
</div>

<div data-particle="p-switch-6">
  <Switch class="[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3)]" />
</div>

<div class="review-probes" data-review-probes="switch">
  <form onsubmit={submitProbe}>
    <Switch
      bind:checked={controlled}
      data-testid="switch-form"
      id="review-switch-form"
      name="marketing"
    />
    <label for="review-switch-form">Form switch</label>
    <button type="submit">Submit switch form</button>
  </form>
  <Switch aria-label="Disabled switch" data-testid="switch-disabled" disabled />
  <output data-testid="switch-form-output">{controlled}:{formValue}</output>
</div>

<style>
  .review-probes {
    display: grid;
    gap: 1rem;
    margin-top: 2rem;
  }

  .review-probes form,
  .review-probes label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
