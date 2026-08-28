<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["button", "pagination"],
    containerClass: "**:data-[slot=preview]:w-full",
    id: "p-pagination-2",
    interactive: true,
    responsive: true,
    title: "Previous and next pagination",
  });
</script>

<script lang="ts">
  import { buttonVariants, Pagination } from "@coss-sv/ui";
  let currentPage = $state(1);
  const totalPages = 10;
</script>

<Pagination.Root
  ><Pagination.Content class="w-full justify-between gap-2"
    ><Pagination.Item
      >{#if currentPage === 1}<button
          class={buttonVariants({ variant: "outline" })}
          disabled
          type="button">Previous</button
        >{:else}<a
          class={buttonVariants({ variant: "outline" })}
          href={`#page-${currentPage - 1}`}
          onclick={() => (currentPage -= 1)}>Previous</a
        >{/if}</Pagination.Item
    ><Pagination.Item
      >{#if currentPage === totalPages}<button
          class={buttonVariants({ variant: "outline" })}
          disabled
          type="button">Next</button
        >{:else}<a
          class={buttonVariants({ variant: "outline" })}
          href={`#page-${currentPage + 1}`}
          onclick={() => (currentPage += 1)}>Next</a
        >{/if}</Pagination.Item
    ></Pagination.Content
  ></Pagination.Root
>
