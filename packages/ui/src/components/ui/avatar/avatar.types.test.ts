import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarRootProps,
  ImageLoadingStatus,
} from "./index.js";

test("types Avatar polymorphism, image callbacks, fallback delay, snippets, and refs", () => {
  const children = createRawSnippet(() => ({ render: () => "LT" }));
  const root = { as: "div", children, ref: null } satisfies AvatarRootProps;
  const image = {
    alt: "Profile",
    onLoadingStatusChange: (status) => status,
    ref: null,
    src: "/avatar.png",
    srcset: "/avatar@2x.png 2x",
  } satisfies AvatarImageProps;
  const fallback = { children, delay: 100, ref: null } satisfies AvatarFallbackProps;
  const status: ImageLoadingStatus = "loading";
  expect(root.as).toBe("div");
  expect(image.alt).toBe("Profile");
  expect(fallback.delay).toBe(100);
  expect(status).toBe("loading");
});
