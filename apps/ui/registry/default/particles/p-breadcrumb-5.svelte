<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["breadcrumb"],
    id: "p-breadcrumb-5",
    interactive: true,
    responsive: true,
    title: "Breadcrumb links with icons",
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
  import { Home01Icon, Layers01Icon } from "@hugeicons/core-free-icons";
</script>

<Breadcrumb
  ><BreadcrumbList
    ><BreadcrumbItem
      ><BreadcrumbLink class="inline-flex items-center gap-1.5" href="/"
        ><HugeiconsIcon
          aria-hidden="true"
          class="size-4"
          icon={Home01Icon}
          strokeWidth={2}
        />Home</BreadcrumbLink
      ></BreadcrumbItem
    ><BreadcrumbSeparator /><BreadcrumbItem
      ><BreadcrumbLink class="inline-flex items-center gap-1.5" href="/docs/"
        ><HugeiconsIcon
          aria-hidden="true"
          class="size-4"
          icon={Layers01Icon}
          strokeWidth={2}
        />Components</BreadcrumbLink
      ></BreadcrumbItem
    ><BreadcrumbSeparator /><BreadcrumbItem
      ><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem
    ></BreadcrumbList
  ></Breadcrumb
>
