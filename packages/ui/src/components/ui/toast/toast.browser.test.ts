import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import ToastFixture from "./toast.browser-fixture.svelte";
import { toastHydrationHtml } from "./toast.hydration-html.js";
import ToastSsrFixture from "./toast.ssr-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

function standardRoots(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-slot="toast-viewport"] > [role="dialog"]'),
  );
}

describe("Toast browser contract", () => {
  test("renders standard status, live-region, ARIA, icon, and exact presentation hooks", async () => {
    render(ToastFixture);
    await page.getByTestId("add-default").click();
    const root = standardRoots()[0];
    const viewport = document.querySelector<HTMLElement>('[data-slot="toast-viewport"]');

    expect(root).toBeTruthy();
    expect(root?.textContent).toContain("Event has been created");
    expect(root?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(root?.getAttribute("aria-describedby")).toBeTruthy();
    expect(root?.className).toContain("rounded-lg border");
    expect(root?.className).toContain("transition:transform_.5s");
    expect(viewport?.getAttribute("role")).toBe("region");
    expect(viewport?.getAttribute("aria-live")).toBe("polite");
    expect(viewport?.getAttribute("aria-atomic")).toBe("false");
    expect(viewport?.getAttribute("aria-relevant")).toBe("additions text");
    expect(viewport?.getAttribute("aria-label")).toBe("Notifications");
    expect(viewport?.className).toContain("max-w-90");
    expect(viewport?.className).toContain("sm:[--toast-inset:--spacing(8)]");
  });

  test("delegates actions and promise loading, success, and error updates", async () => {
    render(ToastFixture);
    await page.getByTestId("add-action").click();
    await page.getByRole("button", { name: "Undo" }).click();
    await expect.element(page.getByTestId("action-count")).toHaveTextContent("1");

    await page.getByTestId("start-promise").click();
    expect(standardRoots()[0]?.getAttribute("data-type")).toBe("loading");
    const loadingIcon = standardRoots()[0]?.querySelector<SVGElement>(
      '[data-slot="toast-icon"] svg',
    );
    expect(loadingIcon?.getAttribute("class")).toContain("in-data-[type=loading]:animate-spin");
    expect(loadingIcon?.querySelectorAll("path").length).toBeGreaterThan(0);
    await page.getByTestId("resolve").click();
    await expect.element(page.getByText("Saved", { exact: true })).toBeInTheDocument();
    expect(standardRoots()[0]?.getAttribute("data-type")).toBe("success");

    await page.getByTestId("start-promise").click();
    await page.getByTestId("reject").click();
    await expect.element(page.getByText("Failed", { exact: true })).toBeInTheDocument();
    expect(standardRoots()[0]?.getAttribute("data-type")).toBe("error");
  });

  test.each([
    ["success", "resolve-report", "Report generated", "success"],
    ["error", "reject-report", "Failed", "error"],
    ["cancel", "Cancel", "Cancelled", "info"],
  ])(
    "preserves the %s promise terminal type and clears its loading action",
    async (_, control, title, type) => {
      render(ToastFixture);
      await page.getByTestId("start-report").click();
      await expect.element(page.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

      if (control === "Cancel") await page.getByRole("button", { name: control }).click();
      else await page.getByTestId(control).click();

      await expect.element(page.getByText(title, { exact: true })).toBeInTheDocument();
      const root = standardRoots()[0];
      const icon = root?.querySelector<SVGElement>('[data-slot="toast-icon"] svg');
      expect(root?.getAttribute("data-type")).toBe(type);
      expect(icon?.querySelectorAll("path").length).toBeGreaterThan(0);
      if (type === "info") expect(icon?.getAttribute("class")).toContain("text-info");
      await expect.element(page.getByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
    },
  );

  test("announces high-priority toasts assertively without duplicating visible content", async () => {
    render(ToastFixture);
    await page.getByTestId("add-high").click();

    const root = document.querySelector<HTMLElement>(
      '[data-slot="toast-viewport"] > [role="alertdialog"]',
    );
    const alert = document.querySelector<HTMLElement>('[role="alert"][aria-atomic="true"]');
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(alert?.textContent).toContain("Payment failed");
    expect(alert?.parentElement?.style.position).toBe("fixed");
    expect(alert?.parentElement?.style.clipPath).toBe("inset(50%)");
  });

  test("forwards native attributes, styles, and events to the portal element", async () => {
    const onPortalClick = vi.fn();
    render(ToastFixture, { onPortalClick });
    const portal = document.querySelector<HTMLDivElement>("#toast-portal-probe");

    expect(portal?.classList.contains("custom-toast-portal")).toBe(true);
    expect(portal?.dataset.portal).toBe("custom");
    expect(portal?.getAttribute("aria-label")).toBe("Toast portal");
    expect(portal?.style.getPropertyValue("--portal-marker")).toBe("37");
    portal?.click();
    expect(onPortalClick).toHaveBeenCalledOnce();
  });

  test("delivers public standard and anchored portal refs and clears them on teardown", async () => {
    const standardNodes: Array<HTMLDivElement | null> = [];
    const anchoredRef: { current: HTMLDivElement | null } = { current: null };
    const cleanupStandardRef = vi.fn();
    const view = await render(ToastFixture, {
      anchoredPortalRef: anchoredRef,
      standardPortalRef(node) {
        standardNodes.push(node);
        if (node) return cleanupStandardRef;
      },
    });
    const standardPortal = document.querySelector<HTMLDivElement>("#toast-portal-probe");
    const anchoredPortal = document.querySelector<HTMLDivElement>("#anchored-toast-portal-probe");

    expect(standardNodes).toEqual([standardPortal]);
    expect(anchoredRef.current).toBe(anchoredPortal);

    await view.unmount();
    expect(cleanupStandardRef).toHaveBeenCalledOnce();
    expect(anchoredRef.current).toBeNull();
  });

  test("portals the viewport into an HTMLElement container", async () => {
    const portalTarget = document.createElement("section");
    portalTarget.dataset.testid = "portal-target";
    document.body.append(portalTarget);
    render(ToastFixture, { portalTarget });

    await page.getByTestId("add-default").click();
    expect(portalTarget.querySelector('[data-slot="toast-viewport"]')).not.toBeNull();
    expect(portalTarget.textContent).toContain("Event has been created");
  });

  test("portals the viewport into a ShadowRoot container", async () => {
    const shadowHost = document.createElement("div");
    const shadowRoot = shadowHost.attachShadow({ mode: "open" });
    document.body.append(shadowHost);
    render(ToastFixture, { portalTarget: shadowRoot });

    await page.getByTestId("add-default").click();
    expect(shadowRoot.querySelector("#toast-portal-probe")?.parentNode).toBe(shadowRoot);
    expect(shadowRoot.querySelector('[data-slot="toast-viewport"]')).not.toBeNull();
    expect(shadowRoot.textContent).toContain("Event has been created");
  });

  test("reacts to public standard and anchored container ref objects, including null fallback", async () => {
    render(ToastFixture, { useContainerRefs: true });
    const standardPortal = document.querySelector<HTMLDivElement>("#toast-portal-probe");
    const anchoredPortal = document.querySelector<HTMLDivElement>("#anchored-toast-portal-probe");
    const standardTarget = document.querySelector<HTMLDivElement>(
      '[data-testid="standard-container-ref-target"]',
    );
    const anchoredHost = document.querySelector<HTMLDivElement>(
      '[data-testid="anchored-container-ref-host"]',
    );

    expect(standardPortal?.parentNode).toBe(document.body);
    expect(anchoredPortal?.parentNode).toBe(document.body);

    await page.getByTestId("set-container-refs").click();
    await vi.waitFor(() => {
      expect(standardPortal?.parentNode).toBe(standardTarget);
      expect(anchoredPortal?.parentNode).toBe(anchoredHost?.shadowRoot);
    });

    await page.getByTestId("clear-container-refs").click();
    await vi.waitFor(() => {
      expect(standardPortal?.parentNode).toBe(document.body);
      expect(anchoredPortal?.parentNode).toBe(document.body);
    });
  });

  test("dismisses a toast after a genuine pointer swipe past the threshold", async () => {
    render(ToastFixture);
    await page.getByTestId("add-default").click();
    const root = standardRoots()[0] as HTMLElement;
    const bounds = root.getBoundingClientRect();

    root.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        clientX: bounds.left + 20,
        clientY: bounds.top + 20,
        pointerId: 1,
        pointerType: "touch",
      }),
    );
    root.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: bounds.left + 21,
        clientY: bounds.top + 20,
        pointerId: 1,
        pointerType: "touch",
      }),
    );
    root.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: bounds.left + 81,
        clientY: bounds.top + 20,
        pointerId: 1,
        pointerType: "touch",
      }),
    );
    await Promise.resolve();
    expect(root.getAttribute("data-swipe-direction")).toBe("right");
    expect(root.hasAttribute("data-swiping")).toBe(true);

    root.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        clientX: bounds.left + 81,
        clientY: bounds.top + 20,
        pointerId: 1,
        pointerType: "touch",
      }),
    );
    await Promise.resolve();
    expect(!root.isConnected || root.hasAttribute("data-ending-style")).toBe(true);
  });

  test("stacks, expands, limits, replays upserts, and dismisses all", async () => {
    render(ToastFixture);
    for (let index = 0; index < 4; index += 1) await page.getByTestId("add-default").click();
    expect(standardRoots()).toHaveLength(4);
    expect(standardRoots().filter((root) => root.hasAttribute("data-limited"))).toHaveLength(1);
    await userEvent.hover(standardRoots()[0] as HTMLElement);
    expect(standardRoots().every((root) => root.hasAttribute("data-expanded"))).toBe(true);

    await page.getByTestId("upsert-success").click();
    await page.getByTestId("upsert-success").click();
    expect(standardRoots()[0]?.className).toMatch(/animate-toast-success-(odd|even)/);
    await page.getByTestId("upsert-error").click();
    await page.getByTestId("upsert-error").click();
    expect(standardRoots()[0]?.className).toMatch(/animate-toast-error-(odd|even)/);

    await page.getByTestId("close-all").click();
    expect(standardRoots().every((root) => root.hasAttribute("data-ending-style"))).toBe(true);
  });

  test("supports F6, Tab, and Escape dismissal", async () => {
    render(ToastFixture);
    await page.getByTestId("add-action").click();
    await userEvent.keyboard("{F6}");
    expect(document.activeElement?.getAttribute("data-slot")).toBe("toast-viewport");
    await userEvent.keyboard("{Tab}");
    expect(document.activeElement).toBe(standardRoots()[0]);
    const focusedRoot = standardRoots()[0] as HTMLElement;
    await userEvent.keyboard("{Escape}");
    expect(!focusedRoot.isConnected || focusedRoot.hasAttribute("data-ending-style")).toBe(true);
  });

  test("pauses and resumes timeout dismissal while the stack is hovered", async () => {
    render(ToastFixture);
    const viewport = document.querySelector<HTMLElement>('[data-slot="toast-viewport"]');
    viewport?.dispatchEvent(new MouseEvent("mouseenter"));
    await page.getByTestId("add-timed").click();
    const title = page.getByText("Timed", { exact: true });
    await expect.element(title).toBeInTheDocument();
    const root = standardRoots()[0] as HTMLElement;
    await new Promise((resolve) => setTimeout(resolve, 120));
    expect(root.hasAttribute("data-ending-style")).toBe(false);
    viewport?.dispatchEvent(new MouseEvent("mouseleave"));
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(!root.isConnected || root.hasAttribute("data-ending-style")).toBe(true);
  });

  test("positions anchored normal and tooltip toasts without swipe", async () => {
    render(ToastFixture);
    await page.getByTestId("add-anchored").click();
    let popup = document.querySelector<HTMLElement>('[data-slot="toast-popup"]');
    let positioner = document.querySelector<HTMLElement>('[data-slot="toast-positioner"]');
    expect(popup?.textContent).toContain("Anchored");
    expect(popup?.className).toContain("rounded-lg");
    expect(positioner?.className).toContain("max-w-[min(--spacing(64),var(--available-width))]");
    expect(popup?.hasAttribute("data-swiping")).toBe(false);

    await page.getByTestId("add-tooltip").click();
    popup =
      Array.from(document.querySelectorAll<HTMLElement>('[data-slot="toast-popup"]')).find(
        (element) => element.textContent?.includes("Copied!"),
      ) ?? null;
    positioner = popup?.parentElement ?? null;
    expect(popup?.className).toContain("rounded-md");
    expect(popup?.textContent).toBe("Copied!");
    expect(positioner?.getAttribute("data-side")).toBe("top");
  });

  test("hydrates the empty provider and cleans its portal without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = toastHydrationHtml;
    document.body.append(target);
    const component = hydrate(ToastSsrFixture, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(document.querySelector('[data-slot="toast-viewport"]')).not.toBeNull();
    await unmount(component);
    expect(document.querySelector('[data-slot="toast-viewport"]')).toBeNull();
    warning.mockRestore();
  });
});
