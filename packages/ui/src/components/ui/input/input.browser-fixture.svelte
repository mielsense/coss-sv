<script lang="ts">
import { Field } from "@shardsui/svelte";
import * as LocalField from "../field/index.js";
import Input from "./input.svelte";

let inputRef = $state<HTMLInputElement | null>(null);
let value = $state("seed");
let changes = $state(0);
let valueChange = $state("none");
let nativeInputRef = $state<HTMLInputElement | null>(null);
let nativeValue = $state("native seed");
let nativeInputs = $state(0);
let fileChanges = $state(0);
let nativeFileChanges = $state(0);
</script>

<form data-testid="input-form">
  <Input
    bind:ref={inputRef}
    bind:value
    class="fixture-input"
    data-forwarded="yes"
    data-testid="bound-input"
    name="query"
    oninput={() => (changes += 1)}
  />
  <Input data-testid="default-value-input" defaultValue="default seed" name="defaulted" />
  <Input data-testid="callback-input" onValueChange={(next) => (valueChange = next)} />
  <Input data-testid="file-input" name="asset" onchange={() => (fileChanges += 1)} type="file" />
  <Input
    bind:ref={nativeInputRef}
    bind:value={nativeValue}
    data-testid="native-input"
    name="native"
    nativeInput
    oninput={() => (nativeInputs += 1)}
  />
  <Input
    data-testid="native-default-value-input"
    defaultValue="native default"
    name="native-defaulted"
    nativeInput
  />
  <Input
    data-testid="native-file-input"
    name="native-asset"
    nativeInput
    onchange={() => (nativeFileChanges += 1)}
    type="file"
  />
  <Input aria-invalid="true" data-testid="invalid-input" disabled />
</form>
<Field.Root>
  <Input data-testid="field-input" required />
</Field.Root>
<LocalField.Root>
  <LocalField.Label>Removed input label</LocalField.Label>
  <Input aria-labelledby={null} data-testid="null-aria-input" />
  <LocalField.Description>Removed input description</LocalField.Description>
</LocalField.Root>
<output data-testid="input-state">{value}:{changes}:{inputRef?.tagName ?? "missing"}</output>
<output data-testid="input-callback-state">{valueChange}</output>
<output data-testid="native-input-state"
  >{nativeValue}:{nativeInputs}:{nativeInputRef?.tagName ?? "missing"}</output
>
<output data-testid="file-state">{fileChanges}:{nativeFileChanges}</output>
