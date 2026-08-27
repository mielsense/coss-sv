<script lang="ts">
import * as InputGroup from "./index.js";

let value = $state("seed");
let inputRef = $state<HTMLInputElement | null>(null);
let textareaValue = $state("notes");
let password = $state("");
let passwordVisible = $state(false);
</script>

<InputGroup.Root data-testid="root">
  <InputGroup.Addon data-testid="focus-addon"
    ><InputGroup.Text>https://</InputGroup.Text></InputGroup.Addon
  >
  <InputGroup.Input bind:ref={inputRef} bind:value data-testid="control" name="url" />
  <InputGroup.Addon align="inline-end"
    ><button data-testid="interactive" type="button">Clear</button></InputGroup.Addon
  >
</InputGroup.Root>
<output data-testid="state">{value}:{inputRef?.tagName ?? "missing"}</output>

<InputGroup.Root>
  <InputGroup.Textarea bind:value={textareaValue} data-testid="textarea" />
  <InputGroup.Addon align="block-end" data-testid="block-addon">Characters</InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input data-testid="overridden-control" />
  <InputGroup.Addon data-testid="overridden-addon" onmousedown={(event) => event.preventDefault()}>
    Override
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input
    bind:value={password}
    data-testid="password-control"
    type={passwordVisible ? "text" : "password"}
  />
  <InputGroup.Addon align="inline-end">
    <button
      aria-label={passwordVisible ? "Hide password" : "Show password"}
      data-testid="password-toggle"
      onclick={() => (passwordVisible = !passwordVisible)}
      type="button"
    >
      Toggle
    </button>
  </InputGroup.Addon>
</InputGroup.Root>
<output data-testid="password-state">{password}</output>
