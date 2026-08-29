<script lang="ts">
  import { Avatar, Button, Field, Form } from "@coss-sv/ui";
  import {
    CableIcon,
    CodeXmlIcon,
    GlobeIcon,
    LayersIcon,
    ZapIcon,
  } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import * as Select from "../../../../../../packages/ui/dist/components/ui/select/index.js";

  const frameworks = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Astro", value: "astro" },
    { label: "Remix", value: "remix" },
  ];
  const frontend = ["React", "Vue", "Svelte", "Angular"];
  const backend = ["Node.js", "Django", "Laravel", "Spring"];
  const languages = ["JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust"];
  const categories = [
    { icon: LayersIcon, label: "Components", value: "components" },
    { icon: ZapIcon, label: "Performance", value: "performance" },
    { icon: GlobeIcon, label: "Network", value: "network" },
    { icon: CodeXmlIcon, label: "Development", value: "development" },
  ];
  const commands = [
    { description: "npx create-next-app", label: "Next.js", value: "next" },
    { description: "npm create vite@latest", label: "Vite", value: "vite" },
    { description: "npm create astro@latest", label: "Astro", value: "astro" },
    { description: "npx create-remix", label: "Remix", value: "remix" },
  ];
  const timezones = [
    { label: "(GMT-08:00) Pacific Time", value: "America/Los_Angeles" },
    { label: "(GMT-05:00) Eastern Time", value: "America/New_York" },
    { label: "(GMT+00:00) London", value: "Europe/London" },
    { label: "(GMT+01:00) Paris", value: "Europe/Paris" },
  ];
  const statuses = [
    { color: "bg-slate-400", label: "Backlog", value: "backlog" },
    { color: "bg-blue-500", label: "In progress", value: "in-progress" },
    { color: "bg-amber-500", label: "In review", value: "in-review" },
    { color: "bg-emerald-500", label: "Done", value: "done" },
  ];
  const countries = [
    { continent: "North America", flag: "🇨🇦", label: "Canada", value: "ca" },
    { continent: "North America", flag: "🇺🇸", label: "United States", value: "us" },
    { continent: "Europe", flag: "🇫🇷", label: "France", value: "fr" },
    { continent: "Europe", flag: "🇩🇪", label: "Germany", value: "de" },
    { continent: "Asia", flag: "🇯🇵", label: "Japan", value: "jp" },
  ];
  const countryGroups = ["North America", "Europe", "Asia"].map((continent) => ({
    continent,
    items: countries.filter((country) => country.continent === continent),
  }));
  const plans = [
    { description: "Ideal for individuals", label: "Basic Plan", value: "basic" },
    { description: "For professional users", label: "Pro Plan", value: "pro" },
    { description: "Built for large teams", label: "Enterprise Plan", value: "enterprise" },
  ];
  const users = [
    { email: "olivia@example.com", initials: "OM", label: "Olivia Martin", value: "olivia" },
    { email: "jackson@example.com", initials: "JL", label: "Jackson Lee", value: "jackson" },
    { email: "isabella@example.com", initials: "IN", label: "Isabella Nguyen", value: "isabella" },
  ];
  const fruits = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ];
  let selectedLanguages = $state(["javascript", "typescript"]);
</script>

{#snippet frameworkItems(disabledValue = "")}
  {#each frameworks as item (item.value)}
    <Select.Item disabled={item.value === disabledValue} value={item.value}
      >{item.label}</Select.Item
    >
  {/each}
{/snippet}

{#snippet frameworkSelect(
  size: "sm" | "lg" | "default" = "default",
  disabled = false,
  align = true,
)}
  <Select.Root aria-label="Select framework" items={frameworks}>
    <Select.Trigger {disabled} {size}
      ><Select.Value placeholder="Select framework" /></Select.Trigger
    >
    <Select.Popup alignItemWithTrigger={align}>{@render frameworkItems()}</Select.Popup>
  </Select.Root>
{/snippet}

<div class="fixture">
  <section data-particle="p-select-1">
    <Select.Root aria-label="Select framework" items={frameworks} value="next"
      ><Select.Trigger><Select.Value /></Select.Trigger><Select.Popup
        >{@render frameworkItems()}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-2">{@render frameworkSelect("sm")}</section>
  <section data-particle="p-select-3">{@render frameworkSelect("lg")}</section>
  <section data-particle="p-select-4">{@render frameworkSelect("default", true)}</section>
  <section data-particle="p-select-5">{@render frameworkSelect("default", false, false)}</section>
  <section data-particle="p-select-6">
    <Select.Root aria-label="Select framework" items={[...frontend, ...backend]}
      ><Select.Trigger><Select.Value placeholder="Select framework" /></Select.Trigger><Select.Popup
        ><Select.Group
          ><Select.GroupLabel>Frontend</Select.GroupLabel>
          {#each frontend as value}
            <Select.Item {value}>{value}</Select.Item>
          {/each}</Select.Group
        ><Select.Separator />
        <Select.Group
          ><Select.GroupLabel>Backend</Select.GroupLabel>
          {#each backend as value}
            <Select.Item {value}>{value}</Select.Item>
          {/each}</Select.Group
        ></Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-7">
    <Select.Root
      aria-label="Select languages"
      bind:value={selectedLanguages}
      items={languages.map((label) => ({ label, value: label.toLowerCase() }))}
      multiple
      ><Select.Trigger
        ><Select.Value
          >{selectedLanguages.length
            ? `${selectedLanguages.length} selected`
            : "Select languages"}</Select.Value
        ></Select.Trigger
      ><Select.Popup alignItemWithTrigger={false}
        >{#each languages as label}
          <Select.Item value={label.toLowerCase()}>{label}</Select.Item>
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-8">
    <Select.Root aria-label="Select framework with icon" items={frameworks} value="next"
      ><Select.Trigger
        ><HugeiconsIcon aria-hidden="true" icon={CableIcon} strokeWidth={2} />
        <Select.Value /></Select.Trigger
      ><Select.Popup alignItemWithTrigger={false}>{@render frameworkItems()}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-9">
    <Select.Root aria-label="Select category" items={categories} value={categories[0]}
      ><Select.Trigger
        ><Select.Value
          >{#snippet children(item: (typeof categories)[number] | null)}
            {#if item}
              <span class="flex items-center gap-2"
                ><HugeiconsIcon aria-hidden="true" icon={item.icon} strokeWidth={2} />
                <span class="truncate">{item.label}</span></span
              >
            {/if}
          {/snippet}</Select.Value
        ></Select.Trigger
      ><Select.Popup
        >{#each categories as item (item.value)}
          <Select.Item value={item}
            ><span class="flex items-center gap-2"
              ><HugeiconsIcon aria-hidden="true" icon={item.icon} strokeWidth={2} />
              <span>{item.label}</span></span
            ></Select.Item
          >
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-10">
    <Select.Root aria-label="Select framework with command" items={commands} value={commands[0]}
      ><Select.Trigger class="py-1"
        ><Select.Value
          >{#snippet children(item: (typeof commands)[number] | null)}
            {#if item}
              <span class="flex flex-col"
                ><span class="truncate">{item.label}</span><span
                  class="truncate text-muted-foreground text-xs">{item.description}</span
                ></span
              >
            {/if}
          {/snippet}</Select.Value
        ></Select.Trigger
      ><Select.Popup
        >{#each commands as item (item.value)}
          <Select.Item value={item}
            ><span class="flex flex-col"
              ><span>{item.label}</span><span class="text-muted-foreground text-xs"
                >{item.description}</span
              ></span
            ></Select.Item
          >
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-11">
    <Form
      class="flex w-full max-w-64 flex-col gap-4"
      onsubmit={(event: SubmitEvent) => event.preventDefault()}
      ><Field.Root
        ><Field.Label>Framework</Field.Label><Select.Root
          aria-label="Select framework"
          items={frameworks}
          required
          ><Select.Trigger><Select.Value placeholder="Select a framework" /></Select.Trigger
          ><Select.Popup>{@render frameworkItems()}</Select.Popup></Select.Root
        ><Field.Description>Pick your favorite.</Field.Description><Field.Error
          >Please select a value.</Field.Error
        ></Field.Root
      ><Button type="submit">Submit</Button></Form
    >
  </section>
  <section data-particle="p-select-12">
    <Select.Root aria-label="Select framework" items={frameworks} value="next"
      ><Select.Trigger><Select.Value /></Select.Trigger><Select.Popup
        >{@render frameworkItems("astro")}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-13">
    <Select.Root aria-label="Select timezone" items={timezones} value={timezones[3]}
      ><Select.Trigger
        ><Select.Value
          >{#snippet children(item: (typeof timezones)[number] | null)}
            {#if item}
              <span class="truncate">{item.label}</span>
            {/if}
          {/snippet}</Select.Value
        ></Select.Trigger
      ><Select.Popup
        >{#each timezones as item (item.value)}
          <Select.Item value={item}>{item.label}</Select.Item>
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-14">
    <Select.Root aria-label="Select status" items={statuses} value={statuses[0]}
      ><Select.Trigger
        ><Select.Value
          >{#snippet children(item: (typeof statuses)[number] | null)}
            {#if item}
              <span class="flex items-center gap-2"
                ><span class={`size-2 rounded-full ${item.color}`}></span><span>{item.label}</span
                ></span
              >
            {/if}
          {/snippet}</Select.Value
        ></Select.Trigger
      ><Select.Popup
        >{#each statuses as item (item.value)}
          <Select.Item value={item}
            ><span class="flex items-center gap-2"
              ><span class={`size-2 rounded-full ${item.color}`}></span><span>{item.label}</span
              ></span
            ></Select.Item
          >
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-15">
    <Select.Root aria-label="Select filter" items={["all", "active", "inactive"]} value="active"
      ><Select.Trigger class="[--radius-lg:9999px] [--radius:9999px]"
        ><Select.Value /></Select.Trigger
      ><Select.Popup
        >{#each ["All", "Active", "Inactive"] as label}
          <Select.Item value={label.toLowerCase()}>{label}</Select.Item>
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-16">
    <Select.Root aria-label="Select language" items={languages} value={languages[0]}
      ><Select.Trigger
        ><Select.Value
          >{#snippet children(item: string | null)}
            {#if item}
              <span class="truncate"
                ><span class="text-muted-foreground">Language:</span> {item}</span
              >
            {/if}
          {/snippet}</Select.Value
        ></Select.Trigger
      ><Select.Popup alignItemWithTrigger={false}
        >{#each languages as item}
          <Select.Item value={item}>{item}</Select.Item>
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-17">
    <Select.Root aria-label="Select country" items={countries} value={countries[0]}
      ><Select.Trigger
        ><Select.Value
          >{#snippet children(item: (typeof countries)[number] | null)}
            {#if item}
              <span class="flex items-center gap-2"
                ><span class="text-base leading-none">{item.flag}</span><span>{item.label}</span
                ></span
              >
            {/if}
          {/snippet}</Select.Value
        ></Select.Trigger
      ><Select.Popup
        >{#each countryGroups as group, index}
          <Select.Group
            >{#if index > 0}
              <Select.Separator />
            {/if}
            <Select.GroupLabel>{group.continent}</Select.GroupLabel>
            {#each group.items as item (item.value)}
              <Select.Item value={item}
                ><span class="flex items-center gap-2"
                  ><span class="text-base leading-none">{item.flag}</span><span>{item.label}</span
                  ></span
                ></Select.Item
              >
            {/each}</Select.Group
          >
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-18">
    <Select.Root aria-label="Select plan" items={plans} value={plans[1]}
      ><Select.Trigger
        ><Select.Value
          >{#snippet children(item: (typeof plans)[number] | null)}
            {#if item}
              <span class="truncate">{item.label}</span>
            {/if}
          {/snippet}</Select.Value
        ></Select.Trigger
      ><Select.Popup alignItemWithTrigger={false}
        >{#each plans as item (item.value)}
          <Select.Item value={item}
            ><span class="flex flex-col"
              ><span>{item.label}</span><span class="text-muted-foreground text-xs"
                >{item.description}</span
              ></span
            ></Select.Item
          >
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-19">
    <Select.Root aria-label="Select user" items={users} value={users[0]}
      ><Select.Trigger
        ><Select.Value
          >{#snippet children(item: (typeof users)[number] | null)}
            {#if item}
              <span class="flex items-center gap-2"
                ><Avatar.Root class="size-5"
                  ><Avatar.Fallback class="text-[.625rem]">{item.initials}</Avatar.Fallback
                  ></Avatar.Root
                ><span>{item.label}</span></span
              >
            {/if}
          {/snippet}</Select.Value
        ></Select.Trigger
      ><Select.Popup
        ><Select.Group
          ><Select.GroupLabel>Impersonate user</Select.GroupLabel>
          {#each users as item (item.value)}
            <Select.Item value={item}
              ><span class="flex items-center gap-2"
                ><Avatar.Root class="size-5"
                  ><Avatar.Fallback class="text-[10px]">{item.initials}</Avatar.Fallback
                  ></Avatar.Root
                ><span>{item.label}</span></span
              ></Select.Item
            >
          {/each}</Select.Group
        ></Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-20">
    <Select.Root aria-label="Select user" items={users} value={users[0]}
      ><Select.Trigger class="h-auto py-1.5"
        ><Select.Value
          >{#snippet children(item: (typeof users)[number] | null)}
            {#if item}
              <span class="flex items-center gap-2"
                ><Avatar.Root class="size-8"
                  ><Avatar.Fallback>{item.initials}</Avatar.Fallback></Avatar.Root
                ><span class="flex flex-col text-left"
                  ><span class="truncate font-medium">{item.label}</span><span
                    class="truncate text-muted-foreground text-xs">{item.email}</span
                  ></span
                ></span
              >
            {/if}
          {/snippet}</Select.Value
        ></Select.Trigger
      ><Select.Popup
        >{#each users as item (item.value)}
          <Select.Item class="py-1.5" value={item}
            ><span class="flex items-center gap-2"
              ><Avatar.Root class="size-8"
                ><Avatar.Fallback>{item.initials}</Avatar.Fallback></Avatar.Root
              ><span class="flex flex-col"
                ><span class="font-medium">{item.label}</span><span
                  class="text-muted-foreground text-xs">{item.email}</span
                ></span
              ></span
            ></Select.Item
          >
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-21">
    <Select.Root aria-label="Select framework" items={frameworks} value="next"
      ><Select.Trigger class="w-fit"><Select.Value /></Select.Trigger><Select.Popup
        >{@render frameworkItems()}</Select.Popup
      ></Select.Root
    >
  </section>
  <section data-particle="p-select-22">
    <Select.Root aria-label="Select framework" items={frameworks} value="next"
      ><Select.Trigger class="border-transparent bg-muted shadow-none before:hidden"
        ><Select.Value /></Select.Trigger
      ><Select.Popup>{@render frameworkItems()}</Select.Popup></Select.Root
    >
  </section>
  <section data-particle="p-select-23">
    <Select.Root aria-label="Select fruit" items={fruits} value={fruits[0]}
      ><Select.Label>Fruits</Select.Label><Select.Trigger><Select.Value /></Select.Trigger
      ><Select.Popup
        >{#each fruits as item (item.value)}
          <Select.Item value={item}>{item.label}</Select.Item>
        {/each}</Select.Popup
      ></Select.Root
    >
  </section>
</div>

<style>
  .fixture {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3rem 2rem;
    padding: 2rem;
  }
  .fixture section {
    display: flex;
    width: 100%;
    max-width: 16rem;
    min-width: 0;
    align-items: center;
    justify-self: center;
    justify-content: center;
  }
  .fixture section > :global(*) {
    width: 100%;
    max-width: 16rem;
  }
  .fixture :global([data-slot="select-trigger"]) {
    max-width: 16rem;
  }
  @media (max-width: 639px) {
    .fixture {
      grid-template-columns: minmax(0, 1fr);
      gap: 2rem;
      padding: 1.5rem;
    }
  }
</style>
