import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    expect: {
      requireAssertions: true,
    },
    include: ["tests/registry/**/*.test.ts"],
  },
});
