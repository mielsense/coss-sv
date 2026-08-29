<script lang="ts">
  import { Button, Spinner } from "@coss-sv/ui";
  import FixtureIcon from "./fixture-icon.svelte";

  let isLoading = $state(false);

  function startLoading() {
    isLoading = true;
    window.setTimeout(() => {
      isLoading = false;
    }, 1000);
  }
</script>

<div data-particle="p-button-1"><Button>Button</Button></div>
<div data-particle="p-button-2"><Button variant="outline">Outline</Button></div>
<div data-particle="p-button-3"><Button variant="secondary">Secondary</Button></div>
<div data-particle="p-button-4"><Button variant="destructive">Delete</Button></div>
<div data-particle="p-button-5"><Button variant="destructive-outline">Delete</Button></div>
<div data-particle="p-button-6"><Button variant="ghost">Ghost</Button></div>
<div data-particle="p-button-7"><Button variant="link">Link</Button></div>
<div data-particle="p-button-8"><Button size="xs">Button</Button></div>
<div data-particle="p-button-9"><Button size="sm">Button</Button></div>
<div data-particle="p-button-10"><Button size="lg">Button</Button></div>
<div data-particle="p-button-11"><Button size="xl">Button</Button></div>
<div data-particle="p-button-12"><Button disabled>Button</Button></div>
<div data-particle="p-button-13">
  <Button aria-label="Add" size="icon">
    <FixtureIcon aria-hidden="true" name="plus" />
  </Button>
</div>
<div data-particle="p-button-14">
  <Button aria-label="Add" size="icon-sm">
    <FixtureIcon aria-hidden="true" name="plus" />
  </Button>
</div>
<div data-particle="p-button-15">
  <Button aria-label="Add" size="icon-lg">
    <FixtureIcon aria-hidden="true" name="plus" />
  </Button>
</div>
<div data-particle="p-button-16">
  <Button>
    <FixtureIcon aria-hidden="true" name="download" />
    Download
  </Button>
</div>
<div data-particle="p-button-17"><Button href="/">Link</Button></div>
<div data-particle="p-button-18">
  <Button disabled>
    <Spinner />
    Loading...
  </Button>
</div>
<div data-particle="p-button-41">
  <Button loading={isLoading} onclick={startLoading}>Submit</Button>
</div>

<div data-review-probes="button">
  <Button as="div" data-testid="button-polymorphic">Polymorphic action</Button>
</div>
