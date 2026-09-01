<script lang="ts">
  import ComputerTerminal02Icon from "@hugeicons/core-free-icons/ComputerTerminal02Icon";
  import { HugeiconsIcon } from "@coss-sv/ui";
  import * as Tabs from "@coss-sv/ui/components/ui/tabs";
  import { onMount } from "svelte";
  import type { ComponentSourceFile } from "@/content/component-source.js";
  import CodeSource from "./CodeSource.svelte";
  import CopyButton from "./CopyButton.svelte";

  let {
    dependencies = [],
    files = [],
    shadcnSvelte,
  }: {
    dependencies?: readonly string[];
    files?: readonly ComponentSourceFile[];
    shadcnSvelte: string;
  } = $props();
  let selected = $state<Tabs.TabsValue>("cli");
  let selectedFile = $state<Tabs.TabsValue>();
  const dependencyCommand = $derived(`pnpm add ${dependencies.join(" ")}`);

  onMount(() => {
    const saved = localStorage.getItem("coss-installation-method");
    if (saved === "cli" || saved === "manual") selected = saved;
    selectedFile ??= files[0]?.path;
  });

  $effect(() => {
    if (selected === "cli" || selected === "manual") {
      localStorage.setItem("coss-installation-method", selected);
    }
  });
</script>

<Tabs.Root class="relative mt-6 w-full" bind:value={selected}>
  <Tabs.List
    aria-label="Installation method"
    class="bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none"
  >
    <Tabs.Tab class="rounded-lg" value="cli">CLI</Tabs.Tab>
    <Tabs.Tab class="rounded-lg" value="manual">Manual</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="cli">
    <div
      class="relative overflow-hidden rounded-xl border border-border/64 bg-code text-code-foreground [&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:leading-none [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:px-4 [&_pre]:py-3.5"
    >
      <div class="flex min-h-10 items-center gap-2 border-border/64 border-b px-4 py-1 font-mono">
        <HugeiconsIcon
          aria-hidden="true"
          class="size-4"
          icon={ComputerTerminal02Icon}
          strokeWidth={2}
        />
        <span
          class="rounded-lg bg-accent px-2.5 py-1.5 text-foreground text-[0.8125rem] font-medium"
          >pnpm</span
        >
      </div>
      <pre><code>{shadcnSvelte}</code></pre>
      <CopyButton class="absolute top-1.5 right-1.5 z-3" value={shadcnSvelte} />
    </div>
  </Tabs.Panel>

  <Tabs.Panel value="manual">
    <ol class="m-0 grid gap-6 ps-6 [&_li]:ps-1 [&_p]:mb-3 [&_p]:mt-0">
      {#if dependencies.length > 0}
        <li>
          <p>Install the following dependencies:</p>
          <div
            class="relative overflow-hidden rounded-xl border border-border/64 bg-code text-code-foreground [&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:leading-none [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:px-4 [&_pre]:py-3.5"
          >
            <div
              class="flex min-h-10 items-center gap-2 border-border/64 border-b px-4 py-1 font-mono"
            >
              <HugeiconsIcon
                aria-hidden="true"
                class="size-4"
                icon={ComputerTerminal02Icon}
                strokeWidth={2}
              />
              <span
                class="rounded-lg bg-accent px-2.5 py-1.5 text-foreground text-[0.8125rem] font-medium"
                >pnpm</span
              >
            </div>
            <pre><code>{dependencyCommand}</code></pre>
            <CopyButton class="absolute top-1.5 right-1.5 z-3" value={dependencyCommand} />
          </div>
        </li>
      {/if}
      <li>
        <p>Copy and paste the following component files into your project.</p>
        {#if files.length > 0}
          <Tabs.Root class="min-w-0 [&_figure]:mt-2" bind:value={selectedFile}>
            <Tabs.List
              aria-label="Component source files"
              class="max-w-full overflow-x-auto bg-transparent p-0 *:data-[slot=tab-indicator]:rounded-lg *:data-[slot=tab-indicator]:bg-accent *:data-[slot=tab-indicator]:shadow-none"
            >
              {#each files as file (file.path)}
                <Tabs.Tab class="rounded-lg font-mono text-xs" value={file.path}>
                  {file.path.split("/").at(-1)}
                </Tabs.Tab>
              {/each}
            </Tabs.List>
            {#each files as file (file.path)}
              <Tabs.Panel value={file.path}>
                <CodeSource source={file.source} title={file.path} />
              </Tabs.Panel>
            {/each}
          </Tabs.Root>
        {:else}
          <p class="text-muted-foreground text-sm">Component source is unavailable.</p>
        {/if}
      </li>
      <li><p>Update the import paths to match your project setup.</p></li>
    </ol>
  </Tabs.Panel>
</Tabs.Root>
