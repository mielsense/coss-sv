<script module lang="ts">
  import { defineParticleMeta, type ParticleMeta } from "@/registry/particle-metadata.js";
  const particleMeta = {
    components: ["badge", "frame", "table"],
    colSpan: 2,
    containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-4xl",
    id: "p-table-2",
    interactive: false,
    responsive: true,
    title: "Table in Frame",
  } satisfies ParticleMeta & { readonly colSpan: 2 };
  export const meta = defineParticleMeta(particleMeta);
</script>

<script lang="ts">
  import { Badge, Frame, Table } from "@coss-sv/ui";
  const projects = [
    { project: "Website Redesign", status: "Paid", team: "Frontend Team", budget: "$12,500" },
    { project: "Mobile App", status: "Unpaid", team: "Mobile Team", budget: "$8,750" },
    { project: "API Integration", status: "Pending", team: "Backend Team", budget: "$5,200" },
    { project: "Database Migration", status: "Paid", team: "DevOps Team", budget: "$3,800" },
    { project: "User Dashboard", status: "Paid", team: "UX Team", budget: "$7,200" },
    { project: "Security Audit", status: "Failed", team: "Security Team", budget: "$2,100" },
  ] as const;
  const statusClass = {
    Paid: "bg-emerald-500",
    Unpaid: "bg-muted-foreground/64",
    Pending: "bg-amber-500",
    Failed: "bg-red-500",
  } as const;
</script>

<Frame class="w-full">
  <Table.Root variant="card">
    <Table.Header>
      <Table.Row>
        <Table.Head>Project</Table.Head><Table.Head>Status</Table.Head><Table.Head>
          Team
        </Table.Head><Table.Head class="text-right">Budget</Table.Head>
      </Table.Row>
    </Table.Header><Table.Body>
      {#each projects as project (project.project)}<Table.Row>
          <Table.Cell class="font-medium">{project.project}</Table.Cell><Table.Cell>
            <Badge variant="outline">
              <span
                aria-hidden="true"
                class={["size-1.5 rounded-full", statusClass[project.status]]}
              ></span>
              {project.status}
            </Badge>
          </Table.Cell><Table.Cell>{project.team}</Table.Cell><Table.Cell class="text-right">
            {project.budget}
          </Table.Cell>
        </Table.Row>{/each}
    </Table.Body><Table.Footer>
      <Table.Row>
        <Table.Cell colspan={3}>Total Budget</Table.Cell><Table.Cell class="text-right">
          $39,550
        </Table.Cell>
      </Table.Row>
    </Table.Footer>
  </Table.Root>
</Frame>
