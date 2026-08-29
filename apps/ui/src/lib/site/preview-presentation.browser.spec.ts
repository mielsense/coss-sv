import { mount, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import PreviewPresentationFixture from "./preview-presentation.browser-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.classList.remove("dark", "light");
  vi.restoreAllMocks();
});

describe("preview presentation", () => {
  test("keeps the viewport control and iframe URL in deterministic sync", async () => {
    const view = mount(PreviewPresentationFixture, { target: document.body });
    const frame = page.getByTitle("Button preview");

    await expect
      .element(page.getByRole("button", { name: "Desktop preview" }))
      .toHaveAttribute("aria-pressed", "true");
    await expect
      .element(frame)
      .toHaveAttribute(
        "src",
        "/preview/p-button-1?theme=light&width=desktop&reducedMotion=no-preference&timers=real",
      );
    await expect.element(frame).toHaveAttribute("data-preview-width", "desktop");

    const mobile = page.getByRole("button", { name: "Mobile preview" });
    mobile.element().focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(mobile).toHaveAttribute("aria-pressed", "true");
    await expect
      .element(frame)
      .toHaveAttribute(
        "src",
        "/preview/p-button-1?theme=light&width=mobile&reducedMotion=no-preference&timers=real",
      );
    await expect.element(frame).toHaveStyle({ width: "390px" });

    await page.getByRole("button", { name: "Tablet preview" }).click();
    await expect.element(frame).toHaveAttribute("data-preview-width", "tablet");
    await expect.element(frame).toHaveStyle({ width: "768px" });
    await unmount(view);
  });

  test("enters and exits native fullscreen while exposing the current state", async () => {
    const view = mount(PreviewPresentationFixture, { target: document.body });
    const presentation = document.querySelector<HTMLElement>("[data-preview-presentation]");
    let fullscreenElement: Element | null = null;
    vi.spyOn(document, "fullscreenElement", "get").mockImplementation(() => fullscreenElement);
    vi.spyOn(document, "exitFullscreen").mockImplementation(async () => {
      fullscreenElement = null;
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    vi.spyOn(presentation as HTMLElement, "requestFullscreen").mockImplementation(async () => {
      fullscreenElement = presentation;
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    const enter = page.getByRole("button", { name: "View fullscreen" });
    enter.element().focus();
    await userEvent.keyboard("{Enter}");
    await expect
      .element(page.getByRole("button", { name: "Exit fullscreen" }))
      .toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Exit fullscreen" }).click();
    await expect
      .element(page.getByRole("button", { name: "View fullscreen" }))
      .toHaveAttribute("aria-pressed", "false");
    await unmount(view);
  });

  test("inherits live site theme changes while preserving an explicit theme", async () => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    const inherited = mount(PreviewPresentationFixture, { target: document.body });
    const inheritedFrame = page.getByTitle("Button preview");

    await expect
      .element(inheritedFrame)
      .toHaveAttribute(
        "src",
        "/preview/p-button-1?theme=dark&width=desktop&reducedMotion=no-preference&timers=real",
      );

    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.dispatchEvent(new Event("coss-sv:themechange"));
    await expect
      .element(inheritedFrame)
      .toHaveAttribute(
        "src",
        "/preview/p-button-1?theme=light&width=desktop&reducedMotion=no-preference&timers=real",
      );
    await unmount(inherited);

    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    const explicit = mount(PreviewPresentationFixture, {
      target: document.body,
      props: { theme: "light" },
    });
    await expect
      .element(page.getByTitle("Button preview"))
      .toHaveAttribute(
        "src",
        "/preview/p-button-1?theme=light&width=desktop&reducedMotion=no-preference&timers=real",
      );
    await unmount(explicit);
  });

  test("shows a visible selected viewport state", async () => {
    const view = mount(PreviewPresentationFixture, { target: document.body });
    const selected = page.getByRole("button", { name: "Desktop preview" });
    const background = getComputedStyle(selected.element()).backgroundColor;

    expect(background).not.toBe("rgba(0, 0, 0, 0)");
    expect(background).not.toBe("transparent");
    await unmount(view);
  });
});
