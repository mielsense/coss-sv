import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import FieldFixture from "./field.svelte";
import FieldsetFixture from "./fieldset.svelte";
import FormFixture from "./form.svelte";
import GroupFixture from "./group.svelte";
import InputGroupFixture from "./input-group.svelte";

function particleAnchors(body: string): string[] {
  return Array.from(body.matchAll(/data-particle="([^"]+)"/g), (match) => String(match[1]));
}

function expectExactAnchors(body: string, expected: string[]) {
  expect(particleAnchors(body)).toEqual(expected);
  for (const name of expected) expect(body).toContain(`id="${name}"`);
}

describe("C7 parity fixture inventory", () => {
  test("renders every dependency-free Field particle in source order", () => {
    const body = render(FieldFixture).body;

    expectExactAnchors(body, [
      "p-field-1",
      "p-field-2",
      "p-field-3",
      "p-field-4",
      "p-field-5",
      "p-field-6",
      "p-field-10",
      "p-field-12",
      "p-field-15",
    ]);
  });

  test("renders the complete Fieldset and Form inventories", () => {
    expectExactAnchors(render(FieldsetFixture).body, ["p-fieldset-1"]);
    expectExactAnchors(render(FormFixture).body, ["p-form-1", "p-form-2"]);
  });

  test("renders every dependency-free Group particle in source order", () => {
    expectExactAnchors(render(GroupFixture).body, [
      "p-group-7",
      "p-group-8",
      "p-group-9",
      "p-group-10",
      "p-group-16",
      "p-group-17",
      "p-group-20",
    ]);
  });

  test("renders every dependency-free InputGroup particle in source order", () => {
    expectExactAnchors(render(InputGroupFixture).body, [
      "p-input-group-1",
      "p-input-group-2",
      "p-input-group-3",
      "p-input-group-4",
      "p-input-group-5",
      "p-input-group-9",
      "p-input-group-10",
      "p-input-group-11",
      "p-input-group-13",
      "p-input-group-14",
      "p-input-group-15",
      "p-input-group-16",
      "p-input-group-19",
      "p-input-group-20",
      "p-input-group-22",
      "p-input-group-24",
      "p-input-group-26",
    ]);
  });
});
