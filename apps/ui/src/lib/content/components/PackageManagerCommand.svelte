<script lang="ts">
  import ComputerTerminal02Icon from "@hugeicons/core-free-icons/ComputerTerminal02Icon";
  import { HugeiconsIcon, ScrollArea } from "@coss-sv/ui";
  import * as Tabs from "@coss-sv/ui/components/ui/tabs";
  import type { PackageManagerCommand } from "@/content/install-commands.js";
  import CopyButton from "./CopyButton.svelte";

  let {
    commands,
    value = $bindable<Tabs.TabsValue>("pnpm"),
  }: {
    commands: readonly PackageManagerCommand[];
    value?: Tabs.TabsValue;
  } = $props();

  const selectedCommand = $derived(
    commands.find((command) => command.value === value)?.command ?? commands[0]?.command ?? "",
  );
</script>

<div
  class="relative min-w-0 overflow-hidden rounded-xl border border-border/64 bg-code text-code-foreground"
>
  <Tabs.Root class="min-w-0 gap-0" bind:value>
    <div class="flex items-center gap-2 border-border/64 border-b px-4 py-1 font-mono">
      <HugeiconsIcon
        aria-hidden="true"
        class="size-5 text-code-foreground sm:size-4"
        icon={ComputerTerminal02Icon}
        strokeWidth={2}
      />
      <Tabs.List
        aria-label="Package manager"
        class="bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none"
      >
        {#each commands as command (command.value)}
          <Tabs.Tab class="rounded-lg font-mono" value={command.value}>{command.value}</Tabs.Tab>
        {/each}
      </Tabs.List>
    </div>
    <ScrollArea
      class="min-w-0 **:data-[slot=scroll-area-scrollbar]:data-[orientation=horizontal]:mx-2 **:data-[slot=scroll-area-scrollbar]:data-[orientation=vertical]:my-2"
    >
      {#each commands as command (command.value)}
        <Tabs.Panel
          class="mt-0 w-max px-4 py-3.5"
          data-install-command={command.value}
          value={command.value}
        >
          <pre class="m-0 text-[0.8125rem] leading-normal"><code
              class="relative font-mono text-[0.8125rem] leading-none"
              data-language="bash">{command.command}</code
            ></pre>
        </Tabs.Panel>
      {/each}
    </ScrollArea>
  </Tabs.Root>
  <CopyButton class="absolute top-1.5 right-1.5 z-3" value={selectedCommand} />
</div>
