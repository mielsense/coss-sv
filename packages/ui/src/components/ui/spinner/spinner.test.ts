import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { expect, test } from "vitest";
import Spinner from "./spinner.svelte";

test("renders the exact Lucide loader contract", () => {
  const { body } = render(Spinner, { props: { class: "custom-spinner" } });

  expect(body).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
  expect(body).toContain('width="24"');
  expect(body).toContain('height="24"');
  expect(body).toContain('viewBox="0 0 24 24"');
  expect(body).toContain('class="lucide lucide-loader-circle animate-spin custom-spinner"');
  expect(body).toContain('aria-label="Loading"');
  expect(body).toContain('role="status"');
  expect(body).toContain('d="M21 12a9 9 0 1 1-6.219-8.56"');
});

test("preserves Lucide size, absolute stroke width, explicit dimensions, and appended children", () => {
  const children = createRawSnippet(() => ({
    render: () => '<circle data-testid="consumer-child" cx="12" cy="12" r="2"></circle>',
  }));
  const { body } = render(Spinner, {
    props: {
      absoluteStrokeWidth: true,
      children,
      height: 18,
      size: 48,
      strokeWidth: 4,
      width: 16,
    },
  });

  expect(body).toContain('width="16"');
  expect(body).toContain('height="18"');
  expect(body).toContain('stroke-width="2"');
  expect(body.indexOf('d="M21 12a9 9 0 1 1-6.219-8.56"')).toBeLessThan(
    body.indexOf('data-testid="consumer-child"'),
  );
});
