<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["autocomplete", "spinner"],
    containerClass: "**:data-[slot=preview]:w-full **:data-[slot=preview]:max-w-64",
    id: "p-autocomplete-16",
    interactive: true,
    responsive: false,
    title: "Address autocomplete with Google Maps Places API",
  });
</script>

<script lang="ts">
  import { Autocomplete, Spinner } from "@coss-sv/ui";
  import { Location01Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";

  type Address = { placeId: string; text: string; mainText: string; secondaryText: string };
  const addresses: Address[] = [
    ["1600 Amphitheatre Parkway", "Mountain View, CA 94043, USA"],
    ["1600 Pennsylvania Avenue NW", "Washington, DC 20500, USA"],
    ["350 Fifth Avenue", "New York, NY 10118, USA"],
    ["221B Baker Street", "London NW1 6XE, United Kingdom"],
    ["Champ de Mars, 5 Avenue Anatole France", "75007 Paris, France"],
    ["Piazza del Colosseo, 1", "00184 Roma RM, Italy"],
    ["Platz der Republik 1", "11011 Berlin, Germany"],
    ["1 Macquarie Street", "Sydney NSW 2000, Australia"],
  ].map(([mainText, secondaryText], index) => ({
    placeId: `sample-${index + 1}`,
    mainText,
    secondaryText,
    text: `${mainText}, ${secondaryText}`,
  }));
  let value = $state("");
  let loading = $state(false);
  let suggestions = $state<Address[]>([]);
  let request = 0;
  async function search(next: string): Promise<void> {
    value = next;
    const current = ++request;
    if (!next.trim()) {
      suggestions = [];
      loading = false;
      return;
    }
    loading = true;
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (current !== request) return;
    suggestions = addresses.filter((address) =>
      address.text.toLowerCase().includes(next.toLowerCase()),
    );
    loading = false;
  }
</script>

<Autocomplete.Root
  autoHighlight
  filter={null}
  items={suggestions}
  itemToStringValue={(item: Address) => item.text}
  onValueChange={search}
  {value}
>
  <Autocomplete.Input
    aria-label="Address"
    autocomplete="off"
    class="min-w-0 *:[input]:truncate"
    placeholder="Enter an address"
  >
    {#snippet startAddon()}<HugeiconsIcon
        aria-hidden="true"
        icon={Location01Icon}
        strokeWidth={2}
      />{/snippet}
  </Autocomplete.Input>
  {#if value.trim()}
    <Autocomplete.Popup aria-busy={loading || undefined} class="max-w-(--anchor-width) *:min-w-0">
      <Autocomplete.Status class="text-muted-foreground">
        {#if loading}<span class="flex items-center justify-between gap-2"
            >Searching addresses... <Spinner class="size-4.5 sm:size-4" /></span
          >
        {:else if suggestions.length === 0}<span class="font-normal text-sm"
            >No addresses found for "{value}"</span
          >
        {:else}{suggestions.length} suggestion{suggestions.length === 1 ? "" : "s"} found{/if}
      </Autocomplete.Status>
      <Autocomplete.List
        ><Autocomplete.Collection>
          {#snippet children(suggestion: Address)}
            <Autocomplete.Item value={suggestion}
              ><span class="flex w-full min-w-0 flex-col"
                ><span class="truncate font-medium">{suggestion.mainText}</span><span
                  class="truncate text-muted-foreground text-xs">{suggestion.secondaryText}</span
                ></span
              ></Autocomplete.Item
            >
          {/snippet}
        </Autocomplete.Collection></Autocomplete.List
      >
    </Autocomplete.Popup>
  {/if}
</Autocomplete.Root>
