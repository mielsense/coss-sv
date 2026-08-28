<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";
  export const meta = defineParticleMeta({
    components: ["breadcrumb", "select"],
    id: "p-breadcrumb-7",
    interactive: true,
    responsive: true,
    title: "Breadcrumb with database selector",
  });
</script>

<script lang="ts">
  import { Breadcrumb, Select } from "@coss-sv/ui";
  import { Database01Icon } from "@hugeicons/core-free-icons";
  import { HugeiconsIcon } from "@hugeicons/svelte";
  const items = [
    { label: "Orion", value: "orion" },
    { label: "Sigma", value: "sigma" },
    { label: "Dorado", value: "dorado" },
  ];
  let value = $state("orion");
</script>

<Breadcrumb
  ><BreadcrumbList
    ><BreadcrumbItem><BreadcrumbLink href="/">Databases</BreadcrumbLink></BreadcrumbItem
    ><BreadcrumbSeparator /><BreadcrumbItem
      ><Select.Root aria-label="Select database" {items} bind:value
        ><Select.Trigger size="sm"
          ><HugeiconsIcon aria-hidden="true" icon={Database01Icon} strokeWidth={2} /><Select.Value
          /></Select.Trigger
        ><Select.Popup
          >{#each items as item (item.value)}<Select.Item value={item.value}
              >{item.label}</Select.Item
            >{/each}</Select.Popup
        ></Select.Root
      ></BreadcrumbItem
    ></BreadcrumbList
  ></Breadcrumb
>
