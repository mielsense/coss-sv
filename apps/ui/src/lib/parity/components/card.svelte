<script lang="ts">
  import { Select } from "@shardsui/svelte/select";
  import {
    Card,
    CardDescription,
    CardFooter,
    CardFrame,
    CardFrameAction,
    CardFrameDescription,
    CardFrameHeader,
    CardFrameTitle,
    CardHeader,
    CardPanel,
    CardTitle,
  } from "../../../../../../packages/ui/dist/components/ui/card/index.js";
  import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
  } from "../../../../../../packages/ui/dist/components/ui/empty/index.js";
  import { Input } from "../../../../../../packages/ui/dist/components/ui/input/index.js";
  import CossButton from "./c1-button.svelte";
  import FixtureIcon from "./fixture-icon.svelte";

  const frameworkOptions = [
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Remix", value: "remix" },
    { label: "Astro", value: "astro" },
  ];

  const fieldLabelClass =
    "inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground data-disabled:opacity-64 sm:text-sm/4";
  const selectTriggerClass =
    "relative inline-flex min-h-9 w-full min-w-36 select-none items-center justify-between gap-2 rounded-lg border border-input bg-background not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-left text-base text-foreground shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm dark:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [[data-disabled],:focus-visible,[aria-invalid],[data-pressed]]:shadow-none";
  const selectItemClass =
    "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";

  let framework = $state("next");
</script>

<div class="card-review-shell">
  <div class="card-particle-shell">
    <Card class="w-full max-w-xs" data-anchor="p-card-1">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardPanel>
        <form
          class="flex w-full flex-col gap-4"
          data-slot="form"
          onsubmit={(event) => event.preventDefault()}
        >
          <div class="flex flex-col items-start gap-2" data-slot="field">
            <label class={fieldLabelClass} data-slot="field-label" for="project-name">Name</label>
            <Input id="project-name" placeholder="Name of your project" type="text" />
          </div>
          <div class="flex flex-col items-start gap-2" data-slot="field">
            <label class={fieldLabelClass} data-slot="field-label" for="framework">Framework</label>
            <Select.Root id="framework" items={frameworkOptions} bind:value={framework}>
              <Select.Trigger class={selectTriggerClass} data-slot="select-trigger">
                <Select.Value
                  class="flex-1 truncate data-placeholder:text-muted-foreground"
                  data-slot="select-value"
                />
                <Select.Icon data-slot="select-icon">
                  <FixtureIcon
                    aria-hidden="true"
                    class="-me-1 size-4.5 opacity-80 sm:size-4"
                    name="unfold-more"
                  />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner
                  align="start"
                  class="z-50 select-none"
                  data-slot="select-positioner"
                  side="bottom"
                  sideOffset={4}
                >
                  <Select.Popup
                    class="origin-(--transform-origin) text-foreground outline-none"
                    data-slot="select-popup"
                  >
                    <Select.ScrollUpArrow
                      class="top-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:top-px before:h-[200%] before:rounded-t-[calc(var(--radius-lg)-1px)] before:bg-linear-to-b before:from-50% before:from-popover"
                      data-slot="select-scroll-up-arrow"
                    >
                      <FixtureIcon
                        aria-hidden="true"
                        class="relative size-4.5 sm:size-4"
                        name="arrow-up"
                      />
                    </Select.ScrollUpArrow>
                    <div
                      class="relative h-full min-w-(--anchor-width) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]"
                    >
                      <Select.List
                        class="max-h-(--available-height) overflow-y-auto p-1"
                        data-slot="select-list"
                      >
                        {#each frameworkOptions as { label, value } (value)}
                          <Select.Item class={selectItemClass} {value} data-slot="select-item">
                            <Select.ItemIndicator class="col-start-1">
                              <FixtureIcon aria-hidden="true" name="check" />
                            </Select.ItemIndicator>
                            <span class="col-start-2 min-w-0" data-slot="select-item-text"
                              >{label}</span
                            >
                          </Select.Item>
                        {/each}
                      </Select.List>
                    </div>
                    <Select.ScrollDownArrow
                      class="bottom-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:bottom-px before:h-[200%] before:rounded-b-[calc(var(--radius-lg)-1px)] before:bg-linear-to-t before:from-50% before:from-popover"
                      data-slot="select-scroll-down-arrow"
                    >
                      <FixtureIcon
                        aria-hidden="true"
                        class="relative size-4.5 sm:size-4"
                        name="arrow-down"
                      />
                    </Select.ScrollDownArrow>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </div>
          <CossButton class="w-full" type="submit">Deploy</CossButton>
        </form>
      </CardPanel>
      <CardFooter>
        <div class="flex gap-1 text-muted-foreground text-xs">
          <FixtureIcon aria-hidden="true" class="size-3 h-lh shrink-0" name="alert-circle" />
          <p>This will take a few seconds to complete.</p>
        </div>
      </CardFooter>
    </Card>

    <div class="card-frame-particle-shell">
      <CardFrame class="w-full" data-anchor="p-card-11">
        <CardFrameHeader>
          <CardFrameTitle>Project</CardFrameTitle>
          <CardFrameDescription>Manage your projects</CardFrameDescription>
          <CardFrameAction>
            <CossButton variant="outline">
              <FixtureIcon aria-hidden="true" name="plus" />
              Add
            </CossButton>
          </CardFrameAction>
        </CardFrameHeader>
        <Card>
          <CardPanel>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FixtureIcon aria-hidden="true" name="folder" />
                </EmptyMedia>
                <EmptyTitle>No projects yet</EmptyTitle>
                <EmptyDescription>Get started by adding your first project.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardPanel>
        </Card>
      </CardFrame>
    </div>
  </div>
</div>

<style>
  .card-review-shell {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    min-height: 24rem;
    align-items: center;
    justify-content: center;
    padding-block: 2rem;
  }

  .card-particle-shell {
    display: flex;
    width: 42.875rem;
    max-width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }

  .card-frame-particle-shell {
    width: 31.125rem;
    max-width: 100%;
  }

  @media (width < 40rem) {
    .card-particle-shell {
      width: 19.25rem;
    }

    .card-frame-particle-shell {
      width: 19.25rem;
    }
  }
</style>
