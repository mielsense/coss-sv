# Browser test resource policy

The root Playwright suite tests the Svelte production build only. It runs two browser workers and
starts one documentation server with a 768 MB Node heap limit. Keep those limits in
`playwright.config.ts`; they make local and CI runs predictable on large component inventories.

Reference comparison is a deliberate inspection task, not a global Playwright dependency. When a
review needs the pinned React site, run this launcher in its own terminal:

```bash
node scripts/parity/start-reference.mts
```

The launcher copies the reference to an isolated temporary workspace, uses Next's Webpack mode, and
stops its process group when the launcher or its parent exits. Do not add the reference server to the
root Playwright `webServer` list. Next's development bundler can otherwise create a large worker pool
while compiling the full reference documentation site.

After an interrupted browser run, confirm that no project preview or reference process remains
before starting another run. Generated traces, videos, screenshots, and reports belong under the
ignored `artifacts/` directory.
