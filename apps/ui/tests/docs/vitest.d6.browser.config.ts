import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import baseConfig from "../../vite.config.js";

const { environment: _environment, include: _include, ...baseTest } = baseConfig.test ?? {};

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseTest,
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
      provider: playwright(),
      screenshotFailures: false,
    },
    expect: { requireAssertions: true },
    include: ["tests/docs/d6-form-inputs.browser.spec.ts"],
  },
});
