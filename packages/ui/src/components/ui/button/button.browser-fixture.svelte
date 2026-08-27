<script lang="ts">
import Button from "./button.svelte";

let clicks = $state(0);
let loading = $state(false);
let buttonRef = $state<HTMLElement | null>(null);
let linkRef = $state<HTMLElement | null>(null);
</script>

<form data-testid="button-form" onsubmit={(event) => event.preventDefault()}>
  <Button bind:ref={buttonRef} data-testid="button" onclick={() => (clicks += 1)}>Button</Button>
  <Button data-testid="submit" type="submit">Submit</Button>
  <Button data-testid="disabled" disabled onclick={() => (clicks += 1)}>Disabled</Button>
  <Button data-testid="loading" {loading} onclick={() => (clicks += 1)}>Loading</Button>
</form>
<Button bind:ref={linkRef} data-testid="link" href="#button-link">Link</Button>
<Button as="div" data-testid="polymorphic" onclick={() => (clicks += 1)}>Div button</Button>
<Button as="div" data-testid="disabled-polymorphic" disabled onclick={() => (clicks += 1)}
  >Disabled div button</Button
>
<button type="button" onclick={() => (loading = !loading)}>Toggle loading</button>
<output data-testid="button-state"
  >{clicks}:{loading}:{buttonRef?.tagName ?? "missing"}:{linkRef?.tagName ?? "missing"}</output
>
