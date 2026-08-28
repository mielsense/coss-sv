<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["breadcrumb", "button", "menu"],
    id: "p-breadcrumb-4",
    interactive: true,
    responsive: true,
    title: "Breadcrumb with folders menu",
  });
</script>

<script lang="ts">
  import { Breadcrumb, buttonVariants, Menu } from "@coss-sv/ui";
  import { FolderLibraryIcon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
</script>

<Breadcrumb
  ><BreadcrumbList
    ><BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem
    ><BreadcrumbSeparator /><BreadcrumbItem
      ><Menu.Root
        ><Menu.Trigger
          aria-label="More pages"
          class={buttonVariants({
            class: "-m-1.5 text-muted-foreground",
            size: "icon-sm",
            variant: "ghost",
          })}
          ><HugeiconsIcon
            aria-hidden="true"
            icon={FolderLibraryIcon}
            strokeWidth={2}
          /></Menu.Trigger
        ><Menu.Popup align="start"
          ><Menu.LinkItem href="/docs">Docs</Menu.LinkItem><Menu.LinkItem href="/particles"
            >Particles</Menu.LinkItem
          ></Menu.Popup
        ></Menu.Root
      ></BreadcrumbItem
    ><BreadcrumbSeparator /><BreadcrumbItem
      ><BreadcrumbLink href="/docs/">Components</BreadcrumbLink></BreadcrumbItem
    ><BreadcrumbSeparator /><BreadcrumbItem
      ><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem
    ></BreadcrumbList
  ></Breadcrumb
>
