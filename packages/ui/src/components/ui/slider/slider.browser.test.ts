import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { commands, page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import SliderFixture from "./slider.browser-fixture.svelte";
import SliderRoot from "./slider-root.svelte";

declare module "vitest/browser" {
  interface BrowserCommands {
    renderSlider(value: number | readonly number[]): Promise<string>;
  }
}

afterEach(() => {
  document.body.innerHTML = "";
});

function inputFor(testId: string, index = 0): HTMLInputElement {
  const root = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  const input = root?.querySelectorAll<HTMLInputElement>('input[type="range"]')[index];
  if (!input) throw new Error(`Missing range input ${index} for ${testId}`);
  return input;
}

describe("Slider browser contract", () => {
  test("keeps bound and default values reactive while forwarding state and refs", async () => {
    render(SliderFixture);

    await expect.element(page.getByTestId("bound-output")).toHaveTextContent("20");
    await expect.element(page.getByTestId("bound-state")).toHaveTextContent("20");
    await expect.element(page.getByTestId("root-ref")).toHaveTextContent("DIV");
    await page.getByRole("button", { name: "Set parent" }).click();
    await expect.element(page.getByTestId("bound-output")).toHaveTextContent("64");
    await expect.element(page.getByTestId("bound-state")).toHaveTextContent("64");

    const defaultInput = inputFor("default-root");
    defaultInput.value = "45";
    defaultInput.dispatchEvent(new Event("input", { bubbles: true }));
    await expect.element(page.getByTestId("default-output")).toHaveTextContent("45");
    await expect.element(page.getByTestId("default-root")).toHaveClass("consumer-class");

    await expect.element(page.getByTestId("min-output")).toHaveTextContent("10");
    await page.getByRole("button", { name: "Change minimum" }).click();
    await expect.element(page.getByTestId("min-output")).toHaveTextContent("35");
  });

  test("respects a rejecting function-binding setter", async () => {
    render(SliderFixture);
    const input = inputFor("rejected-root");

    input.value = "40";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await expect.element(page.getByTestId("attempted-state")).toHaveTextContent("40");
    await expect.element(page.getByTestId("accepted-state")).toHaveTextContent("40");
    await expect.element(page.getByTestId("rejected-output")).toHaveTextContent("40");

    input.value = "80";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await expect.element(page.getByTestId("attempted-state")).toHaveTextContent("80");
    await expect.element(page.getByTestId("accepted-state")).toHaveTextContent("40");
    await expect.element(page.getByTestId("rejected-output")).toHaveTextContent("40");
    expect(input.value).toBe("40");
  });

  test("supports arrow, large-step, Home, End, vertical, and horizontal RTL keys", async () => {
    render(SliderFixture);
    const boundInput = inputFor("bound-root");
    boundInput.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByTestId("bound-state")).toHaveTextContent("22");
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
    await expect.element(page.getByTestId("bound-state")).toHaveTextContent("32");
    await userEvent.keyboard("{End}");
    await expect.element(page.getByTestId("bound-state")).toHaveTextContent("100");
    await userEvent.keyboard("{Home}");
    await expect.element(page.getByTestId("bound-state")).toHaveTextContent("0");

    const verticalInput = inputFor("vertical-root");
    verticalInput.focus();
    verticalInput.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowUp" }));
    await expect.element(page.getByTestId("vertical-state")).toHaveTextContent("41");
    verticalInput.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }));
    await expect.element(page.getByTestId("vertical-state")).toHaveTextContent("40");

    const rtlInput = inputFor("rtl-root");
    rtlInput.focus();
    rtlInput.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }));
    await expect.element(page.getByTestId("rtl-state")).toHaveTextContent("21");
    rtlInput.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    await expect.element(page.getByTestId("rtl-state")).toHaveTextContent("20");
  });

  test("preserves range spacing, native form values, disabled state, and ARIA", async () => {
    render(SliderFixture);
    const rangeStart = inputFor("range-root", 0);
    const rangeEnd = inputFor("range-root", 1);
    expect(rangeStart.getAttribute("aria-valuenow")).toBe("20");
    expect(rangeEnd.getAttribute("aria-valuenow")).toBe("80");
    expect(rangeStart.getAttribute("aria-valuetext")).toContain("start range");
    expect(rangeEnd.getAttribute("aria-valuetext")).toContain("end range");
    rangeStart.focus();
    await userEvent.keyboard("{End}");
    await expect.element(page.getByTestId("range-state")).toHaveTextContent("70,80");

    const disabledInput = inputFor("disabled-root");
    expect(disabledInput.disabled).toBe(true);
    await expect.element(page.getByTestId("disabled-root")).toHaveAttribute("data-disabled");

    const form = document.querySelector<HTMLFormElement>('[data-testid="form"]');
    const data = new FormData(form ?? undefined);
    expect(data.getAll("window")).toEqual(["10", "90"]);
    expect(inputFor("vertical-root").getAttribute("aria-orientation")).toBe("vertical");
    await expect
      .element(page.getByTestId("bound-root"))
      .toHaveAttribute("aria-label", "Bound volume");
  });

  test("updates and commits values through track press and pointer drag", async () => {
    render(SliderFixture);
    const root = document.querySelector<HTMLElement>('[data-testid="pointer-root"]');
    const control = root?.querySelector<HTMLElement>('[data-slot="slider-control"]');
    if (!control) throw new Error("Missing pointer control");
    const rect = control.getBoundingClientRect();
    const y = rect.top + rect.height / 2;
    control.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        buttons: 1,
        clientX: rect.left + rect.width * 0.5,
        clientY: y,
        pointerId: 1,
      }),
    );
    document.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        buttons: 1,
        clientX: rect.left + rect.width * 0.75,
        clientY: y,
        pointerId: 1,
      }),
    );
    document.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        button: 0,
        clientX: rect.left + rect.width * 0.75,
        clientY: y,
        pointerId: 1,
      }),
    );

    await expect.element(page.getByTestId("changed")).toHaveTextContent("75");
    await expect.element(page.getByTestId("committed")).toHaveTextContent("75");
    await expect.element(page.getByTestId("pointer-root")).not.toHaveAttribute("data-dragging");
  });

  test("forwards none and swap collision behavior through the styled wrapper", async () => {
    render(SliderFixture);

    for (const [testId, outputId, expected] of [
      ["collision-none-root", "collision-none-state", "40,40"],
      ["collision-swap-root", "collision-swap-state", "40,70"],
    ] as const) {
      const root = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
      const control = root?.querySelector<HTMLElement>('[data-slot="slider-control"]');
      const thumb = root?.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]')[0];
      if (!control || !thumb) throw new Error(`Missing collision fixture for ${testId}`);
      const rect = control.getBoundingClientRect();
      const y = rect.top + rect.height / 2;
      thumb.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          button: 0,
          buttons: 1,
          clientX: rect.left + rect.width * 0.2,
          clientY: y,
          pointerId: 2,
        }),
      );
      document.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          buttons: 1,
          clientX: rect.left + rect.width * 0.7,
          clientY: y,
          pointerId: 2,
        }),
      );
      document.dispatchEvent(
        new PointerEvent("pointerup", {
          bubbles: true,
          clientX: rect.left + rect.width * 0.7,
          clientY: y,
          pointerId: 2,
        }),
      );
      await expect.element(page.getByTestId(outputId)).toHaveTextContent(expected);
    }
  });

  test("hydrates scalar and range roots without mismatch warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const cases = [
      {
        props: { "aria-label": "Hydrated scalar", value: 25 },
        thumbs: 1,
      },
      {
        props: { "aria-label": "Hydrated range", value: [25, 75] },
        thumbs: 2,
      },
    ] as const;

    for (const item of cases) {
      const target = document.createElement("div");
      target.innerHTML = await commands.renderSlider(item.props.value);
      document.body.append(target);
      const component = hydrate(SliderRoot, { props: item.props, target });
      expect(warning).not.toHaveBeenCalled();
      expect(target.querySelectorAll('input[type="range"]')).toHaveLength(item.thumbs);
      await unmount(component);
      target.remove();
    }
    warning.mockRestore();
  }, 30_000);
});
