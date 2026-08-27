<script lang="ts">
import { buttonVariants, Group, ToggleGroup, Tooltip, toggleVariants } from "@coss-sv/ui";

const animated = Tooltip.TooltipCreateHandle<string>();
const vertical = Tooltip.TooltipCreateHandle<string>();
let grouped = $state(["bold"]);
let detached = $state(["bold"]);

function toggle(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function moveToggleFocus(event: KeyboardEvent): void {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const current = event.currentTarget;
  if (!(current instanceof HTMLButtonElement)) return;
  const items = Array.from(
    current
      .closest('[data-slot="toggle-group"]')
      ?.querySelectorAll<HTMLButtonElement>("[data-tooltip-toggle]") ?? [],
  );
  const index = items.indexOf(current);
  if (index < 0) return;
  event.preventDefault();
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
  items[next]?.focus();
}
</script>

<div class="fixture">
  <section data-particle="p-tooltip-1">
    <Tooltip.Root
      ><Tooltip.Trigger class={buttonVariants({ variant: "outline" })}>Hover me</Tooltip.Trigger
      ><Tooltip.Popup>Helpful hint</Tooltip.Popup></Tooltip.Root
    >
  </section>
  <section data-particle="p-tooltip-2">
    <Tooltip.Provider
      ><ToggleGroup.Root bind:value={grouped} multiple
        ><Tooltip.Root
          ><Tooltip.Trigger
            aria-label="Toggle bold"
            aria-pressed={grouped.includes("bold")}
            class={toggleVariants()}
            data-pressed={grouped.includes("bold") ? "" : undefined}
            data-slot="toggle"
            data-tooltip-toggle=""
            onclick={() => (grouped = toggle(grouped, "bold"))}
            onkeydown={moveToggleFocus}
            tabindex={0}
            >{@render boldIcon()}</Tooltip.Trigger
          ><Tooltip.Popup>Bold</Tooltip.Popup></Tooltip.Root
        ><Tooltip.Root
          ><Tooltip.Trigger
            aria-label="Toggle italic"
            aria-pressed={grouped.includes("italic")}
            class={toggleVariants()}
            data-pressed={grouped.includes("italic") ? "" : undefined}
            data-slot="toggle"
            data-tooltip-toggle=""
            onclick={() => (grouped = toggle(grouped, "italic"))}
            onkeydown={moveToggleFocus}
            tabindex={-1}
            >{@render italicIcon()}</Tooltip.Trigger
          ><Tooltip.Popup>Italic</Tooltip.Popup></Tooltip.Root
        ><Tooltip.Root
          ><Tooltip.Trigger
            aria-label="Toggle underline"
            aria-pressed={grouped.includes("underline")}
            class={toggleVariants()}
            data-pressed={grouped.includes("underline") ? "" : undefined}
            data-slot="toggle"
            data-tooltip-toggle=""
            onclick={() => (grouped = toggle(grouped, "underline"))}
            onkeydown={moveToggleFocus}
            tabindex={-1}
            >{@render underlineIcon()}</Tooltip.Trigger
          ><Tooltip.Popup>Underline</Tooltip.Popup></Tooltip.Root
        ></ToggleGroup.Root
      ></Tooltip.Provider
    >
  </section>
  <section data-particle="p-tooltip-3">
    <Tooltip.Provider
      ><ToggleGroup.Root bind:value={detached} multiple
        ><Tooltip.Trigger
          aria-label="Toggle bold"
          aria-pressed={detached.includes("bold")}
          class={toggleVariants({ class: "after:absolute after:left-full after:h-full after:w-1" })}
          data-pressed={detached.includes("bold") ? "" : undefined}
          data-slot="toggle"
          data-tooltip-toggle=""
          handle={animated}
          onclick={() => (detached = toggle(detached, "bold"))}
          onkeydown={moveToggleFocus}
          payload="Make text bold"
          tabindex={0}
          >{@render boldIcon()}</Tooltip.Trigger
        ><Tooltip.Trigger
          aria-label="Toggle italic"
          aria-pressed={detached.includes("italic")}
          class={toggleVariants({ class: "after:absolute after:left-full after:h-full after:w-1" })}
          data-pressed={detached.includes("italic") ? "" : undefined}
          data-slot="toggle"
          data-tooltip-toggle=""
          handle={animated}
          onclick={() => (detached = toggle(detached, "italic"))}
          onkeydown={moveToggleFocus}
          payload="Apply italic formatting to text"
          tabindex={-1}
          >{@render italicIcon()}</Tooltip.Trigger
        ><Tooltip.Trigger
          aria-label="Toggle underline"
          aria-pressed={detached.includes("underline")}
          class={toggleVariants({ class: "after:absolute after:left-full after:h-full after:w-1" })}
          data-pressed={detached.includes("underline") ? "" : undefined}
          data-slot="toggle"
          data-tooltip-toggle=""
          handle={animated}
          onclick={() => (detached = toggle(detached, "underline"))}
          onkeydown={moveToggleFocus}
          payload="Underline text"
          tabindex={-1}
          >{@render underlineIcon()}</Tooltip.Trigger
        ></ToggleGroup.Root
      ><Tooltip.Root handle={animated}
        >{#snippet children({payload}: {payload: string | undefined})}
          <Tooltip.Popup>{payload}</Tooltip.Popup>
        {/snippet}</Tooltip.Root
      ></Tooltip.Provider
    >
  </section>
  <section data-particle="p-tooltip-4">
    <Tooltip.Provider
      ><Group.Root aria-label="Share options" orientation="vertical"
        ><Tooltip.Trigger
          aria-label="Copy link"
          class={buttonVariants({ size: "icon", variant: "outline" })}
          handle={vertical}
          payload="Copy shareable link"
          >{@render linkIcon()}</Tooltip.Trigger
        ><Group.Separator orientation="horizontal" />
        <Tooltip.Trigger
          aria-label="Share via email"
          class={buttonVariants({ size: "icon", variant: "outline" })}
          handle={vertical}
          payload="Share via email"
          >{@render mailIcon()}</Tooltip.Trigger
        ><Group.Separator orientation="horizontal" />
        <Tooltip.Trigger
          aria-label="Share to social"
          class={buttonVariants({ size: "icon", variant: "outline" })}
          handle={vertical}
          payload="Share to social media"
          >{@render share2Icon()}</Tooltip.Trigger
        ></Group.Root
      ><Tooltip.Root handle={vertical}
        >{#snippet children({payload}: {payload: string | undefined})}
          <Tooltip.Popup class="max-w-40" side="right">{payload}</Tooltip.Popup>
        {/snippet}</Tooltip.Root
      ></Tooltip.Provider
    >
  </section>
</div>

{#snippet icon(paths: import("svelte").Snippet)}
  <svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
  >
    {@render paths()}
  </svg>
{/snippet}
{#snippet boldIcon()}
  {@render icon(boldPaths)}
{/snippet}
{#snippet boldPaths()}
  <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
{/snippet}
{#snippet italicIcon()}
  {@render icon(italicPaths)}
{/snippet}
{#snippet italicPaths()}
  <line x1="19" x2="10" y1="4" y2="4" />
  <line x1="14" x2="5" y1="20" y2="20" />
  <line x1="15" x2="9" y1="4" y2="20" />
{/snippet}
{#snippet underlineIcon()}
  {@render icon(underlinePaths)}
{/snippet}
{#snippet underlinePaths()}
  <path d="M6 4v6a6 6 0 0 0 12 0V4" />
  <line x1="4" x2="20" y1="20" y2="20" />
{/snippet}
{#snippet linkIcon()}
  {@render icon(linkPaths)}
{/snippet}
{#snippet linkPaths()}
  <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
  <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15" />
{/snippet}
{#snippet mailIcon()}
  {@render icon(mailPaths)}
{/snippet}
{#snippet mailPaths()}
  <rect width="20" height="16" x="2" y="4" rx="2" />
  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
{/snippet}
{#snippet share2Icon()}
  {@render icon(share2Paths)}
{/snippet}
{#snippet share2Paths()}
  <circle cx="18" cy="5" r="3" />
  <circle cx="6" cy="12" r="3" />
  <circle cx="18" cy="19" r="3" />
  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
{/snippet}

<style>
.fixture {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 3rem;
  padding: 2rem;
}
.fixture > section {
  display: flex;
  min-height: 12rem;
  align-items: center;
  justify-content: center;
}
</style>
