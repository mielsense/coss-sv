<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["autocomplete", "spinner"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-autocomplete-12",
    interactive: true,
    responsive: false,
    title: "Autocomplete with async items loading",
  });
</script>

<script lang="ts">
  import { Autocomplete, Spinner } from "@coss-sv/ui";

  type Movie = { id: string; title: string; year: number };
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
  let searchValue = $state("");
  let loading = $state(false);
  let results = $state<Movie[]>([]);
  let error = $state<string | null>(null);
  let request = 0;
  async function searchMovies(value: string): Promise<Movie[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (value === "will_error") throw new Error("Network error");
    const query = value.toLowerCase();
    return movies.filter(
      (movie) => movie.title.toLowerCase().includes(query) || String(movie.year).includes(query),
    );
  }
  async function search(value: string): Promise<void> {
    searchValue = value;
    const current = ++request;
    if (!value) {
      results = [];
      loading = false;
      error = null;
      return;
    }
    loading = true;
    error = null;
    try {
      const nextResults = await searchMovies(value);
      if (current !== request) return;
      results = nextResults;
    } catch {
      if (current !== request) return;
      error = "Failed to fetch movies. Please try again.";
      results = [];
    } finally {
      if (current === request) loading = false;
    }
  }
</script>

<Autocomplete.Root
  filter={null}
  items={results}
  itemToStringValue={(movie: Movie) => movie.title}
  onValueChange={search}
  value={searchValue}
>
  <Autocomplete.Input placeholder="e.g. Pulp Fiction or 1994" />
  {#if searchValue}
    <Autocomplete.Popup aria-busy={loading || undefined}>
      <Autocomplete.Status class="text-muted-foreground">
        {#if loading}<span class="flex items-center justify-between gap-2 text-muted-foreground"
            >Searching... <Spinner class="size-4.5 sm:size-4" /></span
          >
        {:else if error}<span class="font-normal text-destructive text-sm">{error}</span>
        {:else if results.length === 0}<span class="font-normal text-muted-foreground text-sm"
            >Movie or year "{searchValue}" does not exist in the Top 100 IMDb movies</span
          >
        {:else}{results.length} result{results.length === 1 ? "" : "s"} found{/if}
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
