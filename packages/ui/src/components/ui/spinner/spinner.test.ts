import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { expect, test } from "vitest";
import Spinner from "./spinner.svelte";

test("renders the Hugeicons loading shell and public status contract", () => {
  const { body } = render(Spinner, { props: { class: "custom-spinner" } });

  expect(body).toContain("<svg");
  expect(body).toContain('xmlns="http://www.w3.org/2000/svg"');
  expect(body).toContain('width="24"');
  expect(body).toContain('height="24"');
  expect(body).toContain('viewBox="0 0 24 24"');
  expect(body).toContain('class="animate-spin custom-spinner"');
  expect(body).toContain('aria-label="Loading"');
  expect(body).toContain('role="status"');
  expect(body).toContain("<path");
});

test("preserves native SVG precedence, explicit dimensions, and appended children", () => {
  const children = createRawSnippet(() => ({
    render: () => '<circle data-testid="consumer-child" cx="12" cy="12" r="2"></circle>',
  }));
  const { body } = render(Spinner, {
    props: {
      absoluteStrokeWidth: true,
      children,
      fill: "gold",
      height: 18,
      size: 48,
      stroke: "purple",
      "stroke-linecap": "square",
      "stroke-linejoin": "bevel",
      "stroke-width": 5,
      strokeWidth: 4,
      width: 16,
    },
  });

  expect(body).toContain('width="16"');
  expect(body).toContain('height="18"');
  expect(body).toContain('fill="gold"');
  expect(body).toContain('stroke="purple"');
  expect(body).toContain('stroke-linecap="square"');
  expect(body).toContain('stroke-linejoin="bevel"');
  expect(body).toContain('stroke-width="2.5"');
  expect(body.indexOf("<path")).toBeLessThan(body.indexOf('data-testid="consumer-child"'));
});
