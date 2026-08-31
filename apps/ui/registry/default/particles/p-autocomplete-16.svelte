<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
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
  import { Autocomplete, HugeiconsIcon, Spinner } from "@coss-sv/ui";
  import Location01Icon from "@hugeicons/core-free-icons/Location01Icon";
  import { onDestroy } from "svelte";

  type AddressSuggestion = {
    placeId: string;
    text: string;
    mainText: string;
    secondaryText: string;
  };
  const sampleAddresses: AddressSuggestion[] = [
    { mainText: "1600 Amphitheatre Parkway", secondaryText: "Mountain View, CA 94043, USA" },
    { mainText: "1600 Pennsylvania Avenue NW", secondaryText: "Washington, DC 20500, USA" },
    { mainText: "350 Fifth Avenue", secondaryText: "New York, NY 10118, USA" },
    { mainText: "221B Baker Street", secondaryText: "London NW1 6XE, United Kingdom" },
    {
      mainText: "Champ de Mars, 5 Avenue Anatole France",
      secondaryText: "75007 Paris, France",
    },
    { mainText: "Piazza del Colosseo, 1", secondaryText: "00184 Roma RM, Italy" },
    { mainText: "Platz der Republik 1", secondaryText: "11011 Berlin, Germany" },
    { mainText: "1 Macquarie Street", secondaryText: "Sydney NSW 2000, Australia" },
  ].map((address, index) => ({
    ...address,
    placeId: `sample-${index + 1}`,
    text: `${address.mainText}, ${address.secondaryText}`,
  }));

  type PlacesAutocompleteResponse = {
    suggestions?: {
      placePrediction?: {
        placeId?: string;
        text?: { text?: string };
        structuredFormat?: {
          mainText?: { text?: string };
          secondaryText?: { text?: string };
        };
      };
    }[];
  };

  let searchValue = $state("");
  let loading = $state(false);
  let suggestions = $state<AddressSuggestion[]>([]);
  let error = $state<string | null>(null);
  let request = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let requestController: AbortController | undefined;
  let sessionToken: string | null = null;

  function getGoogleMapsApiKey(): string {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";
  }

  function newSessionToken(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2);
  }

  function waitForRequest(delay: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", abort);
        resolve();
      }, delay);
      const abort = (): void => {
        clearTimeout(timer);
        reject(new DOMException("The request was aborted.", "AbortError"));
      };
      signal.addEventListener("abort", abort, { once: true });
    });
  }

  async function fetchAddressSuggestions(
    query: string,
    token: string,
    signal: AbortSignal,
  ): Promise<AddressSuggestion[]> {
    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      body: JSON.stringify({ input: query, sessionToken: token }),
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": getGoogleMapsApiKey(),
      },
      method: "POST",
      signal,
    });
    if (!response.ok) throw new Error("Places API request failed");

    const data = (await response.json()) as PlacesAutocompleteResponse;
    const results: AddressSuggestion[] = [];
    for (const suggestion of data.suggestions ?? []) {
      const prediction = suggestion.placePrediction;
      if (!prediction?.placeId) continue;
      const text = prediction.text?.text ?? "";
      results.push({
        mainText: prediction.structuredFormat?.mainText?.text ?? text,
        placeId: prediction.placeId,
        secondaryText: prediction.structuredFormat?.secondaryText?.text ?? "",
        text,
      });
    }
    return results;
  }

  async function searchSampleAddresses(
    query: string,
    signal: AbortSignal,
  ): Promise<AddressSuggestion[]> {
    await waitForRequest(Math.random() * 500 + 100, signal);
    const lowerQuery = query.toLowerCase();
    return sampleAddresses.filter((address) => address.text.toLowerCase().includes(lowerQuery));
  }

  function resetSession(): void {
    sessionToken = null;
  }

  function search(next: string): void {
    searchValue = next;
    const query = next.trim();
    const current = ++request;
    clearTimeout(debounceTimer);
    requestController?.abort();
    requestController = undefined;

    if (!query) {
      suggestions = [];
      loading = false;
      error = null;
      return;
    }
    loading = true;
    error = null;
    debounceTimer = setTimeout(async () => {
      debounceTimer = undefined;
      const controller = new AbortController();
      requestController = controller;
      try {
        sessionToken ??= newSessionToken();
        const results = getGoogleMapsApiKey()
          ? await fetchAddressSuggestions(query, sessionToken, controller.signal)
          : await searchSampleAddresses(query, controller.signal);
        if (current !== request || controller.signal.aborted) return;
        suggestions = results;
      } catch {
        if (current !== request || controller.signal.aborted) return;
        error = "Could not load address suggestions. Please try again.";
        suggestions = [];
      } finally {
        if (current === request && !controller.signal.aborted) loading = false;
        if (requestController === controller) requestController = undefined;
      }
    }, 300);
  }

  onDestroy(() => {
    request += 1;
    clearTimeout(debounceTimer);
    requestController?.abort();
    sessionToken = null;
  });
</script>

<Autocomplete.Root
  autoHighlight
  filter={null}
  items={suggestions}
  itemToStringValue={(item: AddressSuggestion) => item.text}
  onValueChange={(value, details) => {
    search(value);
    if (details.reason === "item-press") resetSession();
  }}
  value={searchValue}
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
  {#if searchValue.trim()}
    <Autocomplete.Popup aria-busy={loading || undefined} class="max-w-(--anchor-width) *:min-w-0">
      <Autocomplete.Status class="text-muted-foreground">
        {#if loading}<span class="flex items-center justify-between gap-2">
            Searching addresses... <Spinner class="size-4.5 sm:size-4" />
          </span>
        {:else if error}<span class="font-normal text-destructive text-sm">{error}</span>
        {:else if suggestions.length === 0}<span class="font-normal text-muted-foreground text-sm">
            No addresses found for "{searchValue}"
          </span>
        {:else}{suggestions.length} suggestion{suggestions.length === 1 ? "" : "s"} found{/if}
      </Autocomplete.Status>
      <Autocomplete.List>
        <Autocomplete.Collection>
          {#snippet children(suggestion: AddressSuggestion)}
            <Autocomplete.Item value={suggestion}>
              <span class="flex w-full min-w-0 flex-col">
                <span class="truncate font-medium">{suggestion.mainText}</span>
                <span class="truncate text-muted-foreground text-xs">
                  {suggestion.secondaryText}
                </span>
              </span>
            </Autocomplete.Item>
          {/snippet}
        </Autocomplete.Collection>
      </Autocomplete.List>
    </Autocomplete.Popup>
  {/if}
</Autocomplete.Root>
