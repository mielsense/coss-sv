<script lang="ts">
import * as Sidebar from "./index.js";
import SidebarContextProbe from "./sidebar-context-probe.svelte";
</script>

<Sidebar.Provider class="consumer-provider" data-consumer="provider" defaultOpen={false}>
  <SidebarContextProbe />
  <Sidebar.Root class="consumer-sidebar" collapsible="icon" side="right" variant="floating">
    <Sidebar.Header>Workspace</Sidebar.Header>
    <Sidebar.Input aria-label="Filter navigation" id="sidebar-filter" placeholder="Filter" />
    <Sidebar.Separator />
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel as="label" for="sidebar-filter">Navigation</Sidebar.GroupLabel>
        <Sidebar.GroupAction
          aria-label="Add item"
          as="a"
          download="new.txt"
          href="/new"
          rel="noreferrer"
          target="_blank"
          >+</Sidebar.GroupAction
        >
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                as="a"
                download="dashboard.txt"
                href="/dashboard"
                isActive
                rel="noreferrer"
                target="_blank"
                tooltip="Dashboard"
              >
                <span>Dashboard</span>
              </Sidebar.MenuButton>
              <Sidebar.MenuAction
                aria-label="More actions"
                as="a"
                download="more.txt"
                href="/more"
                rel="noreferrer"
                showOnHover
                target="_blank"
                >...</Sidebar.MenuAction
              >
              <Sidebar.MenuBadge>12</Sidebar.MenuBadge>
              <Sidebar.MenuSub>
                <Sidebar.MenuSubItem>
                  <Sidebar.MenuSubButton
                    download="reports.txt"
                    href="/reports"
                    rel="noreferrer"
                    target="_blank"
                    >Reports</Sidebar.MenuSubButton
                  >
                </Sidebar.MenuSubItem>
              </Sidebar.MenuSub>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton disabled size="lg" variant="outline">Disabled</Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem><Sidebar.MenuSkeleton showIcon /></Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>Account</Sidebar.Footer>
    <Sidebar.Rail />
  </Sidebar.Root>
  <Sidebar.Inset>Main content</Sidebar.Inset>
  <Sidebar.Trigger />
</Sidebar.Provider>
