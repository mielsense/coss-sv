<script lang="ts">
  import { Checkbox, Label } from "@coss-sv/ui";

  let formValue = $state("not submitted");
  let controlled = $state(false);

  function submitProbe(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    formValue = String(formData.get("terms"));
  }
</script>

<div data-particle="p-checkbox-1">
  <Label>
    <Checkbox data-testid="checkbox-primary" />
    Accept terms and conditions
  </Label>
</div>

<div data-particle="p-checkbox-2">
  <Label>
    <Checkbox checked disabled />
    Accept terms and conditions
  </Label>
</div>

<div class="flex items-start gap-2" data-particle="p-checkbox-3">
  <Checkbox checked id="checkbox-description" />
  <div class="flex flex-col gap-1">
    <Label for="checkbox-description">Accept terms and conditions</Label>
    <p class="text-muted-foreground text-xs">
      By clicking this checkbox, you agree to the terms and conditions.
    </p>
  </div>
</div>

<div data-particle="p-checkbox-4">
  <Label
    class="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
  >
    <Checkbox checked />
    <div class="flex flex-col gap-1">
      <p>Enable notifications</p>
      <p class="text-muted-foreground text-xs">
        You can enable or disable notifications at any time.
      </p>
    </div>
  </Label>
</div>

<div class="review-probes" data-review-probes="checkbox">
  <form onsubmit={submitProbe}>
    <Checkbox
      bind:checked={controlled}
      data-testid="checkbox-form"
      id="review-checkbox-form"
      name="terms"
      value="yes"
    />
    <label for="review-checkbox-form">Form checkbox</label>
    <button type="submit">Submit checkbox form</button>
  </form>
  <Checkbox
    aria-label="Indeterminate checkbox"
    data-testid="checkbox-indeterminate"
    indeterminate
  />
  <Checkbox aria-label="Disabled checkbox" data-testid="checkbox-disabled" disabled />
  <output data-testid="checkbox-form-output">{controlled}:{formValue}</output>
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
