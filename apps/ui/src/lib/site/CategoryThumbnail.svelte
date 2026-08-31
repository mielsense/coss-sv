<script lang="ts">
  import Button from "./thumbnail/ThumbnailButton.svelte";
  import Card from "./thumbnail/ThumbnailCard.svelte";
  import Icon from "./thumbnail/ThumbnailIcon.svelte";
  import Panel from "./thumbnail/ThumbnailPanel.svelte";
  import Text from "./thumbnail/ThumbnailText.svelte";

  let { slug }: { slug: string } = $props();
</script>

{#snippet checkboxItem(checked = false, className = "")}
  <div class={`flex items-center gap-2 ${className}`}>
    <div
      class={`size-4 shrink-0 rounded ${checked ? "bg-linear-to-b from-(--btn-from) to-(--btn-to)" : "bg-muted-foreground/20"}`}
    ></div>
    <Text class="w-full" variant="secondary" />
  </div>
{/snippet}

{#snippet radioItem(checked = false)}
  <div class="flex items-center gap-2">
    <div
      class={`size-4 shrink-0 rounded-full ${checked ? "bg-linear-to-b from-(--btn-from) to-(--btn-to)" : "bg-muted-foreground/20"}`}
    ></div>
    <Text class="w-full" variant="secondary" />
  </div>
{/snippet}

{#snippet formField(showError = false)}
  <div class="flex flex-col gap-2">
    <Text class="w-16" />
    <Card class="[--radius-2xl:10px]" withGradient={false}><Panel class="py-3.5" /></Card>
    {#if showError}
      <Text class="w-[80%]" variant="secondary" />
    {/if}
  </div>
{/snippet}

{#snippet tableRow()}
  <div class="flex items-center gap-2 p-3">
    <Text class="size-2.5 rounded-xs" />
    <Text class="flex-1" />
    <Text class="flex-1" variant="secondary" />
    <Text class="flex-1" variant="secondary" />
    <Text class="flex-1" variant="secondary" />
    <Text class="flex-1" variant="secondary" />
  </div>
{/snippet}

{#snippet commandItem()}
  <div class="flex items-center justify-between gap-2">
    <Text class="w-[65%]" variant="secondary" />
    <Text class="w-4" variant="secondary" />
  </div>
{/snippet}

{#if slug !== "segmented-control"}
  <div
    class="flex size-full flex-1 translate-y-0.5 items-center justify-center overflow-visible px-8 py-6 transition-transform duration-180 ease-out group-hover:translate-y-0 motion-reduce:transition-none [&_*]:border-border"
    data-thumbnail={slug}
  >
    {#if slug === "accordion"}
      <Card class="max-w-50"
        ><Panel class="divide-y divide-border p-0">
          <div class="p-3">
            <div class="flex items-center gap-2">
              <Icon name="chevron-down" />
              <Text class="w-[60%]" />
            </div>
          </div>
          <div class="p-3">
            <div class="flex items-center gap-2">
              <Icon class="rotate-180" name="chevron-down" />
              <div class="flex flex-1 flex-col gap-2">
                <Text class="w-[50%]" />
                <Text class="w-[90%]" variant="secondary" />
              </div>
            </div>
          </div>
          <div class="p-3">
            <div class="flex items-center gap-2">
              <Icon name="chevron-down" />
              <Text class="w-[60%]" />
            </div>
          </div>
        </Panel></Card
      >
    {:else if slug === "alert"}
      <Card
        ><Panel class="flex items-center gap-2 p-3"
          ><Icon name="alert" />
          <Text class="w-[70%]" variant="secondary" /></Panel
        ></Card
      >
    {:else if slug === "alert-dialog"}
      <Card class="max-w-50"
        ><Panel class="flex flex-col gap-5 p-4"
          ><div class="flex flex-col gap-2">
            <Text class="w-[50%]" />
            <Text class="w-[90%]" variant="secondary" />
          </div>
          <div class="flex items-center justify-end gap-2">
            <Button /><Button variant="primary" />
          </div></Panel
        ></Card
      >
    {:else if slug === "autocomplete"}
      <div class="flex max-w-50 flex-1 flex-col gap-2">
        <Card class="[--radius-2xl:12px]" withGradient={false}
          ><Panel class="flex items-center gap-2 px-4 py-2"
            ><Text class="w-[40%]" />
            <Icon name="text-cursor" /></Panel
          ></Card
        ><Card class="[--radius-2xl:10px]"
          ><Panel class="flex flex-col gap-4 p-4"
            ><Text variant="secondary" />
            <Text variant="secondary" />
            <Text variant="secondary" /></Panel
          ></Card
        >
      </div>
    {:else if slug === "avatar"}
      <Card class="size-12 [--radius-2xl:9999px]"
        ><Panel class="flex items-center justify-center p-0"
          ><div class="flex size-full items-center justify-center rounded-full">
            <Icon name="user" />
          </div></Panel
        ></Card
      >
    {:else if slug === "badge"}
      <Card class="max-w-24 [--radius-2xl:9999px]"
        ><Panel class="flex items-center gap-2 px-2.5 py-2"
          ><div class="size-2 rounded-full bg-muted-foreground/88"></div>
          <Text class="flex-1" /></Panel
        ></Card
      >
    {:else if slug === "breadcrumb"}
      <Card
        ><Panel class="flex items-center gap-1 p-3"
          ><Text class="flex-1" />
          <Icon name="chevron-right" />
          <Text class="flex-1" variant="secondary" />
          <Icon name="chevron-right" />
          <Text class="flex-1" variant="secondary" /></Panel
        ></Card
      >
    {:else if slug === "button"}
      <Card
        class="max-w-24 border-none bg-linear-to-b from-(--btn-from) to-(--btn-to) [--radius-2xl:14px]"
        withGradient={false}
        ><Panel class="px-6 py-4"><Text class="bg-primary-foreground/40" /></Panel></Card
      >
    {:else if slug === "calendar"}
      <Card class="max-w-36 [--radius-2xl:14px]"
        ><Panel class="flex flex-col gap-4 p-4"
          ><div class="flex items-center gap-2">
            <Icon name="chevron-left" />
            <Text class="w-[60%]" variant="secondary" />
            <Icon name="chevron-right" />
          </div>
          <div class="flex items-center gap-2">
            <Text class="flex-1" variant="secondary" />
            <Text class="flex-1" variant="secondary" />
            <Text class="flex-1" variant="main" />
            <Text class="flex-1 bg-transparent" variant="main" />
            <Text class="flex-1" variant="main" />
          </div>
          <div class="flex items-center gap-2">
            <Text class="flex-1" variant="main" />
            <Text class="flex-1 bg-transparent" variant="main" />
            <Text class="flex-1" variant="main" />
            <Text class="flex-1" variant="main" />
            <Text class="flex-1" variant="main" />
          </div>
          <div class="flex items-center gap-2">
            <Text class="flex-1 bg-transparent" variant="main" />
            <Text class="flex-1" variant="main" />
            <Text class="flex-1 bg-primary" variant="main" />
            <Text class="flex-1" variant="main" />
            <Text class="flex-1 bg-transparent" variant="main" />
          </div>
          <div class="flex items-center gap-2">
            <Text class="flex-1" variant="main" />
            <Text class="flex-1" variant="main" />
            <Text class="flex-1 bg-transparent" variant="main" />
            <Text class="flex-1" variant="secondary" />
            <Text class="flex-1" variant="secondary" />
          </div></Panel
        ></Card
      >
    {:else if slug === "card"}
      <Card class="max-w-36 [--radius-2xl:14px]"
        ><Panel class="flex flex-col gap-4 p-4"
          ><div class="flex flex-col gap-2">
            <Text class="w-[60%]" />
            <Text class="w-[90%]" variant="secondary" />
          </div>
          <div class="flex flex-col gap-2">
            <div class="h-4 rounded-sm bg-muted-foreground/8"></div>
            <div class="h-4 rounded-sm bg-muted-foreground/8"></div>
            <Button class="w-full rounded-sm" variant="primary" />
          </div></Panel
        ></Card
      >
    {:else if slug === "checkbox"}
      <div class="flex max-w-28 flex-1 flex-col gap-3">
        {@render checkboxItem()}{@render checkboxItem(true)}
      </div>
    {:else if slug === "checkbox-group"}
      <div class="flex max-w-28 flex-1 flex-col gap-3">
        {@render checkboxItem(true)}{@render checkboxItem(false, "ps-4")}
        {@render checkboxItem(true, "ps-4")}{@render checkboxItem()}
      </div>
    {:else if slug === "collapsible"}
      <Card
        ><Panel class="divide-y divide-border p-0"
          ><div class="flex items-center justify-between px-4 py-3">
            <Text class="w-[60%]" />
            <Icon name="chevron-down" />
          </div>
          <div class="flex flex-col gap-2 p-4">
            <Text class="w-[80%]" variant="secondary" />
            <Text class="w-[70%]" variant="secondary" />
          </div></Panel
        ></Card
      >
    {:else if slug === "combobox"}
      <Card class="[--radius-2xl:14px]" withGradient={false}
        ><Panel class="flex items-center gap-2 px-3 py-[calc(--spacing(2.5)-1px)]"
          >{#each [0, 1] as _}
            <div
              class="flex h-5 items-center gap-1 rounded-sm bg-muted-foreground/8 py-0.5 ps-2 pe-1"
            >
              <Text class="w-6" />
              <Icon name="x" />
            </div>
          {/each}</Panel
        ></Card
      >
    {:else if slug === "command"}
      <Card class="max-w-50"
        ><Panel class="divide-y divide-border p-0"
          ><div class="flex items-center gap-2 px-4 py-3">
            <Icon name="search" />
            <Text class="w-[40%]" />
          </div>
          <div class="flex flex-col gap-4 p-4">
            {@render commandItem()}{@render commandItem()}{@render commandItem()}
          </div></Panel
        ></Card
      >
    {:else if slug === "context-menu"}
      <div class="flex max-w-50 flex-1 flex-col">
        <Card
          class="border-input border-dashed bg-none shadow-none [--radius-2xl:10px] before:hidden"
          ><Panel class="min-h-20" /></Card
        ><Card class="ms-auto -mt-3 w-fit [--radius-2xl:10px]"
          ><Panel class="flex flex-col gap-3 p-3"
            ><Text class="w-16" variant="secondary" />
            <Text class="w-16" variant="secondary" />
            <Text class="w-16" variant="secondary" /></Panel
          ></Card
        >
      </div>
    {:else if slug === "date-picker"}
      <Card class="[--radius-2xl:14px]" withGradient={false}
        ><Panel class="flex items-center gap-2 p-3"
          ><Icon name="calendar" />
          <Text class="w-[60%]" /></Panel
        ></Card
      >
    {:else if slug === "dialog"}
      <Card class="max-w-36 [--radius-2xl:14px]"
        ><Panel class="flex flex-col gap-4 p-4"
          ><Text class="w-[60%]" />
          <div class="flex flex-col gap-2">
            <div class="h-4 rounded-sm bg-muted-foreground/8"></div>
            <div class="h-4 rounded-sm bg-muted-foreground/8"></div>
          </div>
          <div class="flex items-center justify-end gap-2">
            <Button /><Button variant="primary" />
          </div></Panel
        ></Card
      >
    {:else if slug === "drawer"}
      <div class="flex h-full w-full flex-1 flex-col justify-end gap-2">
        <div class="flex-1 rounded-xl border border-input border-dashed"></div>
        <Card class="max-w-none shrink-0 [--radius-2xl:14px]"
          ><Panel class="pt-1 pb-12"
            ><div class="flex justify-center py-2">
              <div class="h-1 w-12 rounded-full bg-muted-foreground/30"></div>
            </div></Panel
          ></Card
        >
      </div>
    {:else if slug === "empty"}
      <Card class="border-input border-dashed bg-none shadow-none before:hidden"
        ><Panel class="flex flex-col items-center gap-2"
          ><div class="size-8 rounded-full bg-muted-foreground/20"></div>
          <Text class="w-[60%]" />
          <Text class="w-[80%]" variant="secondary" /></Panel
        ></Card
      >
    {:else if slug === "field"}
      <div class="flex max-w-50 flex-1 flex-col gap-3">{@render formField(true)}</div>
    {:else if slug === "fieldset"}
      <div class="flex max-w-50 flex-1 flex-col gap-4">
        {@render formField()}{@render formField()}
      </div>
    {:else if slug === "form"}
      <div class="flex max-w-50 flex-1 flex-col gap-4">
        {@render formField()}
        <Card
          class="border-none bg-linear-to-b from-(--btn-from) to-(--btn-to) [--radius-2xl:10px]"
          withGradient={false}><Panel class="py-3.5" /></Card
        >
      </div>
    {:else if slug === "frame"}
      <div class="flex-1 rounded-[calc(var(--radius-2xl)+2px)] bg-muted/72 p-1">
        <div class="flex flex-col gap-2 p-4"><Text class="w-[70%]" /></div>
        <Card class="max-w-none"
          ><Panel class="p-5"
            ><div class="flex flex-col gap-2">
              <Text class="w-[70%]" />
              <Text class="w-[90%]" variant="secondary" />
            </div></Panel
          ></Card
        >
      </div>
    {:else if slug === "group"}
      <Card class="max-w-48 flex-row divide-x [--radius-2xl:14px]"
        ><Panel class="px-6 py-4"><Text /></Panel><Panel class="px-6 py-4"><Text /></Panel></Card
      >
    {:else if slug === "input"}
      <Card class="[--radius-2xl:14px]" withGradient={false}
        ><Panel class="px-6 py-4"><Text class="w-[60%]" /></Panel></Card
      >
    {:else if slug === "input-group"}
      <Card class="[--radius-2xl:14px]" withGradient={false}
        ><Panel class="flex gap-2 p-0"
          ><div class="flex flex-1 items-center gap-2 py-2.5 ps-4">
            <Icon name="search" />
            <Text class="w-[60%]" />
          </div>
          <div class="flex items-center py-2.5 pe-4">
            <div class="size-4 shrink-0 rounded bg-muted-foreground/20"></div>
          </div></Panel
        ></Card
      >
    {:else if slug === "otp-field"}
      <div class="flex max-w-50 flex-1 items-center gap-2">
        {#each [0, 1, 2, 3] as index}
          <Card class="size-10 [--radius-2xl:12px]" withGradient={false}
            ><Panel class="flex items-center justify-center p-0"
              >{#if index < 3}
                <Text class="size-1.5" />
              {:else}
                <Icon name="text-cursor" />
              {/if}</Panel
            ></Card
          >
        {/each}
      </div>
    {:else if slug === "kbd"}
      <div class="flex items-center justify-center gap-2">
        {#each ["⌘", "K"] as key}
          <Card class="size-10 [--radius-2xl:10px]"
            ><Panel
              class="flex items-center justify-center p-0 text-muted-foreground/88 leading-none"
              >{key}</Panel
            ></Card
          >
        {/each}
      </div>
    {:else if slug === "label"}
      <div class="flex max-w-50 flex-1 flex-col gap-3">
        <Text class="w-16 bg-primary" />
        <Card class="[--radius-2xl:10px]" withGradient={false}><Panel class="py-3.5" /></Card>
      </div>
    {:else if slug === "menu"}
      <div class="flex max-w-50 flex-1 flex-col items-end gap-2">
        <Card class="w-fit [--radius-2xl:12px]"
          ><Panel class="flex items-center gap-2 p-2"><Icon name="ellipsis" /></Panel></Card
        ><Card class="[--radius-2xl:10px]"
          ><Panel class="flex flex-col gap-4 p-4"
            ><div class="me-6"><Text variant="secondary" /></div>
            <div class="flex items-center gap-4">
              <div class="flex-1"><Text variant="secondary" /></div>
              <Icon class="-m-1" name="chevron-right" />
            </div>
            <div class="me-6"><Text variant="secondary" /></div></Panel
          ></Card
        >
      </div>
    {:else if slug === "meter"}
      <div class="flex max-w-50 flex-1 flex-col gap-2">
        <div class="flex items-center justify-between">
          <Text class="w-[50%]" />
          <Text class="w-8" />
        </div>
        <div class="h-2 w-full rounded-full bg-muted-foreground/20">
          <div
            class="h-2 w-[65%] rounded-s-full bg-linear-to-b from-(--btn-from) to-(--btn-to)"
          ></div>
        </div>
      </div>
    {:else if slug === "number-field"}
      <Card class="[--radius-2xl:14px]"
        ><Panel class="flex items-center gap-2 px-4 py-2.5"
          ><Icon class="shrink-0" name="minus" />
          <div class="flex flex-1 justify-center"><Text class="w-12" /></div>
          <Icon class="shrink-0" name="plus" /></Panel
        ></Card
      >
    {:else if slug === "pagination"}
      <div class="flex flex-1 items-center gap-4">
        <Card class="w-fit [--radius-2xl:12px]"
          ><Panel class="p-2"><Icon name="chevron-left" /></Panel></Card
        >
        <div class="flex flex-1 gap-2">
          <Text class="flex-1" variant="secondary" />
          <Text class="flex-1" variant="secondary" />
          <Text class="flex-1" variant="secondary" />
        </div>
        <Card class="w-fit [--radius-2xl:12px]"
          ><Panel class="p-2"><Icon name="chevron-right" /></Panel></Card
        >
      </div>
    {:else if slug === "popover"}
      <div class="flex max-w-50 flex-1 flex-col items-center gap-2">
        <Card class="w-fit [--radius-2xl:12px]"
          ><Panel class="px-4 py-3"><Text class="w-12" /></Panel></Card
        ><Card class="[--radius-2xl:10px]"
          ><Panel class="flex flex-col gap-3 p-4"
            ><Text class="w-[70%]" />
            <div class="flex flex-col gap-1.5">
              <Text class="w-[80%]" variant="secondary" />
              <Text class="w-[60%]" variant="secondary" />
            </div></Panel
          ></Card
        >
      </div>
    {:else if slug === "preview-card"}
      <Card class="max-w-50"
        ><Panel class="flex items-center gap-3 p-4"
          ><div class="size-9 shrink-0 rounded-full bg-muted-foreground/20"></div>
          <div class="flex flex-1 flex-col gap-2">
            <Text class="w-[70%]" />
            <Text variant="secondary" />
            <Text class="w-[90%]" variant="secondary" />
          </div></Panel
        ></Card
      >
    {:else if slug === "progress"}
      <div class="flex max-w-50 flex-1 flex-col gap-2">
        <div class="h-2 w-full rounded-full bg-muted-foreground/20">
          <div
            class="h-2 w-[45%] rounded-s-full bg-linear-to-b from-(--btn-from) to-(--btn-to)"
          ></div>
        </div>
      </div>
    {:else if slug === "radio-group"}
      <div class="flex max-w-28 flex-1 flex-col gap-3">
        {@render radioItem()}{@render radioItem(true)}
      </div>
    {:else if slug === "scroll-area"}
      <Card class="max-w-36 [--radius-2xl:14px]"
        ><Panel class="relative p-0"
          ><div class="flex flex-col gap-2 p-3">
            <Text class="w-[80%]" variant="secondary" />
            <Text class="w-[90%]" variant="secondary" />
            <Text class="w-[70%]" variant="secondary" />
            <Text class="w-[85%]" variant="secondary" />
            <Text class="w-[90%]" variant="secondary" />
            <Text class="w-[80%]" variant="secondary" />
          </div>
          <div
            class="absolute top-2 right-1 h-8 w-1 rounded-full bg-muted-foreground/40"
          ></div></Panel
        ></Card
      >
    {:else if slug === "select"}
      <Card class="[--radius-2xl:14px]" withGradient={false}
        ><Panel class="flex gap-2 p-0"
          ><div class="flex flex-1 items-center justify-between gap-2 py-2.5 ps-4 pe-2.5">
            <Text class="w-[60%]" />
            <Icon name="chevron-down" />
          </div></Panel
        ></Card
      >
    {:else if slug === "separator"}
      <div class="max-w-50 flex-1 divide-y">
        <div class="flex flex-col gap-2 py-3">
          <Text class="w-[60%]" />
          <Text variant="secondary" />
        </div>
        <div class="flex items-center gap-2 divide-x py-3">
          {#each [0, 1, 2, 3] as index}
            <div class={`${index % 2 === 0 ? "-mx-2" : ""} flex-1 px-2 py-1`}>
              <Text variant="secondary" />
            </div>
          {/each}
        </div>
      </div>
    {:else if slug === "sheet"}
      <div class="flex h-full flex-1 gap-2">
        <div class="flex-1 rounded-xl border border-input border-dashed"></div>
        <Card class="h-full max-w-1/3 [--radius-2xl:14px]"
          ><Panel class="flex flex-col gap-4 p-3"
            ><div class="flex flex-1 flex-col gap-2">
              <Text class="w-[60%]" />
              <Text variant="secondary" />
            </div>
            <div class="flex justify-end"><Button variant="primary" /></div></Panel
          ></Card
        >
      </div>
    {:else if slug === "skeleton"}
      <div
        class="mask-[linear-gradient(100deg,black_0%,rgba(0,0,0,0.2)_20%,rgba(0,0,0,0.2)_80%,rgba(0,0,0,0.6)_100%)] flex max-w-50 flex-1 items-center gap-3"
      >
        <div class="size-8 rounded-full bg-muted-foreground/20"></div>
        <div class="flex flex-1 flex-col gap-2">
          <Text variant="secondary" />
          <Text variant="secondary" />
        </div>
      </div>
    {:else if slug === "slider"}
      <div class="flex w-full max-w-50 items-center gap-1">
        <Text class="w-[35%] bg-linear-to-b from-(--btn-from) to-(--btn-to)" variant="secondary" />
        <div class="size-4 rounded-full bg-linear-to-b from-(--btn-from) to-(--btn-to)"></div>
        <Text class="flex-1" variant="secondary" />
      </div>
    {:else if slug === "spinner"}
      <div
        class="size-8 rotate-45 rounded-full border-3 border-muted-foreground/20 border-t-primary"
      ></div>
    {:else if slug === "switch"}
      <div class="h-6 w-10 rounded-full bg-muted-foreground/20 p-0.5">
        <div
          class="size-5 rounded-full bg-linear-to-b from-card to-card/90 shadow-xs/5 dark:from-background/90 dark:to-background"
        ></div>
      </div>
    {:else if slug === "table"}
      <Card
        ><Panel class="p-0"
          ><div class="divide-y divide-border">
            {@render tableRow()}{@render tableRow()}{@render tableRow()}
          </div></Panel
        ></Card
      >
    {:else if slug === "tabs"}
      <div class="flex max-w-50 flex-col gap-4">
        <div class="flex rounded-lg bg-muted-foreground/12 p-0.5">
          {#each [0, 1, 2] as index}
            <div
              class={`rounded-[calc(var(--radius-lg)-1px)] p-3 ${index === 0 ? "bg-linear-to-b from-card to-card/90 shadow-xs/5 dark:from-background/90 dark:to-background" : ""}`}
            >
              <Text
                class={`w-6 ${index === 0 ? "bg-primary" : ""}`}
                variant={index === 0 ? "main" : "secondary"}
              />
            </div>
          {/each}
        </div>
        <div class="flex flex-col gap-2">
          <Text class="w-[70%]" />
          <Text variant="secondary" />
        </div>
      </div>
    {:else if slug === "textarea"}
      <Card class="[--radius-2xl:14px]" withGradient={false}
        ><Panel class="flex flex-col gap-2 px-6 py-4"
          ><Text class="w-[60%]" />
          <Text class="opacity-0" />
          <Text class="opacity-0" /></Panel
        ></Card
      >
    {:else if slug === "toast"}
      <div class="relative flex flex-1 justify-center">
        <Card class="absolute -top-6 scale-80"><Panel class="p-3" /></Card><Card
          class="absolute -top-3 scale-90"><Panel class="p-3" /></Card
        ><Card
          ><Panel class="flex items-start gap-2 p-3"
            ><Icon name="alert" />
            <div class="flex flex-1 flex-col gap-2">
              <Text class="w-[40%]" />
              <Text class="w-[70%]" variant="secondary" />
            </div></Panel
          ></Card
        >
      </div>
    {:else if slug === "toggle"}
      <div class="flex flex-1 flex-col items-center justify-center gap-2">
        <Card class="max-w-12 [--radius-2xl:14px]"
          ><Panel class="rounded-[inherit] p-4"><Text /></Panel></Card
        ><Card class="max-w-12 shadow-none [--radius-2xl:14px] before:hidden"
          ><Panel class="rounded-[inherit] bg-muted-foreground/8 p-4"
            ><Text class="bg-primary" /></Panel
          ></Card
        >
      </div>
    {:else if slug === "toggle-group"}
      <Card class="w-auto flex-row divide-x [--radius-2xl:14px]"
        ><Panel class="bg-clip-padding p-4"><Text class="w-4" /></Panel><Panel
          class="bg-muted-foreground/8 bg-clip-padding p-4"
          ><Text class="w-4 bg-foreground" /></Panel
        ><Panel class="bg-clip-padding p-4"><Text class="w-4" /></Panel></Card
      >
    {:else if slug === "toolbar"}
      <div class="flex items-center gap-1 rounded-xl border p-1">
        {#each [0, 1, 2] as _}
          <Card class="w-fit [--radius-2xl:12px]"
            ><Panel class="p-3.5"><Text class="w-4" /></Panel></Card
          >
        {/each}
      </div>
    {:else if slug === "tooltip"}
      <div class="flex max-w-32 flex-1 flex-col items-center gap-2">
        <Card class="[--radius-2xl:10px]"><Panel class="p-4"><Text /></Panel></Card><Icon
          name="info"
        />
      </div>
    {/if}
  </div>
{/if}
