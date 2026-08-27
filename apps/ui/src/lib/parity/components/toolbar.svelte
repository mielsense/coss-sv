<script lang="ts">
import { Select as SelectPrimitive } from "@shardsui/svelte";
import { buttonVariants, ToggleGroup, Toolbar, Tooltip } from "@coss-sv/ui";

const iconButton = buttonVariants({ size: "icon", variant: "ghost" });
const saveButton = buttonVariants();
const selectTriggerClass =
  "relative inline-flex min-h-9 w-full min-w-36 select-none items-center justify-between gap-2 rounded-lg border border-input bg-background not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-left text-base text-foreground shadow-xs/5 outline-none ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/16 data-disabled:pointer-events-none data-disabled:opacity-64 sm:min-h-8 sm:text-sm dark:bg-input/32 dark:aria-invalid:ring-destructive/24 dark:not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [[data-disabled],:focus-visible,[aria-invalid],[data-pressed]]:shadow-none";
const selectItemClass =
  "grid min-h-8 in-data-[side=none]:min-w-[calc(var(--anchor-width)+1.25rem)] cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";
const fonts = [
  { label: "Helvetica", value: "helvetica" },
  { label: "Arial", value: "arial" },
  { label: "Times New Roman", value: "times-new-roman" },
];
let font = $state("helvetica");
let tooltipOpen = $state({
  center: false,
  currency: false,
  font: false,
  left: false,
  percent: false,
  right: false,
});
let leftAnchor = $state<HTMLElement | null>(null);
let centerAnchor = $state<HTMLElement | null>(null);
let rightAnchor = $state<HTMLElement | null>(null);
let currencyAnchor = $state<HTMLElement | null>(null);
let percentAnchor = $state<HTMLElement | null>(null);
let fontAnchor = $state<HTMLElement | null>(null);

function closeTooltip(event: FocusEvent, key: keyof typeof tooltipOpen): void {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
    tooltipOpen[key] = false;
  }
}
</script>

{#snippet lineIcon(path: string)}
  <svg
    aria-hidden="true"
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={path} />
  </svg>
{/snippet}
{#snippet chevronsIcon()}
  <svg
    aria-hidden="true"
    class="-me-1 size-4.5 opacity-80 sm:size-4"
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </svg>
{/snippet}
{#snippet checkIcon()}
  <svg
    aria-hidden="true"
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
  </svg>
{/snippet}
{#snippet chevronIcon(direction: "up" | "down")}
  <svg
    aria-hidden="true"
    class="relative size-4.5 sm:size-4"
    fill="none"
    height="24"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={direction === "up" ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
  </svg>
{/snippet}

<div class="toolbar-fixture">
  <section data-particle="p-toolbar-1">
    <Tooltip.Provider>
      <Toolbar.Root>
        <ToggleGroup.Root class="border-none p-0" defaultValue={["left"]}>
          <Tooltip.Root bind:open={tooltipOpen.left}>
            <Tooltip.Trigger
              as="span"
              class="contents"
              onfocusin={() => (tooltipOpen.left = true)}
              onfocusout={(event) => closeTooltip(event, "left")}
            >
              <ToggleGroup.Item
                aria-describedby="toolbar-tooltip-left"
                aria-label="Align left"
                bind:ref={leftAnchor}
                value="left"
                >{@render lineIcon("M15 6H3M21 12H3M15 18H3")}</ToggleGroup.Item
              >
            </Tooltip.Trigger>
            <Tooltip.Popup anchor={leftAnchor ?? undefined} id="toolbar-tooltip-left" sideOffset={8}
              >Align left</Tooltip.Popup
            >
          </Tooltip.Root>
          <Tooltip.Root bind:open={tooltipOpen.center}>
            <Tooltip.Trigger
              as="span"
              class="contents"
              onfocusin={() => (tooltipOpen.center = true)}
              onfocusout={(event) => closeTooltip(event, "center")}
            >
              <ToggleGroup.Item
                aria-describedby="toolbar-tooltip-center"
                aria-label="Toggle center"
                bind:ref={centerAnchor}
                value="center"
                >{@render lineIcon("M17 6H7M21 12H3M17 18H7")}</ToggleGroup.Item
              >
            </Tooltip.Trigger>
            <Tooltip.Popup
              anchor={centerAnchor ?? undefined}
              id="toolbar-tooltip-center"
              sideOffset={8}
              >Align center</Tooltip.Popup
            >
          </Tooltip.Root>
          <Tooltip.Root bind:open={tooltipOpen.right}>
            <Tooltip.Trigger
              as="span"
              class="contents"
              onfocusin={() => (tooltipOpen.right = true)}
              onfocusout={(event) => closeTooltip(event, "right")}
            >
              <ToggleGroup.Item
                aria-describedby="toolbar-tooltip-right"
                aria-label="Toggle right"
                bind:ref={rightAnchor}
                value="right"
                >{@render lineIcon("M21 6H9M21 12H3M21 18H9")}</ToggleGroup.Item
              >
            </Tooltip.Trigger>
            <Tooltip.Popup
              anchor={rightAnchor ?? undefined}
              id="toolbar-tooltip-right"
              sideOffset={8}
              >Align right</Tooltip.Popup
            >
          </Tooltip.Root>
        </ToggleGroup.Root>
        <Toolbar.Separator />
        <Toolbar.Group>
          <Tooltip.Root bind:open={tooltipOpen.currency}>
            <Tooltip.Trigger
              as="span"
              class="contents"
              onfocusin={() => (tooltipOpen.currency = true)}
              onfocusout={(event) => closeTooltip(event, "currency")}
            >
              <Toolbar.Button
                aria-describedby="toolbar-tooltip-currency"
                aria-label="Format as currency"
                bind:ref={currencyAnchor}
                class={iconButton}
                >{@render lineIcon("M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6")}</Toolbar.Button
              >
            </Tooltip.Trigger>
            <Tooltip.Popup
              anchor={currencyAnchor ?? undefined}
              id="toolbar-tooltip-currency"
              sideOffset={8}
              >Format as currency</Tooltip.Popup
            >
          </Tooltip.Root>
          <Tooltip.Root bind:open={tooltipOpen.percent}>
            <Tooltip.Trigger
              as="span"
              class="contents"
              onfocusin={() => (tooltipOpen.percent = true)}
              onfocusout={(event) => closeTooltip(event, "percent")}
            >
              <Toolbar.Button
                aria-describedby="toolbar-tooltip-percent"
                aria-label="Format as percent"
                bind:ref={percentAnchor}
                class={iconButton}
                >{@render lineIcon("m19 5-14 14M6.5 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 16a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3")}</Toolbar.Button
              >
            </Tooltip.Trigger>
            <Tooltip.Popup
              anchor={percentAnchor ?? undefined}
              id="toolbar-tooltip-percent"
              sideOffset={8}
              >Format as percent</Tooltip.Popup
            >
          </Tooltip.Root>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group>
          <SelectPrimitive.Root bind:value={font} items={fonts}>
            <Tooltip.Root bind:open={tooltipOpen.font}>
              <Tooltip.Trigger
                as="span"
                class="contents"
                onfocusin={() => (tooltipOpen.font = true)}
                onfocusout={(event) => closeTooltip(event, "font")}
              >
                <SelectPrimitive.Trigger
                  aria-describedby="toolbar-tooltip-font"
                  bind:ref={fontAnchor}
                  class={selectTriggerClass}
                  data-slot="select-trigger"
                >
                  <SelectPrimitive.Value
                    class="flex-1 truncate data-placeholder:text-muted-foreground"
                    data-slot="select-value"
                  />
                  <SelectPrimitive.Icon data-slot="select-icon"
                    >{@render chevronsIcon()}</SelectPrimitive.Icon
                  >
                </SelectPrimitive.Trigger>
              </Tooltip.Trigger>
              <Tooltip.Popup
                anchor={fontAnchor ?? undefined}
                id="toolbar-tooltip-font"
                sideOffset={8}
                >Select a different font</Tooltip.Popup
              >
            </Tooltip.Root>
            <SelectPrimitive.Portal>
              <SelectPrimitive.Positioner
                align="start"
                alignOffset={0}
                class="z-50 select-none"
                data-slot="select-positioner"
                side="bottom"
                sideOffset={4}
              >
                <SelectPrimitive.Popup
                  class="origin-(--transform-origin) text-foreground outline-none"
                  data-slot="select-popup"
                >
                  <SelectPrimitive.ScrollUpArrow
                    class="top-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:top-px before:h-[200%] before:rounded-t-[calc(var(--radius-lg)-1px)] before:bg-linear-to-b before:from-50% before:from-popover"
                    data-slot="select-scroll-up-arrow"
                    >{@render chevronIcon("up")}</SelectPrimitive.ScrollUpArrow
                  >
                  <div
                    class="relative h-full min-w-(--anchor-width) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]"
                  >
                    <SelectPrimitive.List
                      class="max-h-(--available-height) overflow-y-auto p-1"
                      data-slot="select-list"
                    >
                      {#each fonts as item (item.value)}
                        <SelectPrimitive.Item class={selectItemClass} value={item.value}>
                          <SelectPrimitive.ItemIndicator class="col-start-1"
                            >{@render checkIcon()}</SelectPrimitive.ItemIndicator
                          >
                          <div class="col-start-2 min-w-0">{item.label}</div>
                        </SelectPrimitive.Item>
                      {/each}
                    </SelectPrimitive.List>
                  </div>
                  <SelectPrimitive.ScrollDownArrow
                    class="bottom-0 z-50 flex h-6 w-full cursor-default items-center justify-center before:pointer-events-none before:absolute before:inset-x-px before:bottom-px before:h-[200%] before:rounded-b-[calc(var(--radius-lg)-1px)] before:bg-linear-to-t before:from-50% before:from-popover"
                    data-slot="select-scroll-down-arrow"
                    >{@render chevronIcon("down")}</SelectPrimitive.ScrollDownArrow
                  >
                </SelectPrimitive.Popup>
              </SelectPrimitive.Positioner>
            </SelectPrimitive.Portal>
          </SelectPrimitive.Root>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group><Toolbar.Button class={saveButton}>Save</Toolbar.Button></Toolbar.Group>
      </Toolbar.Root>
    </Tooltip.Provider>
  </section>
</div>

<style>
.toolbar-fixture {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  gap: 3rem;
  padding: 2rem;
}
.toolbar-fixture > section {
  display: flex;
  min-width: 0;
  justify-content: center;
}
</style>
