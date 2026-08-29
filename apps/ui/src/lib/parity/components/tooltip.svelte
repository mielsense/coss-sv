<script lang="ts">
  import { buttonVariants, Group, ToggleGroup, Tooltip, toggleVariants } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";

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
            tabindex={0}>{@render boldIcon()}</Tooltip.Trigger
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
            tabindex={-1}>{@render italicIcon()}</Tooltip.Trigger
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
            tabindex={-1}>{@render underlineIcon()}</Tooltip.Trigger
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
          tabindex={0}>{@render boldIcon()}</Tooltip.Trigger
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
          tabindex={-1}>{@render italicIcon()}</Tooltip.Trigger
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
          tabindex={-1}>{@render underlineIcon()}</Tooltip.Trigger
        ></ToggleGroup.Root
      ><Tooltip.Root handle={animated}
        >{#snippet children({ payload }: { payload: string | undefined })}
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
          payload="Copy shareable link">{@render linkIcon()}</Tooltip.Trigger
        ><Group.Separator orientation="horizontal" />
        <Tooltip.Trigger
          aria-label="Share via email"
          class={buttonVariants({ size: "icon", variant: "outline" })}
          handle={vertical}
          payload="Share via email">{@render mailIcon()}</Tooltip.Trigger
        ><Group.Separator orientation="horizontal" />
        <Tooltip.Trigger
          aria-label="Share to social"
          class={buttonVariants({ size: "icon", variant: "outline" })}
          handle={vertical}
          payload="Share to social media">{@render share2Icon()}</Tooltip.Trigger
        ></Group.Root
      ><Tooltip.Root handle={vertical}
        >{#snippet children({ payload }: { payload: string | undefined })}
          <Tooltip.Popup class="max-w-40" side="right">{payload}</Tooltip.Popup>
        {/snippet}</Tooltip.Root
      ></Tooltip.Provider
    >
  </section>
</div>

{#snippet boldIcon()}
  <FixtureIcon aria-hidden="true" name="bold" />
{/snippet}
{#snippet italicIcon()}
  <FixtureIcon aria-hidden="true" name="italic" />
{/snippet}
{#snippet underlineIcon()}
  <FixtureIcon aria-hidden="true" name="underline" />
{/snippet}
{#snippet linkIcon()}
  <FixtureIcon aria-hidden="true" name="link" />
{/snippet}
{#snippet mailIcon()}
  <FixtureIcon aria-hidden="true" name="mail" />
{/snippet}
{#snippet share2Icon()}
  <FixtureIcon aria-hidden="true" name="share-2" />
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
