<script lang="ts">
import { Field } from "@shardsui/svelte";
import Textarea from "./textarea.svelte";

let textareaRef = $state<HTMLTextAreaElement | null>(null);
let value = $state("Draft");
let inputs = $state(0);
let valueChange = $state("none");
</script>

<form data-testid="textarea-form">
  <Textarea
    bind:ref={textareaRef}
    bind:value
    data-testid="bound-textarea"
    name="message"
    oninput={() => (inputs += 1)}
  />
  <Textarea data-testid="default-value-textarea" defaultValue="Default draft" name="defaulted" />
  <Textarea data-testid="callback-textarea" onValueChange={(next) => (valueChange = next)} />
  <Textarea aria-invalid="true" data-testid="readonly-textarea" readonly value="Locked" />
</form>
<Field.Root>
  <Textarea data-testid="field-textarea" required />
</Field.Root>
<Field.Root validationMode="onChange">
  <Textarea data-testid="validated-textarea" required value="Initial message" />
  <Field.Error data-testid="textarea-error" match="valueMissing">Message is required.</Field.Error>
</Field.Root>
<output data-testid="textarea-state">{value}:{inputs}:{textareaRef?.tagName ?? "missing"}</output>
<output data-testid="textarea-callback-state">{valueChange}</output>
