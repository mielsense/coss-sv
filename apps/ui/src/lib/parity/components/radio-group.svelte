<script lang="ts">
  import { Button, Field, FieldsetLegend, Form, Label, RadioGroup } from "@coss-sv/ui";

  const items = [
    { label: "System", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ] as const;

  const segmentedControlRootClassName =
    "relative z-0 flex w-fit items-center justify-center gap-0.5 rounded-lg bg-muted p-0.5";
  const segmentedControlItemBaseClassName =
    "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md border border-transparent font-medium text-base text-muted-foreground/72 outline-2 outline-transparent transition-[outline-color] hover:bg-transparent hover:text-muted-foreground focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-64 data-disabled:pointer-events-none data-disabled:opacity-64 sm:text-sm gap-1.5 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0 data-checked:bg-background data-checked:text-foreground data-checked:shadow-sm/5 dark:data-checked:bg-input grow";
  const segmentedControlItemSizes = {
    default: "h-8.5 px-[calc(--spacing(2.5)-1px)] sm:h-7.5",
    lg: "h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5",
    sm: "h-7.5 px-[calc(--spacing(2)-1px)] sm:h-6.5",
  } as const;

  let loading = $state(false);
  const fixtureId = $props.id();
  const frameworksLegendId = `${fixtureId}-frameworks-legend`;
  const themeLegendId = `${fixtureId}-theme-legend`;

  async function submitFrameworks(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    loading = true;
    await new Promise((resolve) => setTimeout(resolve, 800));
    loading = false;
    alert(`Selected: ${formData.get("frameworks")}`);
  }
</script>

{#snippet themePreview(theme: (typeof items)[number]["value"])}
  {#if theme === "dark"}
    <svg
      aria-hidden="true"
      class="size-full"
      fill="none"
      viewBox="0 0 88 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="fill-neutral-900" d="M0 0h88v70H0z" />
      <path class="fill-neutral-800 shadow-sm" d="M10 12a4 4 0 0 1 4-4h74v62H10V12Z" />
      <circle class="fill-neutral-600" cx="28" cy="26" r="8" />
      <rect class="fill-neutral-700" height="4" rx="2" width="58" x="20" y="42" />
      <rect class="fill-neutral-700" height="4" rx="2" width="58" x="20" y="49" />
      <rect class="fill-neutral-700" height="4" rx="2" width="29" x="20" y="56" />
    </svg>
  {:else if theme === "light"}
    <svg
      aria-hidden="true"
      class="size-full"
      fill="none"
      viewBox="0 0 88 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="fill-neutral-200" d="M0 0h88v70H0z" />
      <path class="fill-white shadow-sm" d="M10 12a4 4 0 0 1 4-4h74v62H10V12Z" />
      <circle class="fill-neutral-300" cx="28" cy="26" r="8" />
      <rect class="fill-neutral-200" height="4" rx="2" width="58" x="20" y="42" />
      <rect class="fill-neutral-200" height="4" rx="2" width="58" x="20" y="49" />
      <rect class="fill-neutral-200" height="4" rx="2" width="29" x="20" y="56" />
    </svg>
  {:else}
    <svg
      aria-hidden="true"
      class="size-full"
      fill="none"
      viewBox="0 0 88 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="fill-neutral-200" d="M0 0h44v70H0z" />
      <path class="fill-neutral-900" d="M44 0h44v70H44z" />
      <path class="fill-white shadow-sm" d="M10 12a4 4 0 0 1 4-4h30v62H10V12Z" />
      <circle class="fill-neutral-300" cx="28" cy="26" r="8" />
      <path
        class="fill-neutral-200"
        d="M20 44a2 2 0 0 1 2-2h22v4H22a2 2 0 0 1-2-2ZM20 51a2 2 0 0 1 2-2h22v4H22a2 2 0 0 1-2-2ZM20 58a2 2 0 0 1 2-2h22v4H22a2 2 0 0 1-2-2Z"
      />
      <path class="fill-neutral-800 shadow-sm" d="M54 12a4 4 0 0 1 4-4h30v62H54V12Z" />
      <circle class="fill-neutral-600" cx="72" cy="26" r="8" />
      <path
        class="fill-neutral-700"
        d="M64 44a2 2 0 0 1 2-2h22v4H66a2 2 0 0 1-2-2ZM64 51a2 2 0 0 1 2-2h22v4H66a2 2 0 0 1-2-2ZM64 58a2 2 0 0 1 2-2h22v4H66a2 2 0 0 1-2-2Z"
      />
    </svg>
  {/if}
{/snippet}

<div data-particle="p-radio-group-1">
  <RadioGroup.Root defaultValue="next">
    <Label><RadioGroup.Item value="next" /> Next.js</Label>
    <Label><RadioGroup.Item value="vite" /> Vite</Label>
    <Label><RadioGroup.Item value="astro" /> Astro</Label>
  </RadioGroup.Root>
</div>

<div data-particle="p-radio-group-2">
  <RadioGroup.Root defaultValue="next">
    <Label><RadioGroup.Item value="next" /> Next.js</Label>
    <Label><RadioGroup.Item disabled value="vite" /> Vite (disabled)</Label>
    <Label><RadioGroup.Item value="astro" /> Astro</Label>
  </RadioGroup.Root>
</div>

<div data-particle="p-radio-group-3">
  <RadioGroup.Root defaultValue="r-1">
    <div class="flex items-start gap-2">
      <RadioGroup.Item id="r-1" value="r-1" />
      <div class="flex flex-col gap-1">
        <Label for="r-1">Free</Label>
        <p class="text-muted-foreground text-xs">Basic features for personal use.</p>
      </div>
    </div>
    <div class="flex items-start gap-2">
      <RadioGroup.Item id="r-2" value="r-2" />
      <div class="flex flex-col gap-1">
        <Label for="r-2">Pro</Label>
        <p class="text-muted-foreground text-xs">Advanced tools for professionals.</p>
      </div>
    </div>
  </RadioGroup.Root>
</div>

<div data-particle="p-radio-group-4">
  <RadioGroup.Root defaultValue="r-1">
    <Label
      class="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
    >
      <RadioGroup.Item value="r-1" />
      <div class="flex flex-col gap-1">
        <p>Email</p>
        <p class="text-muted-foreground text-xs">Receive notifications via email.</p>
      </div>
    </Label>
    <Label
      class="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
    >
      <RadioGroup.Item value="r-2" />
      <div class="flex flex-col gap-1">
        <p>SMS</p>
        <p class="text-muted-foreground text-xs">Receive notifications via text message.</p>
      </div>
    </Label>
  </RadioGroup.Root>
</div>

<div data-particle="p-radio-group-5">
  <Form class="flex w-full max-w-[160px] flex-col gap-4" onsubmit={submitFrameworks}>
    <Field.Root aria-labelledby={frameworksLegendId} as="fieldset" class="gap-2" name="frameworks">
      <FieldsetLegend id={frameworksLegendId} class="font-medium text-sm">Frameworks</FieldsetLegend
      >
      <RadioGroup.Root aria-labelledby={frameworksLegendId} defaultValue="next" name="frameworks">
        <Field.Item><Field.Label><RadioGroup.Item value="next" /> Next.js</Field.Label></Field.Item>
        <Field.Item><Field.Label><RadioGroup.Item value="vite" /> Vite</Field.Label></Field.Item>
        <Field.Item><Field.Label><RadioGroup.Item value="astro" /> Astro</Field.Label></Field.Item>
      </RadioGroup.Root>
    </Field.Root>
    <Button {loading} type="submit">Submit</Button>
  </Form>
</div>

<div data-particle="p-radio-group-6">
  <Field.Root aria-labelledby={themeLegendId} as="fieldset" class="gap-4" name="theme">
    <FieldsetLegend id={themeLegendId} class="font-medium text-sm">Choose a theme</FieldsetLegend>
    <RadioGroup.Root
      aria-labelledby={themeLegendId}
      class="flex-row gap-4"
      defaultValue="system"
      name="theme"
    >
      {#each items as item (item.value)}
        <Field.Item>
          <Field.Label class="cursor-pointer flex-col">
            <RadioGroup.Item class="peer sr-only absolute" value={item.value} />
            <span
              class="relative block h-[70px] w-[88px] overflow-hidden rounded-lg not-peer-data-checked:opacity-80 shadow-xs transition-shadow peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-64 peer-data-checked:ring-2 peer-data-checked:ring-primary/48 peer-data-checked:ring-offset-1 peer-data-checked:ring-offset-background"
            >
              {@render themePreview(item.value)}
            </span>
            <span class="not-peer-data-checked:text-muted-foreground/70">{item.label}</span>
          </Field.Label>
        </Field.Item>
      {/each}
    </RadioGroup.Root>
  </Field.Root>
</div>

{#each [{ particle: "p-radio-group-7", size: "sm" }, { particle: "p-radio-group-8", size: "default" }, { particle: "p-radio-group-9", size: "lg" }] as example (example.particle)}
  <div data-particle={example.particle}>
    <RadioGroup.RadioGroupPrimitive
      aria-label="Billing period"
      class={segmentedControlRootClassName}
      value="monthly"
    >
      <RadioGroup.RadioPrimitive.Root
        class={`${segmentedControlItemBaseClassName} ${segmentedControlItemSizes[example.size as keyof typeof segmentedControlItemSizes]}`}
        value="monthly">Monthly</RadioGroup.RadioPrimitive.Root
      >
      <RadioGroup.RadioPrimitive.Root
        class={`${segmentedControlItemBaseClassName} ${segmentedControlItemSizes[example.size as keyof typeof segmentedControlItemSizes]}`}
        value="yearly">Yearly</RadioGroup.RadioPrimitive.Root
      >
    </RadioGroup.RadioGroupPrimitive>
  </div>
{/each}
