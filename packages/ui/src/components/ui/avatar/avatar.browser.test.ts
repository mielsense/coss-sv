import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import AvatarFixture from "./avatar.browser-fixture.svelte";
import AvatarHydrationFixture from "./avatar.hydration-fixture.svelte";

type MockProbeImage = {
  complete: boolean;
  naturalWidth: number;
  onerror: (() => void) | null;
  onload: (() => void) | null;
  crossOrigin: string | null;
  referrerPolicy: string;
  sizes: string;
  src: string;
  srcset: string;
};

function mockImageProbe() {
  const OriginalImage = window.Image;
  const images: MockProbeImage[] = [];

  window.Image = function MockImage() {
    let src = "";
    const image: MockProbeImage = {
      complete: false,
      crossOrigin: null,
      naturalWidth: 0,
      onerror: null,
      onload: null,
      referrerPolicy: "",
      sizes: "",
      get src() {
        return src;
      },
      set src(value: string) {
        src = value;
      },
      srcset: "",
    };
    images.push(image);
    return image;
  } as unknown as typeof window.Image;

  return {
    images,
    restore: () => {
      window.Image = OriginalImage;
    },
  };
}

afterEach(() => (document.body.innerHTML = ""));

describe("Avatar browser contract", () => {
  test("handles image success, image error, fallback delay, callbacks, and refs", async () => {
    render(AvatarFixture);
    await expect.element(page.getByTestId("loaded-image")).toBeVisible();
    await expect.element(page.getByTestId("loaded-fallback")).not.toBeInTheDocument();
    await expect.element(page.getByTestId("error-fallback")).toBeVisible();
    await expect.element(page.getByTestId("delayed-fallback")).not.toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 120));
    await expect.element(page.getByTestId("delayed-fallback")).toBeVisible();
    await expect
      .element(page.getByTestId("avatar-state"))
      .toHaveTextContent("loading,loaded:SPAN:IMG:missing");
  });

  test("hydrates the real fallback tree, then swaps on deterministic image success and error", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const imageMock = mockImageProbe();
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--[--><!--[--><!----><span data-slot="avatar" class="inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-background align-middle font-medium text-xs" data-testid="hydration-avatar"><!--[--><!--[--><!--[-1--><!--]--><!--]--><!--]--> <!--[--><!--[--><!--[0--><!----><span data-slot="avatar-fallback" class="flex size-full items-center justify-center rounded-full bg-muted" data-testid="hydration-avatar-fallback"><!---->HY<!----><!----></span><!----><!--]--><!--]--><!--]--><!----><!----></span><!----><!--]--><!--]--> <button type="button" data-testid="hydrate-avatar-error">Load broken avatar</button><!--]-->';
    document.body.append(target);
    const component = hydrate(AvatarHydrationFixture, { target });

    try {
      expect(warning).not.toHaveBeenCalled();
      await expect.element(page.getByTestId("hydration-avatar-fallback")).toBeVisible();
      await expect.element(page.getByTestId("hydration-avatar-image")).not.toBeInTheDocument();
      await vi.waitFor(() => expect(imageMock.images).toHaveLength(1));

      const successProbe = imageMock.images[0];
      if (!successProbe) throw new Error("Avatar success probe was not created.");
      successProbe.complete = true;
      successProbe.naturalWidth = 100;
      successProbe.onload?.();
      await expect.element(page.getByTestId("hydration-avatar-image")).toBeVisible();
      await expect.element(page.getByTestId("hydration-avatar-fallback")).not.toBeInTheDocument();

      await page.getByTestId("hydrate-avatar-error").click();
      await vi.waitFor(() => expect(imageMock.images).toHaveLength(2));
      await expect.element(page.getByTestId("hydration-avatar-fallback")).toBeVisible();
      const errorProbe = imageMock.images[1];
      if (!errorProbe) throw new Error("Avatar error probe was not created.");
      errorProbe.onerror?.();
      await expect.element(page.getByTestId("hydration-avatar-fallback")).toBeVisible();
      await expect.element(page.getByTestId("hydration-avatar-image")).not.toBeInTheDocument();
      expect(warning).not.toHaveBeenCalled();
    } finally {
      await unmount(component);
      imageMock.restore();
      warning.mockRestore();
    }
  });
});
