<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["pagination"],
    id: "p-pagination-1",
    interactive: true,
    responsive: true,
    title: "Pagination example",
  });
</script>

<script lang="ts">
  import { Pagination } from "@coss-sv/ui";
</script>

<Pagination.Root
  ><Pagination.Content
    ><Pagination.Item><Pagination.Previous href="#previous" /></Pagination.Item><Pagination.Item
      ><Pagination.Link href="#page-1">1</Pagination.Link></Pagination.Item
    ><Pagination.Item
      ><Pagination.Link aria-current="page" isActive href="#page-2">2</Pagination.Link
      ></Pagination.Item
    ><Pagination.Item><Pagination.Link href="#page-3">3</Pagination.Link></Pagination.Item
    ><Pagination.Item><Pagination.Ellipsis /></Pagination.Item><Pagination.Item
      ><Pagination.Next href="#next" /></Pagination.Item
    ></Pagination.Content
  ></Pagination.Root
>
