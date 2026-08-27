<script lang="ts">
import { Button, Spinner } from "@coss-sv/ui";

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
    <svg
      aria-hidden="true"
      class="lucide lucide-plus"
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  </Button>
</div>
<div data-particle="p-button-14">
  <Button aria-label="Add" size="icon-sm">
    <svg
      aria-hidden="true"
      class="lucide lucide-plus"
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  </Button>
</div>
<div data-particle="p-button-15">
  <Button aria-label="Add" size="icon-lg">
    <svg
      aria-hidden="true"
      class="lucide lucide-plus"
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  </Button>
</div>
<div data-particle="p-button-16">
  <Button>
    <svg
      aria-hidden="true"
      class="lucide lucide-download"
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
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
