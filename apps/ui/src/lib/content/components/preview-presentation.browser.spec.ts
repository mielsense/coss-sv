import { mount, tick, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import PreviewPresentation from "./PreviewPresentation.svelte";

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("documentation preview presentation", () => {
  test("tracks the theme in the attachment node's document realm", async () => {
    const frame = document.createElement("iframe");
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    expect(frameDocument).not.toBeNull();

    class WrongRealmMutationObserver {
      constructor() {
        throw new Error("used the host document MutationObserver");
      }
    }

    vi.stubGlobal("MutationObserver", WrongRealmMutationObserver);

    const view = mount(PreviewPresentation, {
      target: frameDocument?.body as HTMLElement,
      props: { name: "p-button-1", title: "Button" },
    });
    const preview = frameDocument?.querySelector<HTMLIFrameElement>("iframe");

    expect(preview?.getAttribute("src")).toContain("theme=light");
    expect(preview?.getAttribute("src")).toContain("reducedMotion=no-preference");
    frameDocument?.documentElement.classList.add("dark");
    await tick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(preview?.getAttribute("src")).toContain("theme=dark");

    await unmount(view);
  });
});
