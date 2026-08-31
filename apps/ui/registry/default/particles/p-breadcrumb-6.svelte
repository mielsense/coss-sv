<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["breadcrumb"],
    id: "p-breadcrumb-6",
    interactive: true,
    responsive: true,
    title: "Breadcrumb with dot separators",
  });
</script>

<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    HugeiconsIcon,
  } from "@coss-sv/ui";
  import Home01Icon from "@hugeicons/core-free-icons/Home01Icon";
</script>

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink aria-label="Home" href="/">
        <HugeiconsIcon aria-hidden="true" class="size-4" icon={Home01Icon} strokeWidth={2} />
      </BreadcrumbLink>
    </BreadcrumbItem><BreadcrumbSeparator>·</BreadcrumbSeparator><BreadcrumbItem>
      <BreadcrumbLink href="/docs/">Components</BreadcrumbLink>
    </BreadcrumbItem><BreadcrumbSeparator>·</BreadcrumbSeparator><BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
