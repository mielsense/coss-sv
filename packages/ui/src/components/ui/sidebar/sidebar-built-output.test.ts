import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, expect, test } from "vitest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const sidebarRoot = join(packageRoot, "dist/components/ui/sidebar");
const svelteCheck = join(packageRoot, "node_modules/.bin/svelte-check");
let consumerRoot: string | undefined;

afterAll(() => {
  if (consumerRoot) rmSync(consumerRoot, { force: true, recursive: true });
});

test("emits the complete Sidebar declaration surface", () => {
  const declaration = join(sidebarRoot, "sidebar-separator.svelte.d.ts");
  expect(existsSync(declaration)).toBe(true);
  expect(readFileSync(declaration, "utf8")).toContain("export type SidebarSeparatorProps");
  expect(readFileSync(join(sidebarRoot, "index.d.ts"), "utf8")).toContain("SidebarSeparatorProps");
});

test("type-checks built polymorphic Sidebar parts from a strict Svelte consumer", () => {
  consumerRoot = mkdtempSync(join(tmpdir(), "coss-sidebar-consumer-"));
  symlinkSync(join(packageRoot, "node_modules"), join(consumerRoot, "node_modules"), "dir");
  writeFileSync(
    join(consumerRoot, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        allowJs: true,
        checkJs: true,
        isolatedModules: true,
        module: "esnext",
        moduleResolution: "bundler",
        skipLibCheck: true,
        strict: true,
        target: "es2022",
        verbatimModuleSyntax: true,
      },
      include: ["App.svelte"],
    }),
  );
  writeFileSync(
    join(consumerRoot, "App.svelte"),
    `<script lang="ts">
import * as Sidebar from ${JSON.stringify(join(sidebarRoot, "index.js"))};
let separatorProps: Sidebar.SidebarSeparatorProps = { orientation: "horizontal" };
</script>
<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Separator {...separatorProps} />
    <Sidebar.Group>
      <Sidebar.GroupLabel as="label" for="sidebar-search">Navigation</Sidebar.GroupLabel>
      <Sidebar.GroupAction as="a" href="/new" target="_blank" rel="noreferrer" download>Add</Sidebar.GroupAction>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton as="a" href="/dashboard" target="_blank" rel="noreferrer" download>Dashboard</Sidebar.MenuButton>
          <Sidebar.MenuAction as="a" href="/more" target="_blank" rel="noreferrer" download>More</Sidebar.MenuAction>
          <Sidebar.MenuSub>
            <Sidebar.MenuSubItem>
              <Sidebar.MenuSubButton href="/reports" target="_blank" rel="noreferrer" download>Reports</Sidebar.MenuSubButton>
            </Sidebar.MenuSubItem>
          </Sidebar.MenuSub>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  </Sidebar.Root>
</Sidebar.Provider>
`,
  );

  const workspace = consumerRoot;
  expect(() =>
    execFileSync(svelteCheck, ["--workspace", workspace, "--tsconfig", "tsconfig.json"], {
      cwd: workspace,
      stdio: "pipe",
    }),
  ).not.toThrow();
});
