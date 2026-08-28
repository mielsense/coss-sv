<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["badge", "checkbox", "frame", "table"],
    containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-4xl",
    id: "p-table-3",
    interactive: true,
    responsive: true,
    title: "Selectable projects table",
    colSpan: 2,
  });
</script>

<script lang="ts">
  import {
    createTable,
    rowSelectionFeature,
    tableFeatures,
    type ColumnDef,
  } from "@tanstack/svelte-table";
  import { Badge, Checkbox, Frame, Table } from "@coss-sv/ui";
  type Project = {
    id: string;
    project: string;
    status: "Paid" | "Unpaid" | "Pending" | "Failed";
    team: string;
    budget: number;
  };
  const data: Project[] = [
    { budget: 12500, id: "1", project: "Website Redesign", status: "Paid", team: "Frontend Team" },
    { budget: 8750, id: "2", project: "Mobile App", status: "Unpaid", team: "Mobile Team" },
    { budget: 5200, id: "3", project: "API Integration", status: "Pending", team: "Backend Team" },
    { budget: 3800, id: "4", project: "Database Migration", status: "Paid", team: "DevOps Team" },
    { budget: 7200, id: "5", project: "User Dashboard", status: "Paid", team: "UX Team" },
    { budget: 2100, id: "6", project: "Security Audit", status: "Failed", team: "Security Team" },
  ];
  const features = tableFeatures({ rowSelectionFeature });
  const columns: ColumnDef<typeof features, Project, unknown>[] = [
    { id: "select", header: "Select" },
    { accessorKey: "project", header: "Project" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "team", header: "Team" },
    { accessorKey: "budget", header: "Budget" },
  ];
  const table = createTable({
    features,
    columns,
    data,
    enableRowSelection: true,
    getRowId: (row) => row.id,
  });
  const statusColor = (status: Project["status"]) =>
    ({
      Paid: "bg-emerald-500",
      Unpaid: "bg-muted-foreground/64",
      Pending: "bg-amber-500",
      Failed: "bg-red-500",
    })[status];
  const currency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      currency: "USD",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      style: "currency",
    }).format(value);
  const total = currency(data.reduce((sum, row) => sum + row.budget, 0));
</script>

<Frame class="w-full"
  ><Table.Root variant="card"
    ><Table.Header
      ><Table.Row
        >{#each table.getHeaderGroups()[0]?.headers ?? [] as header (header.id)}<Table.Head
            >{#if header.column.id === "select"}<Checkbox
                aria-label="Select all"
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                onCheckedChange={(value) => table.toggleAllRowsSelected(Boolean(value))}
              />{:else if header.column.id === "budget"}<div class="text-right">
                Budget
              </div>{:else}{header.column.columnDef.header}{/if}</Table.Head
          >{/each}</Table.Row
      ></Table.Header
    ><Table.Body
      >{#each table.getRowModel().rows as row (row.id)}<Table.Row
          data-state={row.getIsSelected() ? "selected" : undefined}
          >{#each row.getAllCells() as cell (cell.id)}<Table.Cell
              >{#if cell.column.id === "select"}<Checkbox
                  aria-label="Select row"
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
                />{:else if cell.column.id === "project"}<div class="font-medium">
                  {row.original.project}
                </div>{:else if cell.column.id === "status"}<Badge variant="outline"
                  ><span
                    aria-hidden="true"
                    class={`size-1.5 rounded-full ${statusColor(row.original.status)}`}
                  ></span>{row.original.status}</Badge
                >{:else if cell.column.id === "team"}{row.original.team}{:else}<div
                  class="text-right"
                >
                  {currency(row.original.budget)}
                </div>{/if}</Table.Cell
            >{/each}</Table.Row
        >{:else}<Table.Row
          ><Table.Cell class="h-24 text-center" colspan={columns.length}>No results.</Table.Cell
          ></Table.Row
        >{/each}</Table.Body
    ><Table.Footer
      ><Table.Row
        ><Table.Cell colspan={4}>Total Budget</Table.Cell><Table.Cell class="text-right"
          >{total}</Table.Cell
        ></Table.Row
      ></Table.Footer
    ></Table.Root
  ></Frame
>
