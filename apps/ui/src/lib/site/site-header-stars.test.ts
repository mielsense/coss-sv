import { render } from "svelte/server";
import { expect, test, vi } from "vitest";

vi.mock("$app/state", () => ({ page: { url: new URL("https://coss.miel.my/docs"), status: 200 } }));

import SiteHeader from "./SiteHeader.svelte";

test.each([2, 0, null])(
  "renders the actual repository count or hides unavailable data: %s",
  (repositoryStars) => {
    const { body } = render(SiteHeader, { props: { repositoryStars } });
    expect(body).toContain('href="https://github.com/mielsense/coss-sv"');
    if (repositoryStars === null) expect(body).not.toContain("data-repository-stars");
    else expect(body).toMatch(new RegExp(`data-repository-stars[^>]*>${repositoryStars}<`));
  },
);

test("formats a large count compactly while keeping the exact count in its title", () => {
  const { body } = render(SiteHeader, { props: { repositoryStars: 10600 } });
  expect(body).toContain('title="10600 stars on GitHub"');
  expect(body).toMatch(/data-repository-stars[^>]*>10.6k</);
});
