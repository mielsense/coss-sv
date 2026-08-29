<script module lang="ts">
  import { defineParticleMeta } from "$lib/registry/particle-metadata.js";

  export const meta = defineParticleMeta({
    components: ["tabs", "tooltip"],
    id: "p-tabs-13",
    interactive: true,
    responsive: false,
    title: "Tabs with icon only and grouped tooltips",
  });
</script>

<script lang="ts">
  import { HugeiconsIcon, Tabs, Tooltip } from "@coss-sv/ui";
  import { House01Icon, PanelsTopLeftIcon, Settings01Icon } from "@hugeicons/core-free-icons";

  const overviewTooltip = Tooltip.TooltipCreateHandle();
  const projectsTooltip = Tooltip.TooltipCreateHandle();
  const settingsTooltip = Tooltip.TooltipCreateHandle();
</script>

<Tooltip.Provider>
  <Tabs.Root class="items-center" defaultValue="tab-1">
    <Tabs.List>
      <Tooltip.Root handle={overviewTooltip}>
        <Tooltip.Trigger
          as="span"
          class="inline-flex flex-1"
          handle={overviewTooltip}
          id="overview-tooltip-trigger"
        >
          <Tabs.Tab
            aria-label="Overview"
            onblur={() => overviewTooltip.close()}
            onfocus={() => overviewTooltip.open("overview-tooltip-trigger")}
            value="tab-1"
          >
            <HugeiconsIcon aria-hidden="true" icon={House01Icon} strokeWidth={2} />
          </Tabs.Tab>
        </Tooltip.Trigger>
        <Tooltip.Popup>Overview</Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root handle={projectsTooltip}>
        <Tooltip.Trigger
          as="span"
          class="inline-flex flex-1"
          handle={projectsTooltip}
          id="projects-tooltip-trigger"
        >
          <Tabs.Tab
            aria-label="Projects"
            onblur={() => projectsTooltip.close()}
            onfocus={() => projectsTooltip.open("projects-tooltip-trigger")}
            value="tab-2"
          >
            <HugeiconsIcon aria-hidden="true" icon={PanelsTopLeftIcon} strokeWidth={2} />
          </Tabs.Tab>
        </Tooltip.Trigger>
        <Tooltip.Popup>Projects</Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root handle={settingsTooltip}>
        <Tooltip.Trigger
          as="span"
          class="inline-flex flex-1"
          handle={settingsTooltip}
          id="settings-tooltip-trigger"
        >
          <Tabs.Tab
            aria-label="Settings"
            onblur={() => settingsTooltip.close()}
            onfocus={() => settingsTooltip.open("settings-tooltip-trigger")}
            value="tab-3"
          >
            <HugeiconsIcon aria-hidden="true" icon={Settings01Icon} strokeWidth={2} />
          </Tabs.Tab>
        </Tooltip.Trigger>
        <Tooltip.Popup>Settings</Tooltip.Popup>
      </Tooltip.Root>
    </Tabs.List>
    <Tabs.Panel value="tab-1">
      <p class="p-4 text-center text-muted-foreground text-xs">Overview content</p>
    </Tabs.Panel>
    <Tabs.Panel value="tab-2">
      <p class="p-4 text-center text-muted-foreground text-xs">Projects content</p>
    </Tabs.Panel>
    <Tabs.Panel value="tab-3">
      <p class="p-4 text-center text-muted-foreground text-xs">Settings content</p>
    </Tabs.Panel>
  </Tabs.Root>
</Tooltip.Provider>
