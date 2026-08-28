<script lang="ts">
import * as Sidebar from "./index.js";
import SidebarContextProbe from "./sidebar-context-probe.svelte";

let open = $state(true);
let changes = $state<boolean[]>([]);
let lockedOpen = $state(true);
let lockedAttempts = $state(0);
let triggerRef = $state<HTMLElement | null>(null);
</script>

<Sidebar.Provider bind:open onOpenChange={(next) => changes.push(next)}>
  <SidebarContextProbe />
  <Sidebar.Root data-testid="primary-sidebar" collapsible="icon">
    <Sidebar.Header>
      <Sidebar.Input aria-label="Search navigation" />
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton bind:ref={triggerRef} tooltip="Dashboard">
                Dashboard
              </Sidebar.MenuButton>
              <Sidebar.MenuAction aria-label="Open dashboard menu" showOnHover
                >...</Sidebar.MenuAction
              >
              <Sidebar.MenuBadge>7</Sidebar.MenuBadge>
              <Sidebar.MenuSub>
                <Sidebar.MenuSubItem>
                  <Sidebar.MenuSubButton href="/reports">Reports</Sidebar.MenuSubButton>
                </Sidebar.MenuSubItem>
              </Sidebar.MenuSub>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Rail data-testid="rail" />
  </Sidebar.Root>
  <Sidebar.Inset>
    <Sidebar.Trigger data-testid="trigger" />
    <button data-testid="after-trigger" type="button">After trigger</button>
  </Sidebar.Inset>
  <output data-testid="bound-open">{open}</output>
  <output data-testid="changes">{changes.join(",")}</output>
  <output data-testid="trigger-ref">{triggerRef?.tagName ?? "missing"}</output>
</Sidebar.Provider>

<Sidebar.Provider
  bind:open={() => lockedOpen, () => (lockedAttempts += 1)}
  onOpenChange={() => undefined}
>
  <Sidebar.Root data-testid="locked-sidebar" />
  <Sidebar.Trigger data-testid="locked-trigger" />
  <output data-testid="locked-attempts">{lockedAttempts}</output>
</Sidebar.Provider>
