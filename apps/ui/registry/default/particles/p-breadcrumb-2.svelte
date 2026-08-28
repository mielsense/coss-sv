<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["breadcrumb"],
    id: "p-breadcrumb-2",
    interactive: true,
    responsive: true,
    title: "Breadcrumb with custom separator",
  });
</script>

<script lang="ts">
  import { Breadcrumb } from "@coss-sv/ui";
</script>

<Breadcrumb
  ><BreadcrumbList
    ><BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem
    ><BreadcrumbSeparator>/</BreadcrumbSeparator><BreadcrumbItem
      ><BreadcrumbLink href="/docs/">Components</BreadcrumbLink></BreadcrumbItem
    ><BreadcrumbSeparator>/</BreadcrumbSeparator><BreadcrumbItem
      ><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem
    ></BreadcrumbList
  ></Breadcrumb
>
