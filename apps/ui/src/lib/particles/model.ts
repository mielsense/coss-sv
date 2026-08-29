import { type ParticleCatalogEntry, type ParticleCategory, particleCategories } from "./catalog.js";

export type ParticleSearchItem = {
  label: string;
  value: ParticleCategory;
};

export type ParticleSearchGroup = {
  items: ParticleSearchItem[];
  type: "enabled" | "disabled";
};

const categoryOrder = new Map(
  particleCategories.map((category, index) => [category, index] as const),
);

function isParticleCategory(value: string): value is ParticleCategory {
  return categoryOrder.has(value as ParticleCategory);
}

function categorySortOrder(category: string): number {
  return categoryOrder.get(category as ParticleCategory) ?? Number.POSITIVE_INFINITY;
}

function titleCaseCategory(category: string): string {
  return category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function parseParticleTags(tags: string | null): {
  invalid: string[];
  valid: ParticleCategory[];
} {
  const values = tags?.split(",").filter(Boolean) ?? [];
  return {
    invalid: values.filter((value) => !isParticleCategory(value)),
    valid: values.filter(isParticleCategory),
  };
}

function relevanceWeight(
  particle: ParticleCatalogEntry,
  searchTerms: readonly ParticleCategory[],
): number {
  let weight = 0;
  for (const term of searchTerms) {
    const normalizedTerm = term.replace(/\s+/g, "-");
    if (particle.name.startsWith(`p-${normalizedTerm}-`)) weight += 30;
    if (particle.registryDependencies.includes(`@coss/${normalizedTerm}`)) weight += 20;
    if (particle.categories[0] === term) weight += 10;
  }
  return weight;
}

export function filterParticles<const Particle extends ParticleCatalogEntry>(
  particles: readonly Particle[],
  selectedCategories: readonly ParticleCategory[],
): Particle[] {
  return particles
    .filter((particle) =>
      selectedCategories.every((category) => particle.categories.includes(category)),
    )
    .toSorted(
      (left, right) =>
        relevanceWeight(right, selectedCategories) - relevanceWeight(left, selectedCategories),
    );
}

export function getParticleSearchItems(
  particles: readonly ParticleCatalogEntry[],
): ParticleSearchItem[] {
  const categories = new Set(
    particles.flatMap(({ categories }) => categories.filter(isParticleCategory)),
  );
  return [...categories]
    .toSorted((left, right) => categorySortOrder(left) - categorySortOrder(right))
    .map((category) => ({ label: titleCaseCategory(category), value: category }));
}

export function groupParticleSearchItems(
  items: readonly ParticleSearchItem[],
  selectedItems: readonly ParticleSearchItem[],
  particles: readonly ParticleCatalogEntry[],
): ParticleSearchGroup[] {
  const selectedValues = selectedItems.map(({ value }) => value);
  const enabled: ParticleSearchItem[] = [];
  const disabled: ParticleSearchItem[] = [];

  for (const item of items) {
    const isSelected = selectedValues.includes(item.value);
    const hasMatches = particles.some(({ categories }) =>
      [...selectedValues, item.value].every((value) => categories.includes(value)),
    );
    (isSelected || hasMatches ? enabled : disabled).push(item);
  }

  enabled.sort((left, right) => {
    const leftSelected = selectedValues.includes(left.value);
    const rightSelected = selectedValues.includes(right.value);
    if (leftSelected !== rightSelected) return leftSelected ? -1 : 1;
    return categorySortOrder(left.value) - categorySortOrder(right.value);
  });
  disabled.sort((left, right) => categorySortOrder(left.value) - categorySortOrder(right.value));

  const groups: ParticleSearchGroup[] = [];
  if (enabled.length > 0) groups.push({ items: enabled, type: "enabled" });
  if (disabled.length > 0) groups.push({ items: disabled, type: "disabled" });
  return groups;
}
