<script lang="ts">
import { Button, Checkbox, Field, Input, InputGroup, Switch, Textarea } from "@coss-sv/ui";
</script>

<div class="parity-stack">
  <section class="w-full max-w-64" data-particle="p-field-1" id="p-field-1">
    <Field.Root>
      <Field.Label>Name</Field.Label>
      <Input placeholder="Enter your name" type="text" />
      <Field.Description>Visible on your profile</Field.Description>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-field-2" id="p-field-2">
    <Field.Root>
      <Field.Label>Password <span class="text-destructive-foreground">*</span></Field.Label>
      <Input placeholder="Enter password" required type="password" />
      <Field.Error>Please fill out this field.</Field.Error>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-field-3" id="p-field-3">
    <Field.Root disabled>
      <Field.Label>Email</Field.Label>
      <Input disabled placeholder="Enter your email" type="email" />
      <Field.Description>This field is currently disabled.</Field.Description>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-field-4" id="p-field-4">
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Input placeholder="Enter your email" type="email" />
      <Field.Error>Please enter a valid email address.</Field.Error>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-field-5" id="p-field-5">
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Input placeholder="Enter your email" required type="email" />
      <Field.Validity>
        {#snippet children(validity)}
          <div class="flex w-full flex-col gap-2">
            {#if validity.error}
              <p class="text-destructive-foreground text-xs">{validity.error}</p>
            {/if}
            <div class="w-full rounded-md bg-muted p-2">
              <pre
                class="max-h-60 overflow-y-auto font-mono text-xs [scrollbar-width:none]"
              >{JSON.stringify(validity, null, 2)}</pre>
            </div>
          </div>
        {/snippet}
      </Field.Validity>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-field-6" id="p-field-6">
    <Field.Root>
      <Field.Label>Subscribe</Field.Label>
      <InputGroup.Root>
        <InputGroup.Input placeholder="Your best email" type="email" />
        <InputGroup.Addon align="inline-end">
          <Button aria-label="Subscribe" size="icon-xs" variant="ghost">
            {@render arrowRightIcon()}
          </Button>
        </InputGroup.Addon>
      </InputGroup.Root>
      <Field.Error>Please enter a valid email address.</Field.Error>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-field-10" id="p-field-10">
    <Field.Root>
      <Field.Label>Bio</Field.Label>
      <Textarea placeholder="Tell us about yourself…" />
      <Field.Description>Write a short bio. Maximum 500 characters.</Field.Description>
    </Field.Root>
  </section>

  <section class="w-full max-w-64" data-particle="p-field-12" id="p-field-12">
    <Field.Root>
      <Field.Label>
        <Checkbox />
        Accept terms and conditions
      </Field.Label>
    </Field.Root>
  </section>

  <section class="w-fit" data-particle="p-field-15" id="p-field-15">
    <Field.Root>
      <Field.Label>
        <Switch />
        Email notifications
      </Field.Label>
    </Field.Root>
  </section>
</div>

{#snippet arrowRightIcon()}
  <svg
    aria-hidden="true"
    class="lucide lucide-arrow-right"
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
{/snippet}

<style>
.parity-stack {
  display: grid;
  width: 100%;
  gap: 2rem;
  place-items: center;
}
</style>
