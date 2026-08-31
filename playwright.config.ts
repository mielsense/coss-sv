import { delimiter, dirname } from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { targetPreviewBaseUrl, targetPreviewPort } from "./tests/e2e/helpers/ports.ts";

export const targetBaseUrl = targetPreviewBaseUrl(targetPreviewPort);

const inheritedEnvironment = { ...process.env };
delete inheritedEnvironment.NO_COLOR;

function withHeapLimit(value: string | undefined, megabytes: number): string {
  return [
    ...(value?.split(/\s+/).filter((option) => !option.startsWith("--max-old-space-size=")) ?? []),
    `--max-old-space-size=${megabytes}`,
  ].join(" ");
}

const commonWebServerEnvironment = {
  ...inheritedEnvironment,
  PATH: [dirname(process.execPath), inheritedEnvironment.PATH].filter(Boolean).join(delimiter),
};
const targetWebServerEnvironment = {
  ...commonWebServerEnvironment,
  NODE_OPTIONS: withHeapLimit(inheritedEnvironment.NODE_OPTIONS, 768),
};
const webServer = [
  {
    command: `pnpm --filter @coss-sv/ui build && pnpm --filter @coss-sv/docs build && pnpm --filter @coss-sv/docs preview --host 127.0.0.1 --port ${targetPreviewPort}`,
    env: targetWebServerEnvironment,
    url: `${targetBaseUrl}/preview/_health`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
];

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./artifacts/playwright/results",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never", outputFolder: "artifacts/playwright/report" }]],
  timeout: 45_000,
  expect: {
    timeout: 8_000,
    toHaveScreenshot: {
      animations: "disabled",
    },
  },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: targetBaseUrl,
    locale: "en-US",
    timezoneId: "UTC",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    serviceWorkers: "block",
  },
  projects: [
    {
      name: "light",
      use: {
        colorScheme: "light",
        reducedMotion: "reduce",
      },
    },
    {
      name: "dark",
      use: {
        colorScheme: "dark",
        reducedMotion: "reduce",
      },
    },
    {
      name: "motion",
      use: {
        colorScheme: "light",
        reducedMotion: "no-preference",
      },
    },
  ],
  webServer,
});
