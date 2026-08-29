<script lang="ts">
  import { Button } from "../../../../../../packages/ui/dist/components/ui/button/index.js";
  import * as Pagination from "../../../../../../packages/ui/dist/components/ui/pagination/index.js";

  const currentPage: number = 1;
  const totalPages: number = 3;
</script>

<div data-particle="p-pagination-1">
  <Pagination.Root>
    <Pagination.Content>
      <Pagination.Item><Pagination.Previous href="#" /></Pagination.Item>
      <Pagination.Item><Pagination.Link href="#">1</Pagination.Link></Pagination.Item>
      <Pagination.Item><Pagination.Link href="#" isActive>2</Pagination.Link></Pagination.Item>
      <Pagination.Item><Pagination.Link href="#">3</Pagination.Link></Pagination.Item>
      <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
      <Pagination.Item><Pagination.Next href="#" /></Pagination.Item>
    </Pagination.Content>
  </Pagination.Root>
</div>

<div class="w-full" data-particle="p-pagination-2">
  <Pagination.Root>
    <Pagination.Content class="w-full justify-between gap-2">
      <Pagination.Item>
        {#if currentPage === 1}
          <Button disabled variant="outline">Previous</Button>
        {:else}
          <Button disabled={false} href={`#/page/${currentPage - 1}`} variant="outline">
            Previous
          </Button>
        {/if}
      </Pagination.Item>
      <Pagination.Item>
        {#if currentPage === totalPages}
          <Button disabled variant="outline">Next</Button>
        {:else}
          <Button disabled={false} href={`#/page/${currentPage + 1}`} variant="outline">
            Next
          </Button>
        {/if}
      </Pagination.Item>
    </Pagination.Content>
  </Pagination.Root>
</div>
