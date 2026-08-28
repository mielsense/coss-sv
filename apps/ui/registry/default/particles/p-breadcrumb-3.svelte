<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["breadcrumb"],
    id: "p-breadcrumb-3",
    interactive: true,
    responsive: true,
    title: "Breadcrumb with home icon",
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
  } from "@coss-sv/ui";
  import { Home01Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Breadcrumb
  ><BreadcrumbList
    ><BreadcrumbItem
      ><BreadcrumbLink aria-label="Home" href="/"
        ><HugeiconsIcon
          aria-hidden="true"
          class="size-4"
          icon={Home01Icon}
          strokeWidth={2}
        /></BreadcrumbLink
      ></BreadcrumbItem
    ><BreadcrumbSeparator /><BreadcrumbItem
      ><BreadcrumbLink href="/docs/">Components</BreadcrumbLink></BreadcrumbItem
    ><BreadcrumbSeparator /><BreadcrumbItem
      ><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem
    ></BreadcrumbList
  ></Breadcrumb
>
