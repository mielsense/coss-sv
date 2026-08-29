import "../../src/tailwind.css";
import "../../src/app.css";
import { mount, tick, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import AutocompleteExample from "../../registry/default/particles/p-autocomplete-1.svelte";
import AsyncAutocompleteExample from "../../registry/default/particles/p-autocomplete-12.svelte";
import PlacesAutocompleteExample from "../../registry/default/particles/p-autocomplete-16.svelte";
import LabelledComboboxExample from "../../registry/default/particles/p-combobox-5.svelte";
import ComboboxExample from "../../registry/default/particles/p-combobox-9.svelte";
import MultipleFormComboboxExample from "../../registry/default/particles/p-combobox-12.svelte";
import CommandExample from "../../registry/default/particles/p-command-1.svelte";
import CommandAiExample from "../../registry/default/particles/p-command-2.svelte";
import ContextMenuExample from "../../registry/default/particles/p-context-menu-1.svelte";
import MenuExample from "../../registry/default/particles/p-menu-1.svelte";
import SelectExample from "../../registry/default/particles/p-select-7.svelte";
import ToolbarExample from "../../registry/default/particles/p-toolbar-1.svelte";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("D8 selection, command, and menu examples", () => {
  test("filters autocomplete and accepts the highlighted value with the keyboard", async () => {
    const view = mount(AutocompleteExample, { target: document.body });
    const input = page.getByRole("combobox", { name: "Search items" });
    await userEvent.fill(input, "gra");
    await expect.element(page.getByRole("option", { name: "Grape" })).toBeVisible();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect.element(input).toHaveValue("Grape");
    await unmount(view);
  });
  test("adds and removes combobox multiple values without losing the input", async () => {
    const view = mount(ComboboxExample, { target: document.body });
    const input = page.getByRole("combobox", { name: "Select a item" });
    await input.click();
    await userEvent.fill(input, "banana");
    await page.getByRole("option", { name: "Banana" }).click();
    await expect.element(page.getByText("Banana", { exact: true })).toBeVisible();
    const bananaChip = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="combobox-chip"]'),
    ).find((chip) => chip.textContent?.includes("Banana"));
    bananaChip?.querySelector<HTMLButtonElement>('[data-slot="combobox-chip-remove"]')?.click();
    await expect
      .poll(() => document.querySelectorAll('[data-slot="combobox-chip"]'))
      .toHaveLength(2);
    await unmount(view);
  });
  test("focuses the labelled combobox input when its visible label is clicked", async () => {
    const view = mount(LabelledComboboxExample, { target: document.body });
    const label = page.getByText("Fruits", { exact: true });
    const input = page.getByRole("combobox", { name: "Select an item" });
    expect(label.element().getAttribute("for")).toBe(input.element().id);
    await label.click();
    await expect.element(input).toHaveFocus();
    await unmount(view);
  });
  test("supports multiple select keyboard selection and escape dismissal", async () => {
    const view = mount(SelectExample, { target: document.body });
    const trigger = page.getByRole("combobox", { name: "Select languages" });
    trigger.element().focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByRole("option", { name: "Python" })).toBeVisible();
    await userEvent.keyboard("{End}{ArrowUp} ");
    await userEvent.keyboard("{Escape}");
    await expect.element(trigger).toHaveFocus();
    await unmount(view);
  });
  test("opens command palette from its global shortcut and closes on selection", async () => {
    const view = mount(CommandExample, { target: document.body });
    await userEvent.keyboard("{Control>}j{/Control}");
    await expect.element(page.getByRole("dialog")).toBeVisible();
    const input = page.getByPlaceholder("Search for apps and commands...");
    await userEvent.fill(input, "Linear");
    await page.getByRole("option", { name: /Linear/ }).click();
    await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull();
    await unmount(view);
  });
  test("moves focus into and back out of the AI view without dismissing the dialog", async () => {
    const view = mount(CommandAiExample, { target: document.body });
    await page.getByRole("button", { name: "Cmdk with AI" }).click();
    const search = page.getByPlaceholder("Type a command or search...");
    await expect.element(search).toHaveFocus();
    await page.getByRole("button", { name: /Ask AI Tab/ }).click();
    const aiInput = page.getByRole("textbox", { name: "AI query input" });
    await expect.element(aiInput).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect.element(page.getByRole("dialog")).toBeVisible();
    await expect.element(search).toHaveFocus();
    await unmount(view);
  });
  test("renders the complete AI response panel and response footer", async () => {
    const view = mount(CommandAiExample, { target: document.body });
    await page.getByRole("button", { name: "Cmdk with AI" }).click();
    const search = page.getByPlaceholder("Type a command or search...");
    await search.fill("create a project");
    await page.getByRole("button", { name: /Ask AI Tab/ }).click();
    await expect.element(page.getByRole("textbox", { name: "AI query input" })).toBeDisabled();
    expect(document.querySelector('[data-slot="scroll-area-viewport"]')).not.toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 1_600));
    await expect.element(page.getByText("Creating Projects", { exact: true })).toBeVisible();
    await expect.element(page.getByText(/You asked:/)).toBeVisible();
    const footer = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="command-footer"]'),
    ).find((element) => element.textContent?.includes("You asked:"));
    expect(footer?.querySelector("svg")).not.toBeNull();
    await unmount(view);
  });
  test("operates menu checkbox, radio, and nested submenu with keyboard", async () => {
    const view = mount(MenuExample, { target: document.body });
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    const shuffle = page.getByRole("menuitemcheckbox", { name: "Shuffle" });
    await shuffle.click();
    await expect.element(shuffle).toHaveAttribute("aria-checked", "true");
    const add = page.getByRole("menuitem", { name: "Add to Playlist" });
    add.element().focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByRole("menuitem", { name: "Jazz" })).toBeVisible();
    await userEvent.keyboard("{Escape}{Escape}");
    await expect.element(trigger).toHaveFocus();
    await unmount(view);
  });
  test("opens a context menu at the pointer and dismisses it with escape", async () => {
    const view = mount(ContextMenuExample, { target: document.body });
    const region = page.getByText("Right click here", { exact: true });
    region
      .element()
      .dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, button: 2, clientX: 80, clientY: 64 }),
      );
    await expect.element(page.getByRole("menuitem", { name: "Back" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect.poll(() => document.querySelector('[role="menuitem"]')).toBeNull();
    await unmount(view);
  });
  test("keeps the toolbar one keyboard sequence with named controls", async () => {
    const view = mount(ToolbarExample, { target: document.body });
    const after = document.createElement("button");
    after.textContent = "After toolbar";
    document.body.append(after);
    const left = page.getByRole("button", { name: "Align left" });
    const toolbar = page.getByRole("toolbar", { name: "Text formatting" });
    await expect.element(toolbar).toBeVisible();
    const toolbarElement = left.element().closest<HTMLElement>('[role="toolbar"]');
    expect(toolbarElement).not.toBeNull();
    await expect.element(left).toHaveAttribute("data-slot", "toggle");
    await expect
      .element(page.getByRole("button", { name: "Format as currency" }))
      .toHaveAttribute("data-slot", "toolbar-button");
    await expect
      .element(page.getByRole("combobox", { name: "Helvetica" }))
      .toHaveAttribute("data-slot", "select-trigger");
    left.element().focus();
    await expect
      .poll(
        () =>
          Array.from(
            toolbarElement?.querySelectorAll<HTMLElement>('button,[role="combobox"]') ?? [],
          ).filter((control) => control.tabIndex === 0).length,
      )
      .toBe(1);
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByRole("button", { name: "Toggle center" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByRole("button", { name: "Toggle right" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByRole("button", { name: "Format as currency" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect.element(page.getByRole("combobox", { name: "Helvetica" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(page.getByRole("button", { name: "Save" })).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    expect(document.activeElement).toBe(after);
    await unmount(view);
  });

  test("attaches tooltip focus and hover semantics to the actual toolbar controls", async () => {
    const view = mount(ToolbarExample, { target: document.body });
    const left = page.getByRole("button", { name: "Align left" });
    const currency = page.getByRole("button", { name: "Format as currency" });
    const font = page.getByRole("combobox", { name: "Helvetica" });

    expect(left.element().parentElement?.matches('[data-slot="tooltip-trigger"]')).toBe(false);
    await expect.element(left).toHaveAttribute("data-tooltip-trigger");
    left.element().focus();
    await expect.element(left).toHaveAttribute("data-popup-open");
    await expect.element(page.getByRole("tooltip", { name: "Align left" })).toBeVisible();
    const leftDescription = left.element().getAttribute("aria-describedby");
    expect(leftDescription).toBeTruthy();
    expect(document.getElementById(leftDescription ?? "")?.textContent).toContain("Align left");

    await userEvent.hover(currency);
    await expect.element(page.getByRole("tooltip", { name: "Format as currency" })).toBeVisible();
    const currencyDescription = currency.element().getAttribute("aria-describedby");
    expect(currencyDescription).toBeTruthy();
    expect(document.getElementById(currencyDescription ?? "")?.textContent).toContain(
      "Format as currency",
    );

    font.element().focus();
    await expect
      .element(page.getByRole("tooltip", { name: "Select a different font" }))
      .toBeVisible();
    expect(font.element().getAttribute("aria-describedby")).toBeTruthy();
    await unmount(view);
  });

  test("renders the deterministic async autocomplete error after real debounce timers", async () => {
    const view = mount(AsyncAutocompleteExample, { target: document.body });
    const input = page.getByRole("combobox");
    await userEvent.fill(input, "will_error");
    await expect.element(page.getByText("Searching...", { exact: true })).toBeVisible();
    await expect
      .poll(
        () =>
          document.body.textContent?.includes("Failed to fetch movies. Please try again.") ?? false,
        { timeout: 2_000 },
      )
      .toBe(true);
    await expect.element(page.getByText("Failed to fetch movies. Please try again.")).toBeVisible();
    await unmount(view);
  });

  test("debounces async movies for 300ms, honors the simulated request delay, and cancels teardown", async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const view = mount(AsyncAutocompleteExample, { target: document.body });
    const input = page.getByRole("combobox");

    await input.fill("pulp");
    expect(document.body.textContent).toContain("Searching...");
    await vi.advanceTimersByTimeAsync(649);
    expect(document.querySelector('[role="option"]')).toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    expect(document.body.textContent).toContain("Pulp Fiction");

    await input.fill("god");
    await vi.advanceTimersByTimeAsync(300);
    await input.fill("inception");
    await vi.advanceTimersByTimeAsync(649);
    expect(document.body.textContent).not.toContain("The Godfather");
    await vi.advanceTimersByTimeAsync(1);
    expect(document.body.textContent).toContain("Inception");

    await input.fill("pending");
    await unmount(view);
    await vi.advanceTimersByTimeAsync(1_000);
    expect(document.body.textContent).not.toContain("pending");
  });

  test("uses the public Vite Places key, aborts stale requests, and resets the session token", async () => {
    vi.useFakeTimers();
    vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", "maps-test-key");
    const requests: Array<{
      body: { input: string; sessionToken: string };
      resolve?: () => void;
      signal: AbortSignal;
    }> = [];
    const fetchMock = vi.fn((_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { input: string; sessionToken: string };
      const response = {
        json: async () => ({
          suggestions: [
            {
              placePrediction: {
                placeId: `place-${body.input}`,
                structuredFormat: {
                  mainText: { text: `${body.input} main` },
                  secondaryText: { text: `${body.input} secondary` },
                },
                text: { text: `${body.input} result` },
              },
            },
          ],
        }),
        ok: true,
      } as Response;
      if (body.input === "second") {
        requests.push({ body, signal: init?.signal as AbortSignal });
        return Promise.resolve(response);
      }
      return new Promise<Response>((resolve) => {
        requests.push({
          body,
          resolve: () => resolve(response),
          signal: init?.signal as AbortSignal,
        });
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    const view = mount(PlacesAutocompleteExample, { target: document.body });
    const input = page.getByRole("combobox", { name: "Address" });

    await input.fill("first");
    await vi.advanceTimersByTimeAsync(300);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://places.googleapis.com/v1/places:autocomplete",
    );
    const firstFetchInit = fetchMock.mock.calls[0]?.[1];
    if (!firstFetchInit) throw new Error("missing first Places request init");
    expect((firstFetchInit.headers as Record<string, string>)["X-Goog-Api-Key"]).toBe(
      "maps-test-key",
    );
    expect(requests[0]?.body.input).toBe("first");
    const firstToken = requests[0]?.body.sessionToken;
    expect(firstToken).toBeTruthy();

    await input.fill("second");
    const firstRequest = requests[0];
    if (!firstRequest?.resolve) throw new Error("missing pending first Places request");
    expect(firstRequest.signal.aborted).toBe(true);
    firstRequest.resolve();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(300);
    expect(requests[1]?.body.sessionToken).toBe(firstToken);
    await tick();
    (
      page.getByRole("option", { name: "second main second secondary" }).element() as HTMLElement
    ).click();
    await tick();

    await input.fill("third");
    await vi.advanceTimersByTimeAsync(300);
    expect(requests[2]?.body.sessionToken).not.toBe(firstToken);
    await unmount(view);
    expect(requests[2]?.signal.aborted).toBe(true);
  });

  test("falls back to sample Places data without a key and renders request errors", async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const fallbackView = mount(PlacesAutocompleteExample, { target: document.body });
    const fallbackInput = page.getByRole("combobox", { name: "Address" });

    await fallbackInput.fill("Amphitheatre");
    await vi.advanceTimersByTimeAsync(649);
    expect(document.querySelector('[role="option"]')).toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    await expect
      .element(page.getByRole("option", { name: /1600 Amphitheatre Parkway/ }))
      .toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
    await unmount(fallbackView);

    vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", "maps-test-key");
    fetchMock.mockRejectedValueOnce(new Error("network unavailable"));
    const errorView = mount(PlacesAutocompleteExample, { target: document.body });
    await page.getByRole("combobox", { name: "Address" }).fill("unavailable");
    await vi.advanceTimersByTimeAsync(300);
    await tick();
    await expect
      .element(page.getByText("Could not load address suggestions. Please try again."))
      .toBeVisible();
    await unmount(errorView);
  });

  test("submits multiple combobox item values instead of their visible labels", async () => {
    const alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);
    const view = mount(MultipleFormComboboxExample, { target: document.body });
    const input = page.getByRole("combobox", { name: /Favorite items|Select a item/ });

    await input.fill("Apple");
    await page.getByRole("option", { name: "Apple", exact: true }).click();
    await input.fill("Banana");
    await page.getByRole("option", { name: "Banana", exact: true }).click();
    await page.getByRole("button", { name: "Submit" }).click();

    await expect
      .poll(() => alert.mock.calls[0]?.[0], { timeout: 1_200 })
      .toBe("Favorite items: apple, banana");
    await unmount(view);
  });
});
