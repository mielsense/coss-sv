<script lang="ts">
  import {
    Alert,
    AlertAction,
    AlertDescription,
    AlertTitle,
  } from "../../../../../../packages/ui/dist/components/ui/alert/index.js";
  import CossButton from "./c1-button.svelte";
  import FixtureIcon from "./fixture-icon.svelte";
</script>

<div class="alert-review-shell">
  <div class="alert-particle-shell">
    <Alert data-anchor="p-alert-3">
      <FixtureIcon aria-hidden="true" name="info-circle" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
      <AlertAction>
        <CossButton size="xs" variant="ghost">Dismiss</CossButton>
        <CossButton size="xs">Ok</CossButton>
      </AlertAction>
    </Alert>
  </div>
</div>

<style>
  .alert-review-shell {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    min-height: 24rem;
    align-items: center;
    justify-content: center;
  }

  .alert-particle-shell {
    width: 42.875rem;
    max-width: 100%;
  }

  @media (width < 40rem) {
    .alert-particle-shell {
      width: 19.25rem;
    }
  }
</style>
