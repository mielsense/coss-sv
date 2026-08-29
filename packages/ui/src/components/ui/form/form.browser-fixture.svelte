<script lang="ts">
  import { fromAction } from "svelte/attachments";
  import * as Field from "../field/index.js";
  import Input from "../input/input.svelte";
  import { Form } from "./index.js";

  let nativeResult = $state("idle");
  let valuesResult = $state("idle");
  let validateAllForm = $state<{ validate: (fieldName?: string) => void }>();
  let validateOneForm = $state<{ validate: (fieldName?: string) => void }>();
  let attachedTag = $state("missing");
  let delayedErrors = $state<Record<string, string | string[]>>({});

  function handleNativeSubmit(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
  ) {
    event.preventDefault();
    nativeResult = String(new FormData(event.currentTarget).get("email"));
  }

  function enhanceProbe(node: HTMLFormElement) {
    attachedTag = node.tagName;
  }
</script>

<Form action="?/save" method="POST" data-testid="native-form" onsubmit={handleNativeSubmit}>
  <Field.Root name="email">
    <Field.Label>Email</Field.Label>
    <Input data-testid="native-email" value="miel@example.com" />
  </Field.Root>
  <button type="submit">Native submit</button>
</Form>
<output data-testid="native-result">{nativeResult}</output>

<Form data-testid="values-form" onFormSubmit={(values) => (valuesResult = String(values.username))}>
  <Field.Root name="username" validate={(value) => (value ? null : "Username is required.")}>
    <Field.Label>Username</Field.Label>
    <Input data-testid="username" />
    <Field.Error data-testid="username-error" />
  </Field.Root>
  <button type="submit">Values submit</button>
</Form>
<output data-testid="values-result">{valuesResult}</output>

<Form errors={{ server: "Already used." }}>
  <Field.Root name="server">
    <Field.Label>Server field</Field.Label>
    <Input data-testid="server-control" />
    <Field.Error data-testid="server-error" />
  </Field.Root>
</Form>

<Form bind:this={validateAllForm} data-testid="validate-all-form">
  <Field.Root name="all-first" validate={(value) => (value ? null : "First required.")}>
    <Field.Label>All first</Field.Label>
    <Input data-testid="all-first" />
    <Field.Error data-testid="all-first-error" />
  </Field.Root>
  <Field.Root name="all-second" validate={(value) => (value ? null : "Second required.")}>
    <Field.Label>All second</Field.Label>
    <Input data-testid="all-second" />
    <Field.Error data-testid="all-second-error" />
  </Field.Root>
</Form>
<button data-testid="validate-all" type="button" onclick={() => validateAllForm?.validate()}>
  Validate all
</button>

<Form bind:this={validateOneForm} data-testid="validate-one-form">
  <Field.Root name="one-first" validate={(value) => (value ? null : "First required.")}>
    <Field.Label>One first</Field.Label>
    <Input data-testid="one-first" />
    <Field.Error data-testid="one-first-error" />
  </Field.Root>
  <Field.Root name="one-second" validate={(value) => (value ? null : "Second required.")}>
    <Field.Label>One second</Field.Label>
    <Input data-testid="one-second" />
    <Field.Error data-testid="one-second-error" />
  </Field.Root>
</Form>
<button
  data-testid="validate-one"
  type="button"
  onclick={() => validateOneForm?.validate("one-second")}
>
  Validate one
</button>

<Form {@attach fromAction(enhanceProbe)} data-testid="attached-form" />
<output data-testid="attached-tag">{attachedTag}</output>

<Form
  errors={delayedErrors}
  onsubmit={(event) => {
    event.preventDefault();
    setTimeout(() => {
      delayedErrors = {
        delayedFirst: "First server error.",
        delayedSecond: "Second server error.",
      };
    }, 20);
  }}
>
  <Field.Root name="delayedFirst">
    <Field.Label>Delayed first</Field.Label>
    <Input data-testid="delayed-first" />
    <Field.Error data-testid="delayed-first-error" />
  </Field.Root>
  <Field.Root name="delayedSecond">
    <Field.Label>Delayed second</Field.Label>
    <Input data-testid="delayed-second" />
    <Field.Error data-testid="delayed-second-error" />
  </Field.Root>
  <button data-testid="delayed-submit" type="submit">Delayed submit</button>
</Form>
