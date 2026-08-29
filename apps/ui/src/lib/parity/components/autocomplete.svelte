<script lang="ts">
  import { Button, Field, Form, HugeiconsIcon, Label, Spinner } from "@coss-sv/ui";
  import { Location01Icon, Search01Icon } from "@hugeicons/core-free-icons";
  import * as Autocomplete from "../../../../../../packages/ui/dist/components/ui/autocomplete/index.js";

  type Item = { label: string; value: string };
  type Tag = { id: string; label: string; group: "Status" | "Priority" | "Team" };
  type TagGroup = { value: string; items: Tag[] };
  type Movie = { id: string; title: string; year: number };

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
    { group: "Status", id: "s-in-progress", label: "In progress" },
    { group: "Status", id: "s-blocked", label: "Blocked" },
    { group: "Status", id: "s-resolved", label: "Resolved" },
    { group: "Status", id: "s-closed", label: "Closed" },
    { group: "Priority", id: "p-low", label: "Low" },
    { group: "Priority", id: "p-medium", label: "Medium" },
    { group: "Priority", id: "p-high", label: "High" },
    { group: "Priority", id: "p-urgent", label: "Urgent" },
    { group: "Team", id: "t-design", label: "Design" },
    { group: "Team", id: "t-frontend", label: "Frontend" },
    { group: "Team", id: "t-backend", label: "Backend" },
    { group: "Team", id: "t-devops", label: "DevOps" },
    { group: "Team", id: "t-qa", label: "QA" },
    { group: "Team", id: "t-mobile", label: "Mobile" },
    { group: "Team", id: "t-data", label: "Data" },
    { group: "Team", id: "t-security", label: "Security" },
    { group: "Team", id: "t-platform", label: "Platform" },
    { group: "Team", id: "t-infra", label: "Infrastructure" },
    { group: "Team", id: "t-product", label: "Product" },
  ];
  const groupedTags: TagGroup[] = ["Status", "Priority", "Team"].map((value) => ({
    value,
    items: tags.filter((tag) => tag.group === value),
  })) as TagGroup[];
  const languages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "C",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Scala",
    "Elixir",
    "Haskell",
    "Dart",
  ];
  const movies: Movie[] = [
    { id: "1", title: "The Shawshank Redemption", year: 1994 },
    { id: "2", title: "The Godfather", year: 1972 },
    { id: "3", title: "The Dark Knight", year: 2008 },
    { id: "4", title: "The Godfather Part II", year: 1974 },
    { id: "5", title: "12 Angry Men", year: 1957 },
    { id: "8", title: "Pulp Fiction", year: 1994 },
    { id: "11", title: "Forrest Gump", year: 1994 },
    { id: "14", title: "Inception", year: 2010 },
  ];

  let limitedValue = $state("");
  let movieQuery = $state("");
  let movieResults = $state<Movie[]>([]);
  let movieLoading = $state(false);
  let controlledValue = $state("");
  let addressQuery = $state("");
  let addresses = $state<string[]>([]);
  let addressLoading = $state(false);
  let request = 0;

  async function searchMovies(query: string): Promise<void> {
    const id = ++request;
    movieQuery = query;
    movieLoading = query.length > 0;
    if (!query) {
      movieResults = [];
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (id !== request) return;
    const normalized = query.toLowerCase();
    movieResults = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(normalized) || String(movie.year).includes(query),
    );
    movieLoading = false;
  }

  async function searchAddresses(query: string): Promise<void> {
    addressQuery = query;
    addressLoading = query.length > 0;
    addresses = [];
    if (!query) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
    addresses = [
      "1600 Amphitheatre Parkway, Mountain View, CA",
      "1 Apple Park Way, Cupertino, CA",
      "350 Fifth Avenue, New York, NY",
    ].filter((address) => address.toLowerCase().includes(query.toLowerCase()));
    addressLoading = false;
  }
</script>

{#snippet itemList()}
  <Autocomplete.Empty>No items found.</Autocomplete.Empty>
  <Autocomplete.List>
    <Autocomplete.Collection>
      {#snippet children(item: Item)}
        <Autocomplete.Item value={item}>{item.label}</Autocomplete.Item>
      {/snippet}
    </Autocomplete.Collection>
  </Autocomplete.List>
{/snippet}

{#snippet searchIcon()}
  <HugeiconsIcon aria-hidden="true" icon={Search01Icon} strokeWidth={2} />
{/snippet}

{#snippet mapPinIcon()}
  <HugeiconsIcon aria-hidden="true" icon={Location01Icon} strokeWidth={2} />
{/snippet}

<div class="fixture">
  <section data-particle="p-autocomplete-1">
    <Autocomplete.Root {items}>
      <Autocomplete.Input aria-label="Search items" placeholder="Search items…" />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-2">
    <Autocomplete.Root disabled {items}>
      <Autocomplete.Input aria-label="Search items" placeholder="Search items…" />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-3">
    <Autocomplete.Root {items}>
      <Autocomplete.Input aria-label="Search items" placeholder="Search items…" size="sm" />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-4">
    <Autocomplete.Root {items}>
      <Autocomplete.Input aria-label="Search items" placeholder="Search items…" size="lg" />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-5">
    <Autocomplete.Root {items}>
      <Label>Fruits</Label>
      <Autocomplete.Input aria-label="Search items" placeholder="Search items…" />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-6">
    <Autocomplete.Root {items}>
      <Autocomplete.Input aria-label="Search items" placeholder="Search items…" showTrigger />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-7">
    <Autocomplete.Root {items}>
      <Autocomplete.Input aria-label="Search items" placeholder="Search items…" showClear />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-8">
    <Autocomplete.Root {items}>
      <Autocomplete.Input
        aria-label="Search items"
        placeholder="Search items…"
        showClear
        showTrigger
      />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-9">
    <Autocomplete.Root autoHighlight {items}>
      <Autocomplete.Input aria-label="Search items" placeholder="Search items…" />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-10">
    <Autocomplete.Root items={groupedTags}>
      <Autocomplete.Input aria-label="Search tags" placeholder="e.g. feature" />
      <Autocomplete.Popup>
        <Autocomplete.Empty>No tags found.</Autocomplete.Empty>
        <Autocomplete.List>
          <Autocomplete.Collection>
            {#snippet children(group: TagGroup)}
              <Autocomplete.Group items={group.items}>
                <Autocomplete.GroupLabel>{group.value}</Autocomplete.GroupLabel>
                <Autocomplete.Collection>
                  {#snippet children(tag: Tag)}
                    <Autocomplete.Item value={tag}>{tag.label}</Autocomplete.Item>
                  {/snippet}
                </Autocomplete.Collection>
              </Autocomplete.Group>
              {#if group.value !== "Team"}
                <Autocomplete.Separator />
              {/if}
            {/snippet}
          </Autocomplete.Collection>
        </Autocomplete.List>
      </Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-11">
    <Autocomplete.Root bind:value={limitedValue} items={languages} limit={7}>
      <Autocomplete.Input placeholder="e.g. feature" />
      <Autocomplete.Popup>
        <Autocomplete.Empty>No tags found.</Autocomplete.Empty>
        <Autocomplete.List>
          <Autocomplete.Collection>
            {#snippet children(language: string)}
              <Autocomplete.Item value={language}>{language}</Autocomplete.Item>
            {/snippet}
          </Autocomplete.Collection>
        </Autocomplete.List>
        {#if Math.max(0, languages.length - 7) > 0}
          <Autocomplete.Status
            >+{Math.max(0, languages.length - 7)}
            more (keep typing to narrow down)</Autocomplete.Status
          >
        {/if}
      </Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-12">
    <Autocomplete.Root
      filter={null}
      items={movieResults}
      itemToStringValue={(item: unknown) => (item as Movie).title}
      onValueChange={searchMovies}
      value={movieQuery}
    >
      <Autocomplete.Input placeholder="e.g. Pulp Fiction or 1994" />
      {#if movieQuery}
        <Autocomplete.Popup aria-busy={movieLoading || undefined}>
          <Autocomplete.Status class="text-muted-foreground">
            {#if movieLoading}
              <span class="flex items-center justify-between gap-2"
                >Searching...<Spinner class="size-4.5 sm:size-4" /></span
              >
            {:else if movieResults.length === 0}
              <span class="font-normal text-sm"
                >Movie or year "{movieQuery}" does not exist in the Top 100 IMDb movies</span
              >
            {:else}
              {movieResults.length}
              result{movieResults.length === 1 ? "" : "s"}
              found
            {/if}
          </Autocomplete.Status>
          <Autocomplete.List>
            <Autocomplete.Collection>
              {#snippet children(movie: Movie)}
                <Autocomplete.Item value={movie}
                  ><div class="flex w-full flex-col gap-1">
                    <div class="font-medium">{movie.title}</div>
                    <div class="text-muted-foreground text-xs">{movie.year}</div>
                  </div></Autocomplete.Item
                >
              {/snippet}
            </Autocomplete.Collection>
          </Autocomplete.List>
        </Autocomplete.Popup>
      {/if}
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-13">
    <Form
      class="flex w-full max-w-64 flex-col gap-4"
      onsubmit={(event: SubmitEvent) => event.preventDefault()}
    >
      <Field.Root name="item">
        <Field.Label>Favorite item</Field.Label>
        <Autocomplete.Root {items} required>
          <Autocomplete.Input placeholder="Search items…" />
          <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
        </Autocomplete.Root>
        <Field.Error>Please select a item.</Field.Error>
      </Field.Root>
      <Button type="submit">Submit</Button>
    </Form>
  </section>
  <section data-particle="p-autocomplete-14">
    <Autocomplete.Root {items}>
      <Autocomplete.Input
        aria-label="Search items"
        placeholder="Search items…"
        startAddon={searchIcon}
      />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-15">
    <Autocomplete.Root {items} bind:value={controlledValue}>
      <Autocomplete.Input
        aria-label="Search items"
        class="[--radius-lg:9999px] [--radius:9999px]"
        placeholder="Search items..."
      />
      <Autocomplete.Popup>{@render itemList()}</Autocomplete.Popup>
    </Autocomplete.Root>
  </section>
  <section data-particle="p-autocomplete-16">
    <Autocomplete.Root
      filter={null}
      items={addresses}
      onValueChange={searchAddresses}
      value={addressQuery}
    >
      <Autocomplete.Input
        aria-label="Address"
        class="min-w-0 *:[input]:truncate"
        placeholder="Enter an address"
        startAddon={mapPinIcon}
      />
      {#if addressQuery}
        <Autocomplete.Popup aria-busy={addressLoading || undefined}>
          <Autocomplete.Status class="text-muted-foreground"
            >{addressLoading
              ? "Searching addresses..."
              : `${addresses.length} results found`}</Autocomplete.Status
          >
          <Autocomplete.List>
            <Autocomplete.Collection>
              {#snippet children(address: string)}
                <Autocomplete.Item value={address}>{address}</Autocomplete.Item>
              {/snippet}
            </Autocomplete.Collection>
          </Autocomplete.List>
        </Autocomplete.Popup>
      {/if}
    </Autocomplete.Root>
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
  .fixture :global([data-slot="autocomplete-input-group"]) {
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
