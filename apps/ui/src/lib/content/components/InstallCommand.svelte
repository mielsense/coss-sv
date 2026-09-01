<script lang="ts">
  import * as Tabs from "@coss-sv/ui/components/ui/tabs";
  import { onMount } from "svelte";
  import type { ComponentSourceFile } from "@/content/component-source.js";
  import {
    dependencyInstallCommands,
    type PackageManager,
    shadcnInstallCommands,
  } from "@/content/install-commands.js";
  import CodeSource from "./CodeSource.svelte";
  import PackageManagerCommand from "./PackageManagerCommand.svelte";

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
  let packageManager = $state<PackageManager>("pnpm");
  const registryTargets = $derived(
    shadcnSvelte.replace(/^pnpm dlx shadcn-svelte@latest add\s+/, ""),
  );
  const cliCommands = $derived(shadcnInstallCommands(registryTargets));
  const dependencyCommands = $derived(dependencyInstallCommands(dependencies));

  onMount(() => {
    const saved = localStorage.getItem("coss-installation-method");
    if (saved === "cli" || saved === "manual") selected = saved;
    const savedPackageManager = localStorage.getItem("coss-package-manager");
    if (
      savedPackageManager === "bun" ||
      savedPackageManager === "npm" ||
      savedPackageManager === "pnpm" ||
      savedPackageManager === "yarn"
    ) {
      packageManager = savedPackageManager;
    }
    selectedFile ??= files[0]?.path;
  });

  $effect(() => {
    if (selected === "cli" || selected === "manual") {
      localStorage.setItem("coss-installation-method", selected);
    }
    localStorage.setItem("coss-package-manager", packageManager);
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
    <PackageManagerCommand commands={cliCommands} bind:value={packageManager} />
  </Tabs.Panel>

  <Tabs.Panel value="manual">
    <ol class="m-0 grid gap-6 ps-6 [&_li]:ps-1 [&_p]:mb-3 [&_p]:mt-0">
      {#if dependencies.length > 0}
        <li>
          <p>Install the following dependencies:</p>
          <PackageManagerCommand commands={dependencyCommands} bind:value={packageManager} />
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
