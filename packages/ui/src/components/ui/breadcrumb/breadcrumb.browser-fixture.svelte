<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "./index.js";

  let clicks = $state(0);
  let linkRef = $state<HTMLElement | null>(null);
  let navRef = $state<HTMLElement | null>(null);
</script>

<Breadcrumb aria-label="Project path" bind:ref={navRef} data-testid="breadcrumb">
  <BreadcrumbList class="gap-4">
    <BreadcrumbItem>
      <BreadcrumbLink
        as="button"
        bind:ref={linkRef}
        data-testid="breadcrumb-link"
        onclick={() => (clicks += 1)}
        type="button">Home</BreadcrumbLink
      >
    </BreadcrumbItem>
    <BreadcrumbSeparator><span data-testid="custom-separator">/</span></BreadcrumbSeparator>
    <BreadcrumbItem><BreadcrumbEllipsis class="custom-ellipsis" /></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

<output data-testid="breadcrumb-state"
  >{clicks}:{navRef?.tagName ?? "missing"}:{linkRef?.tagName ?? "missing"}</output
>
