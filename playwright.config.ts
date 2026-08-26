import { defineConfig, devices } from "@playwright/test";

export const referenceBaseUrl = "http://127.0.0.1:4000/ui";
export const targetBaseUrl = "http://127.0.0.1:4173";

// biome-ignore lint/suspicious/noUndeclaredEnvVars: this optional command is an explicit local/CI harness input.
const referenceCommand = process.env.COSS_REFERENCE_COMMAND?.trim();
const webServer = [
  ...(referenceCommand
    ? [
        {
          command: referenceCommand,
          url: referenceBaseUrl,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      ]
    : []),
  {
    command:
      "pnpm --filter @coss-sv/ui build && pnpm --filter @coss-sv/docs build && pnpm --filter @coss-sv/docs preview --host 127.0.0.1 --port 4173",
    url: `${targetBaseUrl}/preview/_health`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
];

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./artifacts/playwright/results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
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
