import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Progress from "./index.js";

describe("Progress SSR contract", () => {
  test("renders the exact determinate default contract", () => {
    const { body } = render(Progress.Root, {
      props: { "aria-label": "Upload", value: 20 },
    });

    expect(body).toContain('role="progressbar"');
    expect(body).toContain('data-progressing=""');
    expect(body).toContain('data-slot="progress"');
    expect(body).toContain('data-slot="progress-track"');
    expect(body).toContain('data-slot="progress-indicator"');
    expect(body).toContain("width:20%");
  });

  test("keeps an indeterminate progress free of a numeric value and width", () => {
    const { body } = render(Progress.Root, {
      props: { "aria-label": "Upload", value: null },
    });

    expect(body).toContain('data-indeterminate=""');
    expect(body).not.toContain("aria-valuenow");
    expect(body).not.toMatch(/data-slot="progress-indicator"[^>]*style=/);
  });

  test("exports the wrapped namespace and Shards namespace", () => {
    expect(Progress.Root).toBeTypeOf("function");
    expect(Progress.Value).toBeTypeOf("function");
    expect(Progress.ProgressPrimitive.Root).toBeTypeOf("function");
  });
});
