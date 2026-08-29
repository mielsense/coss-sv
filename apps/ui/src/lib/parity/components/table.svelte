<!-- biome-ignore-all lint/a11y/noHeaderScope: Table.Head renders a native th element. -->
<script lang="ts">
  import { Badge } from "../../../../../../packages/ui/dist/components/ui/badge/index.js";
  import { CardFrame } from "../../../../../../packages/ui/dist/components/ui/card/index.js";
  import { Frame } from "../../../../../../packages/ui/dist/components/ui/frame/index.js";
  import * as Table from "../../../../../../packages/ui/dist/components/ui/table/index.js";

  const projects = [
    ["Website Redesign", "Paid", "bg-emerald-500", "Frontend Team", "$12,500"],
    ["Mobile App", "Unpaid", "bg-muted-foreground/64", "Mobile Team", "$8,750"],
    ["API Integration", "Pending", "bg-amber-500", "Backend Team", "$5,200"],
    ["Database Migration", "Paid", "bg-emerald-500", "DevOps Team", "$3,800"],
    ["User Dashboard", "Paid", "bg-emerald-500", "UX Team", "$7,200"],
    ["Security Audit", "Failed", "bg-red-500", "Security Team", "$2,100"],
  ] as const;
</script>

{#snippet projectTable()}
  <Table.Header>
    <Table.Row>
      <Table.Head>Project</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Team</Table.Head>
      <Table.Head class="text-right">Budget</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each projects as project (project[0])}
      <Table.Row>
        <Table.Cell class="font-medium">{project[0]}</Table.Cell>
        <Table.Cell>
          <Badge variant="outline">
            <span aria-hidden="true" class={`size-1.5 rounded-full ${project[2]}`}></span>
            {project[1]}
          </Badge>
        </Table.Cell>
        <Table.Cell>{project[3]}</Table.Cell>
        <Table.Cell class="text-right">{project[4]}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colspan={3}>Total Budget</Table.Cell>
      <Table.Cell class="text-right">$39,550</Table.Cell>
    </Table.Row>
  </Table.Footer>
{/snippet}

<div class="w-full sm:max-w-4xl" data-particle="p-table-1">
  <Table.Root>
    <Table.Caption>A list of current projects.</Table.Caption>
    {@render projectTable()}
  </Table.Root>
</div>

<div class="w-full sm:max-w-4xl" data-particle="p-table-2">
  <Frame class="w-full">
    <Table.Root variant="card">{@render projectTable()}</Table.Root>
  </Frame>
</div>

<div class="w-full sm:max-w-4xl" data-particle="p-table-5">
  <Table.Root class="w-full" variant="card">{@render projectTable()}</Table.Root>
</div>

<div class="w-full sm:max-w-4xl" data-particle="p-table-7">
  <CardFrame class="w-full">
    <Table.Root variant="card">{@render projectTable()}</Table.Root>
  </CardFrame>
</div>
