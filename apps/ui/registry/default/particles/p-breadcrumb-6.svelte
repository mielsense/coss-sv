<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["breadcrumb"],
    id: "p-breadcrumb-6",
    interactive: true,
    responsive: true,
    title: "Breadcrumb with dot separators",
  });
</script>

<script lang="ts">
  import { Breadcrumb } from "@coss-sv/ui";
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
    ><BreadcrumbSeparator>·</BreadcrumbSeparator><BreadcrumbItem
      ><BreadcrumbLink href="/docs/">Components</BreadcrumbLink></BreadcrumbItem
    ><BreadcrumbSeparator>·</BreadcrumbSeparator><BreadcrumbItem
      ><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem
    ></BreadcrumbList
  ></Breadcrumb
>
