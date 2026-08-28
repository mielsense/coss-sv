import { render } from "svelte/server";
import { expect, test } from "vitest";
import Spinner from "./spinner.svelte";

test("renders the Hugeicons loading shell and public status contract", () => {
  const { body } = render(Spinner, { props: { class: "custom-spinner" } });

  expect(body).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
  expect(body).toContain('width="24"');
  expect(body).toContain('height="24"');
  expect(body).toContain('viewBox="0 0 24 24"');
  expect(body).toContain('class="animate-spin custom-spinner"');
  expect(body).toContain('aria-label="Loading"');
  expect(body).toContain('role="status"');
  expect(body).not.toContain("<path");
});

test("preserves size, absolute stroke width, and explicit dimensions", () => {
  const { body } = render(Spinner, {
    props: {
      absoluteStrokeWidth: true,
      height: 18,
      size: 48,
      strokeWidth: 4,
      width: 16,
    },
  });

  expect(body).toContain('width="16"');
  expect(body).toContain('height="18"');
  expect(body).not.toContain("<path");
});
