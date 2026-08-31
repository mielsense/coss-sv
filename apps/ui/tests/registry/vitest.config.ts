import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    expect: {
      requireAssertions: true,
    },
    fileParallelism: false,
    include: ["tests/registry/**/*.test.ts"],
    maxWorkers: 1,
    testTimeout: 30_000,
  },
});
