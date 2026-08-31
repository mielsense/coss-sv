<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["breadcrumb", "button", "menu"],
    id: "p-breadcrumb-1",
    interactive: true,
    responsive: true,
    title: "Breadcrumb with menu example",
  });
</script>

<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    buttonVariants,
    Menu,
  } from "@coss-sv/ui";
</script>

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem>
      <Menu.Root>
        <Menu.Trigger
          aria-label="More pages"
          class={buttonVariants({
            class: "-m-1.5 text-muted-foreground",
            size: "icon-sm",
            variant: "ghost",
          })}
        >
          <BreadcrumbEllipsis />
        </Menu.Trigger><Menu.Popup align="start">
          <Menu.LinkItem href="/docs">Docs</Menu.LinkItem><Menu.LinkItem href="/particles">
            Particles
          </Menu.LinkItem>
        </Menu.Popup>
      </Menu.Root>
    </BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem>
      <BreadcrumbLink href="/docs/">Components</BreadcrumbLink>
    </BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
