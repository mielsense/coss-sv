<script lang="ts">
  import * as RadioGroup from "./index.js";

  let selected = $state("next");
  let frameworkDefault = $state("vite");
  let changes = $state<string[]>([]);
  let groupRef = $state<HTMLElement | null>(null);
  let itemRef = $state<HTMLElement | null>(null);
  let submitted = $state("none");
  let preventedClicks = $state(0);
  let rejectedValue = $state("email");
  let rejectedWrites = $state(0);

  function submit(event: SubmitEvent) {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    submitted = String(data.get("contact"));
  }
</script>

<RadioGroup.Root
  aria-label="Framework"
  bind:ref={groupRef}
  data-testid="framework-group"
  defaultValue={frameworkDefault}
  onValueChange={(value) => changes.push(String(value))}
>
  <label for="framework-next"
    ><RadioGroup.Item data-testid="framework-next" id="framework-next" value="next" />Next.js</label
  >
  <label for="framework-vite"
    ><RadioGroup.Item data-testid="framework-vite" id="framework-vite" value="vite" />Vite</label
  >
  <label for="framework-astro"
    ><RadioGroup.Item
      data-testid="framework-astro"
      disabled
      id="framework-astro"
      value="astro"
    />Astro</label
  >
  <label for="framework-svelte"
    ><RadioGroup.Item
      data-testid="framework-svelte"
      id="framework-svelte"
      value="svelte"
    />Svelte</label
  >
</RadioGroup.Root>
<button
  data-testid="change-framework-default"
  onclick={() => (frameworkDefault = "next")}
  type="button"
>
  Change framework default
</button>

<form data-testid="contact-form" onsubmit={submit}>
  <RadioGroup.Root aria-label="Contact method" bind:value={selected} name="contact" required>
    <label for="contact-email">
      <RadioGroup.Item
        bind:ref={itemRef}
        data-testid="contact-email"
        id="contact-email"
        value="email"
      />Email
    </label>
    <label for="contact-sms"
      ><RadioGroup.Item data-testid="contact-sms" id="contact-sms" value="sms" />SMS</label
    >
  </RadioGroup.Root>
  <button type="submit">Submit</button>
</form>

<RadioGroup.Root aria-label="Disabled group" defaultValue="one" disabled>
  <RadioGroup.Item aria-label="Disabled one" value="one" />
  <RadioGroup.Item aria-label="Disabled two" value="two" />
</RadioGroup.Root>

<RadioGroup.Root aria-label="Read only group" defaultValue="one" readOnly>
  <RadioGroup.Item aria-label="Read only one" value="one" />
  <RadioGroup.Item aria-label="Read only two" value="two" />
</RadioGroup.Root>

<RadioGroup.Root aria-label="Prevented group" defaultValue="one">
  <RadioGroup.Item aria-label="Prevented one" value="one" />
  <RadioGroup.Item
    aria-label="Prevented two"
    onclick={(event) => {
      preventedClicks += 1;
      event.preventDefault();
    }}
    value="two"
  />
</RadioGroup.Root>

<form data-testid="rejected-form">
  <RadioGroup.Root
    aria-label="Rejected contact method"
    bind:value={
      () => rejectedValue,
      () => {
        rejectedWrites += 1;
      }
    }
    name="rejected-contact"
  >
    <label for="rejected-email">
      <RadioGroup.Item data-testid="rejected-email" id="rejected-email" value="email" />Rejected
      email
    </label>
    <label for="rejected-sms">
      <RadioGroup.Item data-testid="rejected-sms" id="rejected-sms" value="sms" />Rejected SMS
    </label>
  </RadioGroup.Root>
</form>

<output data-testid="framework-changes">{changes.join(",")}</output>
<output data-testid="selected-value">{selected}</output>
<output data-testid="submitted-value">{submitted}</output>
<output data-testid="refs">{groupRef?.tagName ?? "missing"}:{itemRef?.tagName ?? "missing"}</output>
<output data-testid="prevented-clicks">{preventedClicks}</output>
<output data-testid="rejected-value">{rejectedValue}</output>
<output data-testid="rejected-writes">{rejectedWrites}</output>
