<script lang="ts">
  import { Avatar, Badge, Button, Field, Form, HugeiconsIcon, Label } from "@coss-sv/ui";
  import { Cancel01Icon, Search01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
  import * as Combobox from "../../../../../../packages/ui/dist/components/ui/combobox/index.js";

  type Item = { label: string; value: string };
  type Tag = { group: string; id: string; label: string };
  type Group = { value: string; items: Tag[] };
  type Person = Item & { email: string; initials: string; role: string };

  const items: Item[] = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
    { label: "Grape", value: "grape" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Mango", value: "mango" },
    { label: "Pineapple", value: "pineapple" },
    { label: "Kiwi", value: "kiwi" },
    { label: "Peach", value: "peach" },
    { label: "Pear", value: "pear" },
  ];
  const tags: Tag[] = [
    { group: "Status", id: "s-open", label: "Open" },
    { group: "Status", id: "s-progress", label: "In progress" },
    { group: "Status", id: "s-blocked", label: "Blocked" },
    { group: "Priority", id: "p-low", label: "Low" },
    { group: "Priority", id: "p-medium", label: "Medium" },
    { group: "Priority", id: "p-high", label: "High" },
    { group: "Team", id: "t-design", label: "Design" },
    { group: "Team", id: "t-frontend", label: "Frontend" },
    { group: "Team", id: "t-backend", label: "Backend" },
  ];
  const groupedTags: Group[] = ["Status", "Priority", "Team"].map((value) => ({
    value,
    items: tags.filter((tag) => tag.group === value),
  }));
  const countries = [
    { code: "GB", label: "United Kingdom", value: "united-kingdom" },
    { code: "US", label: "United States", value: "united-states" },
    { code: "CA", label: "Canada", value: "canada" },
    { code: "FR", label: "France", value: "france" },
    { code: "DE", label: "Germany", value: "germany" },
    { code: "JP", label: "Japan", value: "japan" },
  ];
  const timezones = [
    { label: "(GMT-08:00) Pacific Time", value: "America/Los_Angeles" },
    { label: "(GMT-05:00) Eastern Time", value: "America/New_York" },
    { label: "(GMT+00:00) London", value: "Europe/London" },
    { label: "(GMT+01:00) Paris", value: "Europe/Paris" },
    { label: "(GMT+09:00) Tokyo", value: "Asia/Tokyo" },
  ];
  const people: Person[] = [
    {
      email: "olivia@example.com",
      initials: "OM",
      label: "Olivia Martin",
      role: "Owner",
      value: "olivia",
    },
    {
      email: "jackson@example.com",
      initials: "JL",
      label: "Jackson Lee",
      role: "Member",
      value: "jackson",
    },
    {
      email: "isabella@example.com",
      initials: "IN",
      label: "Isabella Nguyen",
      role: "Member",
      value: "isabella",
    },
    {
      email: "william@example.com",
      initials: "WK",
      label: "William Kim",
      role: "Member",
      value: "william",
    },
  ];

  let chips = $state<Item[]>([items[0] as Item, items[4] as Item]);
  let searchChips = $state<Item[]>([items[0] as Item, items[3] as Item]);
  let selectedTeam = $state<Person[]>([people[0] as Person, people[2] as Person]);

  function removeMember(member: Person): void {
    selectedTeam = selectedTeam.filter((item) => item !== member);
  }
</script>

{#snippet itemPopup(empty = "No items found.")}
  <Combobox.Popup>
    <Combobox.Empty>{empty}</Combobox.Empty>
    <Combobox.List>
      <Combobox.Collection>
        {#snippet children(item: Item)}
          <Combobox.Item value={item}>{item.label}</Combobox.Item>
        {/snippet}
      </Combobox.Collection>
    </Combobox.List>
  </Combobox.Popup>
{/snippet}

{#snippet searchIcon()}
  <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
{/snippet}

{#snippet teamSelection(particle: "p-combobox-19" | "p-combobox-20")}
  <div class="flex w-full flex-col gap-2">
    <Combobox.Root bind:value={selectedTeam} items={people} multiple
      ><Combobox.Input
        aria-label="Add team members"
        placeholder="Add team members…"
        startAddon={searchIcon}
      /><Combobox.Popup
        ><Combobox.Empty>No team members found.</Combobox.Empty><Combobox.List
          ><Combobox.Collection
            >{#snippet children(person: Person)}
              <Combobox.Item value={person}>{person.label}</Combobox.Item>
            {/snippet}</Combobox.Collection
          ></Combobox.List
        ></Combobox.Popup
      ></Combobox.Root
    >
    <ul class={particle === "p-combobox-19" ? "flex flex-col gap-2" : "divide-y rounded-lg border"}>
      {#each selectedTeam as member (member.value)}
        <li
          class={particle === "p-combobox-19"
            ? "flex items-center gap-2 rounded-lg border border-input p-1 ps-2 text-base sm:text-sm"
            : "flex items-center gap-2 p-1 ps-2 text-base sm:text-sm"}
        >
          <Avatar.Root class="size-5"
            ><Avatar.Fallback class="text-[.625rem]">{member.initials}</Avatar.Fallback
            ></Avatar.Root
          ><span class="truncate font-medium">{member.label}</span>
          {#if particle === "p-combobox-20"}
            <Badge class="ms-auto" size="sm" variant="outline">{member.role}</Badge>
          {:else}
            <Badge class="ms-auto" variant="outline">{member.role}</Badge>
          {/if}
          <span class="text-muted-foreground text-xs tabular-nums">{member.email}</span><Button
            aria-label={`Remove ${member.label}`}
            onclick={() => removeMember(member)}
            size="icon-sm"
            variant="ghost"
            ><HugeiconsIcon aria-hidden="true" icon={Cancel01Icon} strokeWidth={2} /></Button
          >
        </li>
      {/each}
    </ul>
  </div>
{/snippet}

<div class="fixture">
  <section data-particle="p-combobox-1">
    <Combobox.Root {items}
      ><Combobox.Input aria-label="Select a item" placeholder="Select a item…" />
      {@render itemPopup()}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-2">
    <Combobox.Root disabled {items} value={items[2]}
      ><Combobox.Input aria-label="Select an item" placeholder="Select an item…" />
      {@render itemPopup()}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-3">
    <Combobox.Root {items}
      ><Combobox.Input aria-label="Select an item" placeholder="Select an item..." size="sm" />
      {@render itemPopup("No results found.")}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-4">
    <Combobox.Root {items}
      ><Combobox.Input aria-label="Select an item" placeholder="Select an item..." size="lg" />
      {@render itemPopup("No results found.")}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-5">
    <Combobox.Root {items}
      ><div class="flex flex-col items-start gap-2">
        <Label for="combobox-fruits">Fruits</Label>
        <Combobox.Input
          aria-label="Select an item"
          id="combobox-fruits"
          placeholder="Select an item..."
        />
      </div>
      {@render itemPopup("No results found.")}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-6">
    <Combobox.Root autoHighlight {items}
      ><Combobox.Input aria-label="Select an item" placeholder="Select an item..." />
      {@render itemPopup("No results found.")}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-7">
    <Combobox.Root {items}
      ><Combobox.Input aria-label="Select a item" placeholder="Select a item…" showClear />
      {@render itemPopup()}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-8">
    <Combobox.Root items={groupedTags}>
      <Combobox.Input aria-label="Search tags" placeholder="e.g. feature" />
      <Combobox.Popup
        ><Combobox.Empty>No tags found.</Combobox.Empty><Combobox.List
          ><Combobox.Collection>
            {#snippet children(group: Group)}
              <Combobox.Group items={group.items}
                ><Combobox.GroupLabel>{group.value}</Combobox.GroupLabel><Combobox.Collection>
                  {#snippet children(tag: Tag)}
                    <Combobox.Item value={tag}>{tag.label}</Combobox.Item>
                  {/snippet}
                </Combobox.Collection></Combobox.Group
              >
              {#if group.value !== "Team"}
                <Combobox.Separator />
              {/if}
            {/snippet}
          </Combobox.Collection></Combobox.List
        ></Combobox.Popup
      >
    </Combobox.Root>
  </section>
  <section data-particle="p-combobox-9">
    <Combobox.Root bind:value={chips} {items} multiple
      ><Combobox.Chips>
        {#each chips as item (item.value)}
          <Combobox.Chip aria-label={item.label}>{item.label}</Combobox.Chip>
        {/each}
        {#if chips.length}
          <Combobox.ChipsInput aria-label="Select a item" />
        {:else}
          <Combobox.ChipsInput aria-label="Select a item" placeholder="Select a item..." />
        {/if}
      </Combobox.Chips>{@render itemPopup()}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-10">
    <Combobox.Root items={countries} value={countries[0]}
      ><Combobox.Trigger
        class="inline-flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm shadow-xs"
        ><Combobox.Value />
        <HugeiconsIcon
          aria-hidden="true"
          class="-me-1!"
          icon={UnfoldMoreIcon}
          strokeWidth={2}
        /></Combobox.Trigger
      ><Combobox.Popup aria-label="Select country"
        ><div class="border-b p-2">
          <Combobox.Input
            class="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
            placeholder="e.g. United Kingdom"
            startAddon={searchIcon}
          />
        </div>
        <Combobox.Empty>No countries found.</Combobox.Empty><Combobox.List
          ><Combobox.Collection
            >{#snippet children(country: (typeof countries)[number])}
              <Combobox.Item value={country}>{country.label}</Combobox.Item>
            {/snippet}</Combobox.Collection
          ></Combobox.List
        ></Combobox.Popup
      ></Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-11">
    <Form
      class="flex w-full max-w-64 flex-col gap-4"
      onsubmit={(event: SubmitEvent) => event.preventDefault()}
      ><Field.Root name="item"
        ><Field.Label>Favorite item</Field.Label><Combobox.Root {items} required
          ><Combobox.Input placeholder="Select an item..." />
          {@render itemPopup("No results found.")}</Combobox.Root
        ><Field.Error>Please select a item.</Field.Error></Field.Root
      ><Button type="submit">Submit</Button></Form
    >
  </section>
  <section data-particle="p-combobox-12">
    <Form
      class="flex w-full max-w-64 flex-col gap-4"
      onsubmit={(event: SubmitEvent) => event.preventDefault()}
      ><Field.Root name="items"
        ><Field.Label>Favorite items</Field.Label><Combobox.Root
          bind:value={chips}
          {items}
          multiple
          required
          ><Combobox.Chips>
            {#each chips as item (item.value)}
              <Combobox.Chip>{item.label}</Combobox.Chip>
            {/each}
            {#if chips.length}
              <Combobox.ChipsInput />
            {:else}
              <Combobox.ChipsInput placeholder="Select items…" />
            {/if}
          </Combobox.Chips>{@render itemPopup()}</Combobox.Root
        ><Field.Error>Please select at least one item.</Field.Error></Field.Root
      ><Button type="submit">Submit</Button></Form
    >
  </section>
  <section data-particle="p-combobox-13">
    <Combobox.Root {items}
      ><Combobox.Input
        aria-label="Search items"
        placeholder="Search items…"
        startAddon={searchIcon}
      />{@render itemPopup()}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-14">
    <Combobox.Root bind:value={searchChips} {items} multiple
      ><Combobox.Chips startAddon={searchIcon}>
        {#each searchChips as item (item.value)}
          <Combobox.Chip>{item.label}</Combobox.Chip>
        {/each}
        {#if searchChips.length}
          <Combobox.ChipsInput aria-label="Select a item" />
        {:else}
          <Combobox.ChipsInput aria-label="Select a item" placeholder="Select a item..." />
        {/if}
      </Combobox.Chips>{@render itemPopup()}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-15">
    <Combobox.Root {items}
      ><Combobox.Input
        aria-label="Select a item"
        class="[--radius-lg:9999px] [--radius:9999px]"
        placeholder="Select a item..."
      />{@render itemPopup()}</Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-16">
    <Combobox.Root items={timezones} value={timezones[3]}
      ><Combobox.Input aria-label="Select timezone" placeholder="Select timezone..." />
      <Combobox.Popup
        ><Combobox.Empty>No timezones found.</Combobox.Empty><Combobox.List
          ><Combobox.Collection
            >{#snippet children(item: (typeof timezones)[number])}
              <Combobox.Item value={item}>{item.label}</Combobox.Item>
            {/snippet}</Combobox.Collection
          ></Combobox.List
        ></Combobox.Popup
      ></Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-17">
    <Combobox.Root autoHighlight items={timezones}
      ><Combobox.Trigger
        class="inline-flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm shadow-xs"
        ><Combobox.Value placeholder="Select timezone" />
        <HugeiconsIcon
          aria-hidden="true"
          class="-me-1!"
          icon={UnfoldMoreIcon}
          strokeWidth={2}
        /></Combobox.Trigger
      ><Combobox.Popup aria-label="Select timezone"
        ><div class="border-b p-2">
          <Combobox.Input
            class="rounded-md"
            placeholder="e.g. Europe/London"
            startAddon={searchIcon}
          />
        </div>
        <Combobox.Empty>No timezones found.</Combobox.Empty><Combobox.List
          ><Combobox.Collection
            >{#snippet children(item: (typeof timezones)[number])}
              <Combobox.Item value={item}>{item.label}</Combobox.Item>
            {/snippet}</Combobox.Collection
          ></Combobox.List
        ></Combobox.Popup
      ></Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-18">
    <Combobox.Root {items}
      ><Combobox.Trigger
        class="inline-flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm shadow-xs"
        ><Combobox.Value placeholder="Select a fruit" />
        <HugeiconsIcon
          aria-hidden="true"
          class="-me-1!"
          icon={UnfoldMoreIcon}
          strokeWidth={2}
        /></Combobox.Trigger
      ><Combobox.Popup aria-label="Select a fruit"
        ><div class="border-b p-2">
          <Combobox.Input
            class="rounded-md"
            placeholder="Search fruits..."
            startAddon={searchIcon}
          />
        </div>
        <Combobox.Empty>No items found.</Combobox.Empty>
        <Combobox.List
          ><Combobox.Collection>
            {#snippet children(item: Item)}
              <Combobox.Item value={item}>{item.label}</Combobox.Item>
            {/snippet}
          </Combobox.Collection></Combobox.List
        ></Combobox.Popup
      ></Combobox.Root
    >
  </section>
  <section data-particle="p-combobox-19">{@render teamSelection("p-combobox-19")}</section>
  <section data-particle="p-combobox-20">{@render teamSelection("p-combobox-20")}</section>
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
  .fixture :global([data-slot="combobox-input-group"]),
  .fixture :global([data-slot="combobox-trigger"]) {
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
