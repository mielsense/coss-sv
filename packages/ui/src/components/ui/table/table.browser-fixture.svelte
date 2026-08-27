<!-- biome-ignore-all lint/a11y/noHeaderScope: Table.Head renders a native th element. -->
<script lang="ts">
import * as Table from "./index.js";

let clicks = $state(0);
let tableRef = $state<HTMLTableElement | null>(null);
let rowRef = $state<HTMLTableRowElement | null>(null);
</script>

<div class="narrow">
  <Table.Root
    aria-describedby="project-caption"
    bind:ref={tableRef}
    data-testid="table"
    onclick={() => (clicks += 1)}
    style="min-width: 640px"
  >
    <Table.Caption id="project-caption">A list of current projects.</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head id="project" scope="col">Project</Table.Head>
        <Table.Head scope="col">Team</Table.Head>
        <Table.Head scope="col">Budget</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row bind:ref={rowRef} data-state="selected" data-testid="row">
        <Table.Cell headers="project">Website Redesign</Table.Cell>
        <Table.Cell>Frontend Team</Table.Cell>
        <Table.Cell>$12,500</Table.Cell>
      </Table.Row>
    </Table.Body>
    <Table.Footer>
      <Table.Row>
        <Table.Cell colspan={2}>Total</Table.Cell>
        <Table.Cell>$12,500</Table.Cell>
      </Table.Row>
    </Table.Footer>
  </Table.Root>
</div>

<output data-testid="state"
  >{clicks}:{tableRef?.tagName ?? "missing"}:{rowRef?.tagName ?? "missing"}</output
>

<style>
.narrow {
  width: 180px;
}

:global(.narrow [data-slot="table-container"]) {
  width: 100%;
  overflow-x: auto;
}
</style>
