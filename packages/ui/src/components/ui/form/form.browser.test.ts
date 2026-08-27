import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import FormFixture from "./form.browser-fixture.svelte";
import Form from "./form.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Form browser contract", () => {
  test("preserves native submit/FormData and supports Shards values plus validation focus", async () => {
    render(FormFixture);

    await page.getByRole("button", { name: "Native submit" }).click();
    await expect.element(page.getByTestId("native-result")).toHaveTextContent("miel@example.com");
    const nativeForm = document.querySelector<HTMLFormElement>('[data-testid="native-form"]');
    expect(nativeForm?.method).toBe("post");
    expect(nativeForm?.getAttribute("action")).toBe("?/save");

    await page.getByRole("button", { name: "Values submit" }).click();
    await expect
      .element(page.getByTestId("username-error"))
      .toHaveTextContent("Username is required.");
    await expect.element(page.getByTestId("username")).toHaveFocus();
    await page.getByTestId("username").fill("miel");
    await page.getByRole("button", { name: "Values submit" }).click();
    await expect.element(page.getByTestId("values-result")).toHaveTextContent("miel");

    await expect.element(page.getByTestId("server-error")).toHaveTextContent("Already used.");
    await expect
      .element(page.getByTestId("server-control"))
      .toHaveAttribute("aria-invalid", "true");
  });

  test("hydrates a native server-action form without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<form novalidate action="?/save" method="POST" data-slot="form" data-testid="hydrated-form"></form>';
    document.body.append(target);

    const component = hydrate(Form, {
      props: { action: "?/save", "data-testid": "hydrated-form", method: "POST" },
      target,
    });

    expect(warning).not.toHaveBeenCalled();
    await expect.element(page.getByTestId("hydrated-form")).toHaveAttribute("action", "?/save");
    await unmount(component);
    warning.mockRestore();
  });

  test("forwards validate, attachments, and delayed external errors through the wrapper", async () => {
    render(FormFixture);

    await expect.element(page.getByTestId("attached-tag")).toHaveTextContent("FORM");

    await page.getByTestId("validate-all").click();
    await expect.element(page.getByTestId("all-first-error")).toHaveTextContent("First required.");
    await expect
      .element(page.getByTestId("all-second-error"))
      .toHaveTextContent("Second required.");

    await page.getByTestId("validate-one").click();
    await expect.element(page.getByTestId("one-first-error")).not.toBeInTheDocument();
    await expect
      .element(page.getByTestId("one-second-error"))
      .toHaveTextContent("Second required.");

    await page.getByTestId("delayed-submit").click();
    await expect
      .element(page.getByTestId("delayed-first-error"))
      .toHaveTextContent("First server error.");
    await expect.element(page.getByTestId("delayed-first")).toHaveFocus();
    await expect
      .element(page.getByTestId("delayed-second-error"))
      .toHaveTextContent("Second server error.");
  });
});
