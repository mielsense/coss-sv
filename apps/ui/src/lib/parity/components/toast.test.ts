import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import ToastFixture from "./toast.svelte";

describe("Toast parity fixture", () => {
  test("renders every upstream particle and its exact visible controls", () => {
    const { body } = render(ToastFixture);

    expect(body.match(/data-particle="p-toast-/g)).toHaveLength(13);
    for (const label of [
      "Default Toast",
      "Success Toast",
      "Error Toast",
      "Info Toast",
      "Warning Toast",
      "Loading Toast",
      "Perform Action",
      "Run Promise",
      "With Varying Heights",
      "Download",
      "One Success Toast",
      "One Error Toast",
    ]) {
      expect(body).toContain(label);
    }
  });
});
