<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["badge", "button", "checkbox", "frame", "pagination", "select", "table"],
    containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-4xl",
    id: "p-table-4",
    interactive: true,
    responsive: true,
    title: "Flights data table",
    colSpan: 2,
  });
</script>

<script lang="ts">
  import {
    AirplaneTakeOff01Icon,
    ArrowDown01Icon,
    ArrowUp01Icon,
  } from "@hugeicons/core-free-icons";
  import {
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    columnSizingFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_text,
    tableFeatures,
    type ColumnDef,
  } from "@tanstack/svelte-table";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { Badge, Checkbox, cn, Frame, FrameFooter, Pagination, Select, Table } from "@coss-sv/ui";
  type Flight = {
    id: string;
    flightCode: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    terminal: string;
    duration: string;
    status: "On Time" | "Delayed" | "Cancelled" | "Boarding";
    gate: string;
  };
  const flights: Flight[] = [
    {
      arrivalTime: "11:45",
      departureTime: "08:30",
      destination: "Los Angeles",
      duration: "5h 15m",
      flightCode: "AA1234",
      gate: "A12",
      id: "1",
      status: "On Time",
      terminal: "1",
    },
    {
      arrivalTime: "17:10",
      departureTime: "14:20",
      destination: "San Francisco",
      duration: "4h 50m",
      flightCode: "DL5678",
      gate: "B24",
      id: "2",
      status: "Delayed",
      terminal: "2",
    },
    {
      arrivalTime: "13:30",
      departureTime: "10:15",
      destination: "Miami",
      duration: "3h 15m",
      flightCode: "UA9012",
      gate: "C8",
      id: "3",
      status: "On Time",
      terminal: "1",
    },
    {
      arrivalTime: "18:20",
      departureTime: "16:45",
      destination: "Seattle",
      duration: "2h 35m",
      flightCode: "SW3456",
      gate: "D15",
      id: "4",
      status: "On Time",
      terminal: "3",
    },
    {
      arrivalTime: "12:30",
      departureTime: "09:00",
      destination: "Salt Lake City",
      duration: "5h 30m",
      flightCode: "JB7890",
      gate: "E3",
      id: "5",
      status: "Cancelled",
      terminal: "2",
    },
    {
      arrivalTime: "14:15",
      departureTime: "11:30",
      destination: "Phoenix",
      duration: "2h 45m",
      flightCode: "AS2345",
      gate: "F7",
      id: "6",
      status: "On Time",
      terminal: "1",
    },
    {
      arrivalTime: "20:30",
      departureTime: "13:00",
      destination: "Las Vegas",
      duration: "5h 30m",
      flightCode: "HA6789",
      gate: "G12",
      id: "7",
      status: "Delayed",
      terminal: "2",
    },
    {
      arrivalTime: "09:00",
      departureTime: "07:15",
      destination: "Dallas",
      duration: "1h 45m",
      flightCode: "FX0123",
      gate: "H5",
      id: "8",
      status: "Boarding",
      terminal: "1",
    },
    {
      arrivalTime: "08:30",
      departureTime: "06:00",
      destination: "Denver",
      duration: "2h 30m",
      flightCode: "WN4567",
      gate: "I9",
      id: "9",
      status: "Boarding",
      terminal: "2",
    },
    {
      arrivalTime: "15:20",
      departureTime: "12:45",
      destination: "Portland",
      duration: "2h 35m",
      flightCode: "B61234",
      gate: "J14",
      id: "10",
      status: "On Time",
      terminal: "3",
    },
    {
      arrivalTime: "18:45",
      departureTime: "15:30",
      destination: "Atlanta",
      duration: "3h 15m",
      flightCode: "NK8901",
      gate: "K6",
      id: "11",
      status: "On Time",
      terminal: "1",
    },
    {
      arrivalTime: "12:00",
      departureTime: "09:45",
      destination: "Chicago",
      duration: "2h 15m",
      flightCode: "F92345",
      gate: "L11",
      id: "12",
      status: "Delayed",
      terminal: "2",
    },
    {
      arrivalTime: "14:15",
      departureTime: "11:00",
      destination: "Boston",
      duration: "3h 15m",
      flightCode: "SY6789",
      gate: "M3",
      id: "13",
      status: "On Time",
      terminal: "1",
    },
    {
      arrivalTime: "16:45",
      departureTime: "13:30",
      destination: "New York",
      duration: "3h 15m",
      flightCode: "G40123",
      gate: "N8",
      id: "14",
      status: "On Time",
      terminal: "3",
    },
    {
      arrivalTime: "11:20",
      departureTime: "08:00",
      destination: "Washington",
      duration: "3h 20m",
      flightCode: "YX5678",
      gate: "O12",
      id: "15",
      status: "Delayed",
      terminal: "2",
    },
    {
      arrivalTime: "13:50",
      departureTime: "10:30",
      destination: "Orlando",
      duration: "3h 20m",
      flightCode: "4U9012",
      gate: "P5",
      id: "16",
      status: "Delayed",
      terminal: "1",
    },
    {
      arrivalTime: "16:30",
      departureTime: "14:00",
      destination: "Houston",
      duration: "2h 30m",
      flightCode: "QF3456",
      gate: "Q9",
      id: "17",
      status: "On Time",
      terminal: "3",
    },
    {
      arrivalTime: "10:00",
      departureTime: "07:30",
      destination: "Minneapolis",
      duration: "2h 30m",
      flightCode: "LH7890",
      gate: "R7",
      id: "18",
      status: "Cancelled",
      terminal: "2",
    },
    {
      arrivalTime: "19:30",
      departureTime: "16:15",
      destination: "Detroit",
      duration: "3h 15m",
      flightCode: "KL2345",
      gate: "S4",
      id: "19",
      status: "Cancelled",
      terminal: "1",
    },
    {
      arrivalTime: "15:10",
      departureTime: "12:00",
      destination: "Philadelphia",
      duration: "3h 10m",
      flightCode: "AF6789",
      gate: "T16",
      id: "20",
      status: "On Time",
      terminal: "3",
    },
    {
      arrivalTime: "12:25",
      departureTime: "09:15",
      destination: "Charlotte",
      duration: "3h 10m",
      flightCode: "BA0123",
      gate: "U10",
      id: "21",
      status: "On Time",
      terminal: "2",
    },
    {
      arrivalTime: "18:00",
      departureTime: "15:45",
      destination: "Nashville",
      duration: "2h 15m",
      flightCode: "IB4567",
      gate: "V8",
      id: "22",
      status: "Delayed",
      terminal: "1",
    },
    {
      arrivalTime: "14:00",
      departureTime: "11:45",
      destination: "Austin",
      duration: "2h 15m",
      flightCode: "EK8901",
      gate: "W13",
      id: "23",
      status: "Cancelled",
      terminal: "3",
    },
    {
      arrivalTime: "16:40",
      departureTime: "13:15",
      destination: "Tampa",
      duration: "3h 25m",
      flightCode: "QR2345",
      gate: "X6",
      id: "24",
      status: "On Time",
      terminal: "2",
    },
    {
      arrivalTime: "11:30",
      departureTime: "08:45",
      destination: "Raleigh",
      duration: "2h 45m",
      flightCode: "TK6789",
      gate: "Y11",
      id: "25",
      status: "On Time",
      terminal: "1",
    },
    {
      arrivalTime: "12:45",
      departureTime: "10:00",
      destination: "Indianapolis",
      duration: "2h 45m",
      flightCode: "VS3456",
      gate: "Z4",
      id: "26",
      status: "On Time",
      terminal: "2",
    },
    {
      arrivalTime: "20:00",
      departureTime: "17:30",
      destination: "Kansas City",
      duration: "2h 30m",
      flightCode: "LX7890",
      gate: "A8",
      id: "27",
      status: "Delayed",
      terminal: "3",
    },
    {
      arrivalTime: "15:20",
      departureTime: "12:30",
      destination: "Columbus",
      duration: "2h 50m",
      flightCode: "OS1234",
      gate: "B19",
      id: "28",
      status: "On Time",
      terminal: "1",
    },
    {
      arrivalTime: "20:15",
      departureTime: "18:00",
      destination: "Milwaukee",
      duration: "2h 15m",
      flightCode: "SN5678",
      gate: "C22",
      id: "29",
      status: "On Time",
      terminal: "2",
    },
    {
      arrivalTime: "21:30",
      departureTime: "19:15",
      destination: "Memphis",
      duration: "2h 15m",
      flightCode: "TP9012",
      gate: "D6",
      id: "30",
      status: "On Time",
      terminal: "3",
    },
  ];
  const features = tableFeatures({
    columnSizingFeature,
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
    rowSelectionFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: { text: sortFn_text },
  });
  const columns: ColumnDef<typeof features, Flight, unknown>[] = [
    { id: "select", header: "Select", enableSorting: false, size: 28 },
    { accessorKey: "flightCode", header: "Flight", size: 80 },
    { accessorKey: "departureTime", header: "Time", size: 220, sortFn: "text" },
    { accessorKey: "destination", header: "Destination", size: 180 },
    { accessorKey: "status", header: "Status", size: 120 },
    { accessorKey: "terminal", header: "Terminal", size: 90 },
    { accessorKey: "gate", header: "Gate", size: 80 },
  ];
  const table = createTable({
    features,
    columns,
    data: flights,
    enableRowSelection: true,
    enableSortingRemoval: false,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "departureTime", desc: false }],
    },
  });
  const statusColor = (status: Flight["status"]) =>
    ({
      "On Time": "bg-emerald-500",
      Delayed: "bg-amber-500",
      Cancelled: "bg-red-500",
      Boarding: "bg-blue-500",
    })[status];
  const page = $derived(table.atoms.pagination.get());
  const rangeItems = $derived(
    Array.from({ length: table.getPageCount() }, (_, index) => ({
      label: `${index * page.pageSize + 1}-${Math.min((index + 1) * page.pageSize, table.getRowCount())}`,
      value: index + 1,
    })),
  );
</script>

<Frame class="w-full"
  ><Table.Root class="table-fixed" variant="card"
    ><Table.Header
      >{#each table.getHeaderGroups() as group (group.id)}<Table.Row class="hover:bg-transparent"
          >{#each group.headers as header (header.id)}<Table.Head
              style={header.column.getSize() ? `width: ${header.column.getSize()}px` : undefined}
              >{#if header.column.id === "select"}<Checkbox
                  aria-label="Select all rows"
                  checked={table.getIsAllPageRowsSelected()}
                  indeterminate={table.getIsSomePageRowsSelected() &&
                    !table.getIsAllPageRowsSelected()}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
                />{:else if header.column.getCanSort()}<button
                  class="flex h-full w-full cursor-pointer select-none items-center justify-between gap-2 text-left"
                  type="button"
                  onclick={() => header.column.toggleSorting()}
                  >{header.column.columnDef
                    .header}{#if header.column.getIsSorted() === "asc"}<HugeiconsIcon
                      aria-hidden="true"
                      class="size-4 shrink-0 opacity-80"
                      icon={ArrowUp01Icon}
                    />{:else if header.column.getIsSorted() === "desc"}<HugeiconsIcon
                      aria-hidden="true"
                      class="size-4 shrink-0 opacity-80"
                      icon={ArrowDown01Icon}
                    />{/if}</button
                >{:else}{header.column.columnDef.header}{/if}</Table.Head
            >{/each}</Table.Row
        >{/each}</Table.Header
    ><Table.Body
      >{#each table.getRowModel().rows as row (row.id)}<Table.Row
          data-state={row.getIsSelected() ? "selected" : undefined}
          >{#each row.getAllCells() as cell (cell.id)}<Table.Cell
              >{#if cell.column.id === "select"}<Checkbox
                  aria-label="Select row"
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
                />{:else if cell.column.id === "flightCode"}<div
                  class="font-medium font-mono text-muted-foreground"
                >
                  {row.original.flightCode}
                </div>{:else if cell.column.id === "departureTime"}<div
                  class={cn(
                    "flex items-center gap-1.5 font-normal tabular-nums",
                    row.original.status === "Cancelled" &&
                      "text-muted-foreground line-through opacity-50",
                  )}
                >
                  <div
                    class={row.original.status === "Delayed"
                      ? "text-warning-foreground"
                      : undefined}
                  >
                    {row.original.departureTime}
                  </div>
                  <div
                    aria-hidden="true"
                    class="flex items-center gap-0.5 opacity-50 before:size-1.5 before:rounded-full before:border before:border-muted-foreground after:h-px after:w-3 after:border-muted-foreground after:border-t after:border-dashed"
                  ></div>
                  <div
                    class={cn(
                      "text-muted-foreground",
                      row.original.status === "Cancelled" && "line-through",
                    )}
                  >
                    {row.original.duration}
                  </div>
                  <div
                    aria-hidden="true"
                    class="flex items-center gap-0.5 opacity-50 before:order-1 before:size-1.5 before:rounded-full before:border before:border-muted-foreground after:h-px after:w-3 after:border-muted-foreground after:border-t after:border-dashed"
                  ></div>
                  <div>{row.original.arrivalTime}</div>
                </div>{:else if cell.column.id === "destination"}<div class="font-medium">
                  {row.original.destination}
                </div>{:else if cell.column.id === "status"}<Badge variant="outline"
                  ><span
                    aria-hidden="true"
                    class={cn("size-1.5 rounded-full", statusColor(row.original.status))}
                  ></span>{row.original.status}</Badge
                >{:else if cell.column.id === "terminal"}<Badge
                  class="font-normal tabular-nums"
                  size="lg"
                  variant="outline"
                  ><HugeiconsIcon icon={AirplaneTakeOff01Icon} aria-hidden="true" /><span
                    >{row.original.terminal}</span
                  ></Badge
                >{:else}{row.original.gate}{/if}</Table.Cell
            >{/each}</Table.Row
        >{:else}<Table.Row
          ><Table.Cell class="h-24 text-center" colspan={columns.length}>No results.</Table.Cell
          ></Table.Row
        >{/each}</Table.Body
    ></Table.Root
  ><FrameFooter class="p-2"
    ><div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 whitespace-nowrap">
        <p class="text-muted-foreground text-sm">Viewing</p>
        <Select.Root
          items={rangeItems}
          value={page.pageIndex + 1}
          onValueChange={(value) => typeof value === "number" && table.setPageIndex(value - 1)}
          ><Select.Trigger aria-label="Select result range" class="w-fit min-w-none" size="sm"
            ><Select.Value /></Select.Trigger
          ><Select.Popup
            >{#each rangeItems as item (item.value)}<Select.Item value={item.value}
                >{item.label}</Select.Item
              >{/each}</Select.Popup
          ></Select.Root
        >
        <p class="text-muted-foreground text-sm">
          of <strong class="font-medium text-foreground">{table.getRowCount()}</strong> results
        </p>
      </div>
      <Pagination.Root class="justify-end"
        ><Pagination.Content
          ><Pagination.Item
            ><Pagination.Previous
              aria-disabled={!table.getCanPreviousPage()}
              class="sm:*:[svg]:hidden"
              as="button"
              onclick={() => table.getCanPreviousPage() && table.previousPage()}
              size="sm"
            /></Pagination.Item
          ><Pagination.Item
            ><Pagination.Next
              aria-disabled={!table.getCanNextPage()}
              class="sm:*:[svg]:hidden"
              as="button"
              onclick={() => table.getCanNextPage() && table.nextPage()}
              size="sm"
            /></Pagination.Item
          ></Pagination.Content
        ></Pagination.Root
      >
    </div></FrameFooter
  ></Frame
>
