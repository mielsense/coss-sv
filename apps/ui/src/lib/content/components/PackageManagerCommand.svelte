<script lang="ts">
  import ComputerTerminal02Icon from "@hugeicons/core-free-icons/ComputerTerminal02Icon";
  import { HugeiconsIcon } from "@coss-sv/ui";
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
  class="relative overflow-hidden rounded-xl border border-border/64 bg-code text-code-foreground"
>
  <Tabs.Root class="gap-0" bind:value>
    <div class="flex min-h-10 items-center gap-2 border-border/64 border-b px-4 py-1 font-mono">
      <HugeiconsIcon
        aria-hidden="true"
        class="size-4 text-code-foreground"
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
    {#each commands as command (command.value)}
      <Tabs.Panel
        class="mt-0 overflow-x-auto"
        data-install-command={command.value}
        value={command.value}
      >
        <pre class="w-max px-4 py-3.5"><code
            class="relative font-mono text-[0.8125rem] leading-none"
            data-language="bash">{command.command}</code
          ></pre>
      </Tabs.Panel>
    {/each}
  </Tabs.Root>
  <CopyButton class="absolute top-1.5 right-1.5 z-3" value={selectedCommand} />
</div>
