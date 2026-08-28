<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "pagination", "select"],
    containerClass: "**:data-[slot=preview]:w-full",
    id: "p-pagination-3",
    interactive: true,
    responsive: true,
    title: "Pagination with result range",
  });
</script>

<script lang="ts">
  import { Pagination, Select } from "@coss-sv/ui";
  const totalPages = 10;
  const totalResults = 100;
  const resultsPerPage = 10;
  const ranges = Array.from({ length: totalPages }, (_, index) => ({
    label: `${index * resultsPerPage + 1}-${Math.min((index + 1) * resultsPerPage, totalResults)}`,
    value: index + 1,
  }));
  let currentPage = $state(1);
</script>

<div class="flex items-center justify-between gap-2">
  <div class="flex items-center gap-2 whitespace-nowrap">
    <p class="text-muted-foreground text-sm">Viewing</p>
    <Select.Root items={ranges} bind:value={currentPage}
      ><Select.Trigger aria-label="Select result range" class="w-fit min-w-none" size="sm"
        ><Select.Value /></Select.Trigger
      ><Select.Popup
        >{#each ranges as range (range.value)}<Select.Item value={range.value}
            >{range.label}</Select.Item
          >{/each}</Select.Popup
      ></Select.Root
    >
    <p class="text-muted-foreground text-sm">
      of <strong class="font-medium text-foreground">{totalResults}</strong> results
    </p>
  </div>
  <Pagination.Root
    ><Pagination.Content class="w-full justify-between gap-2"
      ><Pagination.Item
        ><Pagination.Previous
          class="sm:*:[svg]:hidden"
          disabled={currentPage === 1}
          href="#previous"
          onclick={(event) => {
            event.preventDefault();
            if (currentPage > 1) currentPage -= 1;
          }}
          size="sm"
        /></Pagination.Item
      ><Pagination.Item
        ><Pagination.Next
          class="sm:*:[svg]:hidden"
          disabled={currentPage === totalPages}
          href="#next"
          onclick={(event) => {
            event.preventDefault();
            if (currentPage < totalPages) currentPage += 1;
          }}
          size="sm"
        /></Pagination.Item
      ></Pagination.Content
    ></Pagination.Root
  >
</div>
